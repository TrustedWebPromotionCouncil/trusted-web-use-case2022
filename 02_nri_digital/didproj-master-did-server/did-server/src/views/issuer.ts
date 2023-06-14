import { PrismaClient } from '@prisma/client';
import { JSONSchemaType } from 'ajv';
import dayjs from 'dayjs';
import { CredentialStatusList2017, CredentialStatusList2017VC, DidUtil, Log } from 'did-sdk';
import express from 'express';

import { ajv, createEjsOpt, createPin, getQrImgString, httpOrS, setting } from '../common';

const prisma = new PrismaClient();

export const getIssuer = async (_req: express.Request, res: express.Response) => {
  // Issuer全件取得
  const issuerList = await prisma.issuer.findMany({
    include: { credentialList: true, linkedDomain: true },
  });
  Log.log('Issuer selected: %d', issuerList.length);

  res.render(
    'issuer',
    createEjsOpt({
      issuerList,
    })
  );
};

export const getVerifiableCredential = async (req: express.Request, res: express.Response) => {
  const { params } = req;
  const schema: JSONSchemaType<{ credential_id: string }> = {
    type: 'object',
    required: ['credential_id'],
    properties: {
      credential_id: { type: 'string', format: 'uuid' },
    },
  };
  const validate = ajv.compile(schema);
  if (!validate(params)) {
    return res
      .status(404)
      .send(validate.errors && validate.errors[0] ? validate.errors[0] : 'Validation error');
  }

  // Credential取得
  const credential = await prisma.credential.findUnique({
    where: { id: params.credential_id },
    include: { issuer: true },
  });
  Log.log('Credential selected: %o', credential);

  if (!credential) {
    return res.status(404).send();
  }

  // PIN
  const pin = createPin(6);

  // ワンタイム
  const issuanceOnetime = await prisma.issuanceOnetime.create({
    data: { id: DidUtil.randomString(), credentialId: credential.id, pin },
  });

  // URL生成
  const issuanceUrl = new URL(setting.walletIssuanceUri);
  const issuerUrl = `${httpOrS(req.headers.host)}/issuer/${credential.issuer.id}/`;
  issuanceUrl.searchParams.append('issuer', issuerUrl);
  issuanceUrl.searchParams.append('credential_type', `${issuerUrl}${credential.type}`);
  issuanceUrl.searchParams.append('op_state', issuanceOnetime.id);

  // QR
  const qr = await getQrImgString(issuanceUrl.toString());

  return res.render(
    'vc',
    createEjsOpt({
      credential,
      issuanceUrl: issuanceUrl.toString(),
      qr,
      pin,
    })
  );
};

export const getVerifiableCredentialStatus = async (
  req: express.Request,
  res: express.Response
) => {
  const vcId = req.params.vc_id;

  // Vc & Status取得
  const vc = await prisma.verifiableCredential.findUnique({
    where: { id: vcId },
    include: {
      verifiableCredentialStatusList: {
        orderBy: { id: 'desc' },
      },
      credential: true,
    },
  });
  Log.log('VerifiableCredential selected: %o', vc);

  if (!vc) {
    return res.status(404).send();
  }

  const statusList = [];
  for (const status of vc.verifiableCredentialStatusList) {
    const status2017VC: CredentialStatusList2017VC = {
      claim: {
        id: `${httpOrS(req.headers.host)}/credential/${vc.credentialId}`,
        currentStatus: status.status,
        statusReason: status.reason,
      },
      issuer: `${httpOrS(req.headers.host)}/issuer/${vc.credential.issuerId}/`,
      issued: dayjs(status.createdAt).format(),
    };
    statusList.push(status2017VC);
  }

  const status2017: CredentialStatusList2017 = {
    id: `${httpOrS(req.headers.host)}/issuer/vcstatus/${vc.id}`,
    description: '',
    verifiableCredential: statusList,
  };

  return res.json(status2017);
};
