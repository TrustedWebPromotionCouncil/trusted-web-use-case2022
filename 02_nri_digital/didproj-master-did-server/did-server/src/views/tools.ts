import { IonDid, IonPublicKeyPurpose } from '@decentralized-identity/ion-sdk';
import express from 'express';

import { createEjsOpt, didMgr } from '../common';

export const getTools = async (_req: express.Request, res: express.Response) => {
  res.render('tools', createEjsOpt());
};

const postResolve = async (req: express.Request, res: express.Response) => {
  try {
    const didDoc = await didMgr.resolveDid(req.body.did);
    res.json({
      did_doc: JSON.stringify(didDoc, null, 2),
    });
  } catch {
    res.json({
      did_doc: 'DID Not found.',
    });
  }
};

export const postKey2Did = async (req: express.Request, res: express.Response) => {
  const { keys } = req.body;

  if (!keys.update || !keys.recovery) {
    return res.json({ did: '' });
  }

  const input = {
    document: {
      publicKeys: [
        {
          id: 'signingKey',
          type: 'EcdsaSecp256k1VerificationKey2019',
          publicKeyJwk: keys.signing.public,
          purposes: [IonPublicKeyPurpose.Authentication, IonPublicKeyPurpose.AssertionMethod],
        },
      ],
    },
    updateKey: keys.update.public,
    recoveryKey: keys.recovery.public,
  };
  const did = IonDid.createLongFormDid(input);
  return res.json({
    did,
  });
};

export const postTools = async (req: express.Request, res: express.Response) => {
  switch (req.body.type) {
    case 'resolve':
      postResolve(req, res);
      break;
    case 'key2did':
      postKey2Did(req, res);
      break;
    default:
      res.status(404).send();
  }
};
