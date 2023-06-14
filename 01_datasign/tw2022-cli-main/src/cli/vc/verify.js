import fs from 'node:fs/promises';
import { Command } from 'commander';
import { verifyCredential, verifyPresentation } from 'did-jwt-vc';
import { Resolver } from 'did-resolver';
import { resolve } from '../../../node_modules/@decentralized-identity/ion-tools/dist/esm/src/index.js';

const resolverMap = {
  ion: async (did) => {
    return resolveIon(did);
  },
};

const resolveIon = async (did) => {
  return await resolve(did);
};

const ionResolver = new Resolver(resolverMap);

export const cmd = new Command('verify');
cmd.description('Verify Downloaded VC');
cmd.requiredOption('--vcPath <vcPath>', 'Path to Downloaded VC Files', './out');
cmd.action(async () => {
  const { vcPath } = cmd.opts();
  const data = await fs.readFile(vcPath, { encoding: 'utf8' });
  if (data) {
    const verifiedVp = await verifyPresentation(data, ionResolver);
    try {
      const vcList = verifiedVp.payload.vp.verifiableCredential;
      return await Promise.all(
        vcList.map(async (vcJwt) => {
          const verifiedVC = await verifyCredential(vcJwt, ionResolver);
          const verifiableCredential = verifiedVC.verifiableCredential;
          console.log({ credentialSubject: verifiableCredential.credentialSubject });
          return verifiableCredential.credentialSubject;
        }),
      );
    } catch (error) {
      console.error(error);
    }
  }
});
