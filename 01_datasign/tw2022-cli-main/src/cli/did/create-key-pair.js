import fs from 'node:fs/promises';
import { Command } from 'commander';
import { generateKeyPair } from '../../../node_modules/@decentralized-identity/ion-tools/dist/esm/src/index.js';
import { fileExist } from './utils.js';

export const cmd = new Command('createKeyPair');
cmd.description('createKeyPair by ion-tools');
cmd.requiredOption('-t, --type <type>', 'type', 'secp256k1');
cmd.requiredOption('--keyId <keyId>', 'type');
cmd.option('--outputDir <outputDir>', 'dir path for output\ndefault path is ./out', './out');

cmd.action(async () => {
  const { type, keyId, outputDir } = cmd.opts();

  try {
    const fileList = await fs.readdir(outputDir);
    if (fileList.length > 0) {
      const list = fileList.flatMap((file) => {
        return ['privateJwk', 'publicJwk'].filter((jwk) => file === `${keyId}.${jwk}.json`);
      });
      if (list.length > 0) {
        for (const l of list) {
          console.error(`${keyId}.${l}.json already exists`);
        }
        console.error('input key already exists!\nCreate with another keyId!');
        process.exit(1);
      }
    }
  } catch (e) {
    console.log('New file');
  }

  const authnKeys = await generateKeyPair(type);

  const outDir = await fileExist(`./${outputDir}`);
  if (!outDir) {
    await fs.mkdir(`./${outputDir}`);
  }
  // Write private and public key to files
  await fs.writeFile(`./${outputDir}/${keyId}.privateJwk.json`, JSON.stringify(authnKeys.privateJwk));
  await fs.writeFile(`./${outputDir}/${keyId}.publicJwk.json`, JSON.stringify(authnKeys.publicJwk));
  const template = {
    id: keyId,
    type: 'JsonWebKey2020',
    purposes: ['authentication'],
  };
  const pubKey = { ...template, publicKeyJwk: authnKeys.publicJwk };
  await fs.writeFile(`./${outputDir}/${keyId}.publicKey.json`, JSON.stringify([pubKey]));
});
