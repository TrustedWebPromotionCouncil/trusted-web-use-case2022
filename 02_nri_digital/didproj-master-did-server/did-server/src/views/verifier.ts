import { PrismaClient } from '@prisma/client';
import { JSONSchemaType } from 'ajv';
import { DidObject, Log, SelfIssuedOpenidProviderV2 } from 'did-sdk';
import express from 'express';

import { ajv, createEjsOpt, getQrImgString, httpOrS, setting } from '../common';
import { socketMgr } from '../socket';

const prisma = new PrismaClient();

export const getVerifier = async (_req: express.Request, res: express.Response) => {
  // Verifier全件取得
  const verifierList = await prisma.verifier.findMany({
    include: { presentationDefinitionList: true },
  });
  Log.log('Verifier selected: %d', verifierList.length);

  res.render(
    'verifier',
    createEjsOpt({
      verifierList,
    })
  );
};

export const getPresentationDefinition = async (req: express.Request, res: express.Response) => {
  const { params } = req;
  const schema: JSONSchemaType<{ presentation_id: string }> = {
    type: 'object',
    required: ['presentation_id'],
    properties: {
      presentation_id: { type: 'string', format: 'uuid' },
    },
  };
  const validate = ajv.compile(schema);
  if (!validate(params)) {
    return res
      .status(404)
      .send(validate.errors && validate.errors[0] ? validate.errors[0] : 'Validation error');
  }

  // PresentationDefinition取得
  const presentation = await prisma.presentationDefinition.findUnique({
    where: { id: params.presentation_id },
    include: { verifier: true },
  });
  Log.log('PresentationDefinition selected: %o', presentation);

  if (!presentation) {
    return res.status(404).send();
  }

  // VP提示を作成
  const vp = await prisma.verifiablePresentation.create({
    data: {
      presentationDefineId: presentation.id,
    },
  });

  // URL生成
  const siopUrl = new URL(setting.walletOidcSiopUri);
  siopUrl.searchParams.append('request_uri', `${httpOrS(req.headers.host)}/vp/${vp.id}/present/`);

  // QR
  const qr = await getQrImgString(siopUrl.toString());

  return res.render(
    'vp',
    createEjsOpt({
      presentation,
      vp,
      siopUrl: siopUrl.toString(),
      qr,
    })
  );
};

export const getVpSiopRequest = async (req: express.Request, res: express.Response) => {
  const { params } = req;
  const schema: JSONSchemaType<{ vp_id: string }> = {
    type: 'object',
    required: ['vp_id'],
    properties: {
      vp_id: { type: 'string', format: 'uuid' },
    },
  };
  const validate = ajv.compile(schema);
  if (!validate(params)) {
    return res
      .status(404)
      .send(validate.errors && validate.errors[0] ? validate.errors[0] : 'Validation error');
  }

  const vp = await prisma.verifiablePresentation.findUnique({
    where: { id: params.vp_id },
    include: {
      presentationDefinition: {
        include: { verifier: true },
      },
    },
  });
  Log.log('VerifiablePresentation selected: %o', vp);

  if (!vp) {
    return res.status(404).send();
  }

  const didObj = DidObject.createByJsonString(vp.presentationDefinition.verifier.didObjectJson);
  const authenticationReq = SelfIssuedOpenidProviderV2.createAuthenticationRequest(
    didObj,
    vp.presentationDefinition.verifier.name,
    `${httpOrS(req.headers.host)}/vp/${vp.id}/present/`,
    JSON.parse(vp.presentationDefinition.definitionJson)
  );

  return res.send(authenticationReq.jwt.jws);
};

export const postVpSiopResponse = async (req: express.Request, res: express.Response) => {
  const vpId = req.params.vp_id;
  let vpTokenJwt;
  try {
    const authRes = SelfIssuedOpenidProviderV2.parseAuthenticationResponse(req.body);
    vpTokenJwt = authRes.getVpTokenJwt();
  } catch (e) {
    return res.status(400).send(e instanceof Error ? e.message : '');
  }
  Log.log('vpTokenJwt: %o', vpTokenJwt);

  await prisma.verifiablePresentation.update({
    where: { id: vpId },
    data: {
      vpJson: JSON.stringify(vpTokenJwt.payload),
    },
  });

  socketMgr.send(vpId, 'received_vp', vpTokenJwt.payload.vp);

  return res.send();
};
