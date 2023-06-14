import fs from 'node:fs/promises';
import { Command } from 'commander';
import { DID, anchor, resolve } from '../../../node_modules/@decentralized-identity/ion-tools/dist/esm/src/index.js';

export const cmd = new Command('update');
cmd.description('Update generated DID');
cmd.requiredOption('--didFilePath <didFilePath>', 'Path to update did file ex.ion-did-ops-v1.json');
cmd.option('--outputDir <outputDir>', 'dir path for output\ndefault path is ./out', './out');
cmd.option('--publicKeyPath <publicKeyPath>', 'path to update publicKey Json file ex ./files/update_publicKeys.json');
cmd.option('--servicePath <servicePath>', 'path to update service Json');

cmd.action(async () => {
  const { didFilePath, publicKeyPath, servicePath, outputDir } = cmd.opts();
  console.log('cmd.opts', cmd.opts());
  const ionOps = await fs.readFile(didFilePath, { encoding: 'utf8' });
  const did = await new DID(JSON.parse(ionOps));

  const longForm = await did.getURI();
  const resolveDid = await resolve(longForm);
  const removeKeyId = resolveDid.didDocument.verificationMethod[0].id;
  const removeServiceId = resolveDid.didDocument.service[0].id;

  let updateData = {};
  if (publicKeyPath) {
    const pubKey = await fs.readFile(publicKeyPath);
    updateData = { ...updateData, removePublicKeys: [removeKeyId.slice(1)] };
    updateData = { ...updateData, addPublicKeys: JSON.parse(pubKey) };
  } else {
    updateData = { ...updateData, addPublicKeys: resolveDid.didDocument.verificationMethod };
  }
  if (servicePath) {
    const service = await fs.readFile(servicePath);
    updateData = { ...updateData, removeServices: [removeServiceId.slice(1)] };
    updateData = { ...updateData, addServices: JSON.parse(service) };
  } else {
    updateData = { ...updateData, addServices: resolveDid.didDocument.service };
  }

  // Generate and publish update request to an ION node
  const updateOperation = await did.generateOperation('update', updateData);
  const updateRequest = await did.generateRequest(updateOperation);
  await anchor(updateRequest);

  // Store the revised key material and source data for the DID
  const date = new Date();
  const updateIonOps = await did.getAllOperations();
  await fs.copyFile(
    didFilePath,
    `${outputDir}/${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}-ion-did-ops.json`,
  );
  await fs.writeFile(`${outputDir}/current-ion-did-ops.json`, JSON.stringify({ ops: updateIonOps }), {
    encoding: 'utf8',
  });
});
