import { CredentialMetadata, DidObject, LinkedDomain, Log, PresentationDefinition } from 'did-sdk';
import express from 'express';

import { createEjsOpt, didMgr, httpOrS, prisma, saveSetting, setting } from '../common';
import { createOpenidConfigration, createWellKnownDidConfiguration } from './functions';

export const getSetting = async (_req: express.Request, res: express.Response) => {
  res.render('manage/setting', createEjsOpt({ setting }));
};

export const postSetting = async (req: express.Request, res: express.Response) => {
  if (req.body.type_save !== undefined) {
    setting.walletIssuanceUri = req.body.wallet_issuance_uri;
    setting.walletOidcSiopUri = req.body.wallet_oidc_siop_uri;

    saveSetting(setting);
  }

  res.redirect('.');
};

export const getManageIssuer = async (_req: express.Request, res: express.Response) => {
  // Issuer全件取得
  const issuerList = await prisma.issuer.findMany({ include: { linkedDomain: true } });
  Log.log('Issuer selected: %d', issuerList.length);

  const wellKnownDidConfigurationJson = JSON.stringify(
    await createWellKnownDidConfiguration(),
    null,
    2
  );

  res.render(
    'manage/issuer',
    createEjsOpt({
      issuerList,
      wellKnownDidConfigurationJson,
    })
  );
};

export const postManageIssuer = async (req: express.Request, res: express.Response) => {
  if (req.body.type_save !== undefined) {
    if (req.body.id) {
      // 更新
      const issuer = await prisma.issuer.update({
        where: { id: req.body.id },
        data: {
          name: req.body.name,
        },
      });
      Log.log('Issuer updated: %o', issuer);
    } else {
      // 新規

      // DID作成
      const didObj = await didMgr.createDidLinkedDomains({
        signingKeyId: 'signingKey',
        domain: httpOrS(req.headers.host),
      });
      Log.log('DID created: %o', didObj);

      // Issuer登録
      const issuer = await prisma.issuer.create({
        data: {
          name: req.body.name,
          didObjectJson: JSON.stringify(didObj),
        },
      });
      Log.log('Issuer created: %o', issuer);
    }
  }

  res.redirect('.');
};

export const getResolveIssuer = async (req: express.Request, res: express.Response) => {
  const issuerId = req.params.issuer_id;
  const issuer = await prisma.issuer.findUnique({ where: { id: issuerId } });

  if (!issuer) {
    return res.status(404).send();
  }

  const didObj = DidObject.createByJsonString(issuer.didObjectJson);
  try {
    const didDocument = await didMgr.resolveDid(didObj.did);

    if (!didObj.published) {
      // DIDがまだ published = false の場合
      if (didDocument.didDocumentMetadata.method.published) {
        // DID Documentのpublishedをチェックして、必要なら更新
        didObj.published = true;
        await prisma.issuer.update({
          where: { id: issuerId },
          data: { didObjectJson: JSON.stringify(didObj) },
        });
      }
    }

    return res.json(didDocument);
  } catch {
    //
  }
  return res.json({ error: 'Not found.' });
};

const CREDENTIAL_METADATA_SAMPLE: CredentialMetadata = {
  display: [
    {
      name: '在籍証明書',
      locale: 'ja',
      description: 'XXXX大学に在籍することを証明する。',
      background_color: '#12107c',
      text_color: '#FFFFFF',
    },
  ],
  formats: {
    jwt_vc: {
      types: ['VerifiableCredential', 'UniversityDegreeCredential'],
      cryptographic_binding_methods_supported: ['did'],
      cryptographic_suites_supported: ['ES256K'],
    },
  },
  claims: {
    given_name: {
      mandatory: false,
      display: [
        {
          name: '名',
          locale: 'ja',
        },
      ],
    },
    last_name: {
      mandatory: false,
      display: [
        {
          name: '姓',
          locale: 'ja',
        },
      ],
    },
  },
};

