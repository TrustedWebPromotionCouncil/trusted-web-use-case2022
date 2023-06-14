import { PrismaClient } from '@prisma/client';
import { JSONSchemaType } from 'ajv';
import dayjs from 'dayjs';
import { CredentialMetadata, DidObject, DidUtil, Log, OpenidVcIssuance } from 'did-sdk';
import express from 'express';

import { AccessTokenOptions, ajv, createEjsOpt, didMgr, httpOrS } from '../common';
import { createOpenidConfigration } from './functions';

const prisma = new PrismaClient();

export const getOpenidConfigration = async (req: express.Request, res: express.Response) => {
  const { params } = req;
  const schema: JSONSchemaType<{ issuer_id: string }> = {
    type: 'object',
    required: ['issuer_id'],
    properties: {
      issuer_id: { type: 'string', format: 'uuid' },
    },
  };
  const validate = ajv.compile(schema);
  if (!validate(params)) {
    return res
      .status(404)
      .send(validate.errors && validate.errors[0] ? validate.errors[0] : 'Validation error');
  }

  // Issuer & Credential 取得
  const issuer = await prisma.issuer.findUnique({
    where: { id: params.issuer_id },
    include: { credentialList: true },
  });
  Log.log('Issuer selected: %o', issuer);

  if (!issuer) {
    return res.status(404).send();
  }

  const config = await createOpenidConfigration(req, issuer, issuer.credentialList);
  return res.json(config);
};

const authorization = async (
  req: express.Request,
  res: express.Response,
  param: Record<string, unknown>
) => {
  let errorMessage = '';

  let authReq;
  try {
    authReq = OpenidVcIssuance.parseAuthorizationRequest(param);
  } catch (e) {
    return res.status(400).send(e instanceof Error ? e.message : '');
  }
  Log.log('authReq: %o', authReq);

  // IssuanceOnetime取得
  const issuanceOnetime = await prisma.issuanceOnetime.findUnique({
    where: { id: authReq.opState },
    include: { credential: true },
  });
  Log.log('IssuanceOnetime selected: %o', issuanceOnetime);

  if (!issuanceOnetime) {
    return res.status(404).send('Invalid OneTime');
  }

  const { credential } = issuanceOnetime;

  if (req.method === 'POST') {
    // 認証
    const { pin } = param;
    if (pin === issuanceOnetime.pin) {
      // code生成とAuthorizationCode保存
      const code = DidUtil.randomString();
      await prisma.authorizationCode.create({
        data: {
          code,
          clientId: authReq.clientId,
          codeChallengeJson: JSON.stringify({
            codeChallenge: authReq.codeChallenge,
            codeChallengeMethod: authReq.codeChallengeMethod,
          }),
          redirectUri: authReq.redirectUri,
          credentialId: issuanceOnetime.credentialId,
        },
      });

      // IssuanceOnetime削除
      await prisma.issuanceOnetime.delete({ where: { id: authReq.opState } });

      // リダイレクト
      return res.redirect(authReq.generateRedirect(code).toString());
    }

    errorMessage = '入力されたPINが不正です。';
  }

  return res.render('authorization', createEjsOpt({ param, errorMessage, credential }));
};

export const getAuthorization = async (req: express.Request, res: express.Response) =>
  authorization(req, res, req.query);

export const postAuthorization = async (req: express.Request, res: express.Response) =>
  authorization(req, res, req.body);

