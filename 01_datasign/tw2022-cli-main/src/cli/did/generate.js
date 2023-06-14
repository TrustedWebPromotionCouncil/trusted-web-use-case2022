import fs from 'node:fs/promises';
import { Command } from 'commander';
import { DID, anchor } from '../../../node_modules/@decentralized-identity/ion-tools/dist/esm/src/index.js';
import { fileExist, publicKeyValidator, serviceValidator } from './utils.js';

export const cmd = new Command('generate');

cmd.description('Generate DID from created key pair');
cmd.requiredOption('--publicKeyPath <publicKeyPath>', 'publicKey Json file put to tw2022-cli/files/');
cmd.requiredOption('--servicesPath <servicesPath>', 'services Json file put to tw2022-cli/files/');
cmd.option('--outputDir <outputDir>', 'dir path for output\ndefault path is ./out', './out');

cmd.action(async () => {
  const { publicKeyPath, servicesPath, outputDir } = cmd.opts();

  const publicKey = await fs.readFile(publicKeyPath);
  const service = await fs.readFile(servicesPath);
  const publicKeyResult = publicKeyValidator(publicKey);
  const serviceResult = serviceValidator(service);

  const did = new DID({
    content: {
      publicKeys: publicKeyResult.instance,
      services: serviceResult.instance,
    },
  });

  console.log('did', did);
  const shortFormURI = await did.getURI('short');
  const longFormURI = await did.getURI();

  const createRequest = await did.generateRequest(0);
  try {
    await anchor(createRequest);
    console.log('----------------shortFormURI----------------\n', shortFormURI);
    console.log('----------------longFormURI----------------\n', longFormURI);
  } catch (error) {
    console.log(error);
  }
  const ionOps = await did.getAllOperations();
  if (!(await fileExist(outputDir))) {
    await fs.mkdir(outputDir);
  }
  const didJson = {
    did: {
      longForm: longFormURI,
      shortForm: shortFormURI,
    },
  };
  await fs.writeFile(`${outputDir}/original-ion-did-ops.json`, JSON.stringify({ ops: ionOps }));
  await fs.writeFile(`${outputDir}/did.json`, JSON.stringify(didJson));
});