export const getManageCredential = async (req: express.Request, res: express.Response) => {
  const issuerId = req.params.issuer_id;

  // Issuer & Credential取得
  const issuer = await prisma.issuer.findUnique({
    where: { id: issuerId },
    include: { credentialList: true },
  });
  Log.log('Issuer selected: %o', issuer);

  if (!issuer) {
    return res.status(404).send();
  }

  const openidConfiguration = await createOpenidConfigration(req, issuer, issuer.credentialList);

  return res.render(
    'manage/credential',
    createEjsOpt({
      issuer,
      openidConfigurationJson: JSON.stringify(openidConfiguration, null, 2),
      credentialMetadataSampleJson: JSON.stringify(CREDENTIAL_METADATA_SAMPLE, null, 2),
    })
  );
};

export const postManageCredential = async (req: express.Request, res: express.Response) => {
  if (req.body.type_save !== undefined) {
    const metadata: CredentialMetadata = JSON.parse(req.body.metadata);

    if (req.body.id) {
      // 更新
      const credential = await prisma.credential.update({
        where: { id: req.body.id },
        data: {
          type: req.body.type,
          name: req.body.name,
          metadataJson: JSON.stringify(metadata),
        },
      });
      Log.log('Credential updated: %o', credential);
    } else {
      // 新規

      // Credential登録
      const credential = await prisma.credential.create({
        data: {
          type: req.body.type,
          issuerId: req.body.issuer_id,
          name: req.body.name,
          metadataJson: JSON.stringify(metadata),
        },
      });
      Log.log('Credential created: %o', credential);
    }
  }

  res.redirect('.');
};

export const getManageVc = async (req: express.Request, res: express.Response) => {
  const credentialId = req.params.credential_id;

  // Credential & Vc & Status取得
  const credential = await prisma.credential.findUnique({
    where: { id: credentialId },
    include: {
      verifiableCredentialList: {
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: {
          verifiableCredentialStatusList: { orderBy: { id: 'desc' }, take: 1 },
        },
      },
    },
  });
  Log.log('Credential selected: %o', credential);

  if (!credential) {
    return res.status(404).send();
  }

  return res.render(
    'manage/vc',
    createEjsOpt({
      credential,
    })
  );
};

export const postManageVc = async (req: express.Request, res: express.Response) => {
  if (req.body.type_status !== undefined) {
    const verifiableCredentialId = req.body.vc_id;
    const { status, reason } = req.body;

    const vcStatus = await prisma.verifiableCredentialStatus.create({
      data: { verifiableCredentialId, status, reason },
    });
    Log.log('VerifiableCredentialStatus created: %o', vcStatus);
  }

  res.redirect('.');
};

export const getManageVerifier = async (_req: express.Request, res: express.Response) => {
  // Verifier全件取得
  const verifierList = await prisma.verifier.findMany();
  Log.log('Verifier selected: %d', verifierList.length);

  res.render(
    'manage/verifier',
    createEjsOpt({
      verifierList,
    })
  );
};

export const postManageVerifier = async (req: express.Request, res: express.Response) => {
  if (req.body.type_save !== undefined) {
    if (req.body.id) {
      // 更新
      const verifier = await prisma.verifier.update({
        where: { id: req.body.id },
        data: {
          name: req.body.name,
        },
      });
      Log.log('Verifier updated: %o', verifier);
    } else {
      // 新規

      // DID作成
      const didObj = await didMgr.createDidLinkedDomains({
        signingKeyId: 'signingKey',
        domain: httpOrS(req.headers.host),
      });
      Log.log('DID created: %o', didObj);

      // Verifier登録
      const verifier = await prisma.verifier.create({
        data: {
          name: req.body.name,
          didObjectJson: JSON.stringify(didObj),
        },
      });
      Log.log('Verifier created: %o', verifier);
    }
  }

  res.redirect('.');
};

export const getResolveVerifier = async (req: express.Request, res: express.Response) => {
  const verifierId = req.params.verifier_id;
  const verifier = await prisma.verifier.findUnique({
    where: { id: verifierId },
  });

  if (!verifier) {
    return res.status(404).send();
  }

  const didObj = DidObject.createByJsonString(verifier.didObjectJson);
  try {
    const didDocument = await didMgr.resolveDid(didObj.did);

    if (!didObj.published) {
      // DIDがまだ published = false の場合
      if (didDocument.didDocumentMetadata.method.published) {
        // DID Documentのpublishedをチェックして、必要なら更新
        didObj.published = true;
        await prisma.verifier.update({
          where: { id: verifierId },
          data: { didObjectJson: JSON.stringify(didObj) },
        });
      }
    }

    return res.json(didDocument);
  } catch {
    //
  }
  return res.json({ error: 'Not found.' });
};