export const postToken = async (req: express.Request, res: express.Response) => {
  // リクエスト解析
  let tokenReq;
  try {
    tokenReq = OpenidVcIssuance.parseTokenRequest(req.body);
  } catch (e) {
    return res.status(400).send(e instanceof Error ? e.message : '');
  }
  Log.log('TokenReq: %o', tokenReq);

  // AuthorizationCode取得
  const authorizationCode = await prisma.authorizationCode.findUnique({
    where: { code: tokenReq.code },
  });
  Log.log('authorizationCode selected: %o', authorizationCode);

  if (!authorizationCode) {
    return res.status(400).send('Invalid code');
  }

  if (authorizationCode.codeChallengeJson) {
    // codeChallengeがある場合
    const codeChallenge: {
      codeChallenge: string;
      codeChallengeMethod: 'S256';
    } = JSON.parse(authorizationCode.codeChallengeJson);
    if (!tokenReq.verify({ redirectUri: tokenReq.redirectUri, ...codeChallenge })) {
      return res.status(400).send('Invalid client_id or redirect_uri');
    }
  }

  if (!tokenReq.verify({ redirectUri: tokenReq.redirectUri })) {
    return res.status(400).send('Invalid client_id or redirect_uri');
  }

  // AccessTokenの生成と保存
  const accessToken = DidUtil.randomString();
  const nonce = DidUtil.randomString();
  await prisma.accessToken.create({
    data: {
      token: accessToken,
      credentialId: authorizationCode.credentialId,
      optionsJson: AccessTokenOptions.stringify({ nonce }),
    },
  });

  return res.json(
    tokenReq.generateResponse({
      access_token: accessToken,
      expires_in: 86400,
      c_nonce: nonce,
      c_nonce_expires_in: 86400,
    })
  );
};

const getBearer = (req: express.Request) => {
  if (req.headers.authorization) {
    const bearer = req.headers.authorization.split(' ');
    if (bearer.length > 1) {
      return bearer[1];
    }
  }
  return undefined;
};

export const postCredential = async (req: express.Request, res: express.Response) => {
  // Bearer(AccessToken)チェック
  const token = getBearer(req);
  const accessToken = await prisma.accessToken.findUnique({
    where: { token },
    include: { credential: { include: { issuer: true } } },
  });
  Log.log('accessToken selected: %o', accessToken);

  if (!accessToken) {
    return res.status(400).send('Authorization NG');
  }

  // リクエスト解析
  let credentialReq;
  try {
    credentialReq = OpenidVcIssuance.parseCredentialRequest(req.body);
    Log.log('credentialReq: %o', credentialReq);

    // Credential Typeチェック
    const regexp = new RegExp(`${accessToken.credential.type}$`);
    if (!regexp.test(credentialReq.type)) {
      return res.status(400).send('Invalid type');
    }

    // JWT署名チェック
    if (!(await credentialReq.verifySign(didMgr))) {
      return res.status(400).send('JWT verify is NG');
    }

    // Nonceチェック
    const accessTokenOptions = AccessTokenOptions.parse(accessToken.optionsJson);
    if (accessTokenOptions.nonce !== credentialReq.proof.jwt.payload.nonce) {
      return res.status(400).send('Invalid nonce');
    }
    Log.log('Nonce check OK');

    const { credential } = accessToken;
    const credentialMetadata: CredentialMetadata = JSON.parse(credential.metadataJson);
    const issuanceDate = dayjs();
    const expirationDate = issuanceDate.add(1, 'year');
    const didObj = DidObject.createByJsonString(credential.issuer.didObjectJson);

    // VC発行
    const credentialSubject = {
      id: credentialReq.proof.jwt.header.kid.split('#')[0],
    };
    const vc = await prisma.verifiableCredential.create({
      data: {
        credentialId: credential.id,
        credentialSubjectJson: JSON.stringify(credentialSubject),
      },
    });

    // @todo credentialSubjectは暫定
    res.json(
      credentialReq.generateResponse(
        {
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          id: `${httpOrS(req.headers.host)}/credential/${credential.id}`,
          type: credentialMetadata.formats.jwt_vc.types,
          issuer: `${httpOrS(req.headers.host)}/issuer/${credential.issuer.id}/`,
          issuanceDate: issuanceDate.format(),
          expirationDate: expirationDate.format(),
          credentialSubject,
          credentialStatus: {
            id: `${httpOrS(req.headers.host)}/vcstatus/${vc.id}`,
            type: 'CredentialStatusList2017',
          },
        },
        didObj
      )
    );
  } catch (e) {
    return res.status(400).send(e instanceof Error ? e.message : '');
  }
  return res.send();
};