const PRESENTATION_DEFINITION_SAMPLE: PresentationDefinition = {
  id: 'vp token example',
  input_descriptors: [
    {
      id: '',
      format: {
        jwt_vc: {
          alg: ['ES256K'],
        },
      },
      constraints: {
        fields: {
          path: ['$.type'],
          filter: { type: 'string', pattern: '^(UniversityDegreeCredential)$' },
        },
      },
    },
  ],
};

export const getManagePresentationDefinition = async (
  req: express.Request,
  res: express.Response
) => {
  const verifierId = req.params.verifier_id;

  // Verifier & PresentationDefinition取得
  const verifier = await prisma.verifier.findUnique({
    where: { id: verifierId },
    include: { presentationDefinitionList: true },
  });
  Log.log('Verifier selected: %o', verifier);

  if (!verifier) {
    return res.status(404).send();
  }

  return res.render(
    'manage/presentation',
    createEjsOpt({
      verifier,
      presentationDefinitionSampleJson: JSON.stringify(PRESENTATION_DEFINITION_SAMPLE, null, 2),
    })
  );
};

export const postManagePresentationDefinition = async (
  req: express.Request,
  res: express.Response
) => {
  if (req.body.type_save !== undefined) {
    const definition: PresentationDefinition = JSON.parse(req.body.definition);

    if (req.body.id) {
      // 更新
      const presentation = await prisma.presentationDefinition.update({
        where: { id: req.body.id },
        data: {
          name: req.body.name,
          definitionJson: JSON.stringify(definition),
        },
      });
      Log.log('PresentationDefinition updated: %o', presentation);
    } else {
      // 新規

      // Credential登録
      const presentation = await prisma.presentationDefinition.create({
        data: {
          verifierId: req.body.verifier_id,
          name: req.body.name,
          definitionJson: JSON.stringify(definition),
        },
      });
      Log.log('PresentationDefinition created: %o', presentation);
    }
  }

  res.redirect('.');
};

export const getLinkedDomain = async (req: express.Request, res: express.Response) => {
  const { type, id } = req.params;

  let didObj: DidObject | undefined;

  if (type === 'issuer') {
    // 発行済みか確認
    const linkedDomain = await prisma.issuerLinkedDomain.findUnique({ where: { id } });
    if (linkedDomain) {
      return res.json({ linkedDid: linkedDomain.linkedDid });
    }

    const issuer = await prisma.issuer.findUnique({ where: { id } });
    if (issuer) {
      didObj = DidObject.createByJsonString(issuer.didObjectJson);
    }

    if (!didObj) {
      return res.status(404).send();
    }

    try {
      // LinkedDid(Domain Linkage Credential)を生成して保存
      const linkedDid = LinkedDomain.generateLinkedDid(httpOrS(req.headers.host), didObj).jws;
      await prisma.issuerLinkedDomain.create({ data: { id, linkedDid } });

      return res.json({ linkedDid });
    } catch {
      //
    }
  } else {
    // 発行済みか確認
    const linkedDomain = await prisma.verifierLinkedDomain.findUnique({ where: { id } });
    if (linkedDomain) {
      return res.json({ linkedDid: linkedDomain.linkedDid });
    }

    const verifier = await prisma.verifier.findUnique({ where: { id } });
    if (verifier) {
      didObj = DidObject.createByJsonString(verifier.didObjectJson);
    }

    if (!didObj) {
      return res.status(404).send();
    }

    try {
      // LinkedDid(Domain Linkage Credential)を生成して保存
      const linkedDid = LinkedDomain.generateLinkedDid(httpOrS(req.headers.host), didObj).jws;
      await prisma.verifierLinkedDomain.create({ data: { id, linkedDid } });

      return res.json({ linkedDid });
    } catch {
      //
    }
  }

  return res.json({ error: 'Error.' });
};
