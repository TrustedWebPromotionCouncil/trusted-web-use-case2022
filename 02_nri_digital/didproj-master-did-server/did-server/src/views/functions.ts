import { Credential, Issuer } from '@prisma/client';
import { CredentialMetadata, DidConfigurationResource, OpenidVcIssuance } from 'did-sdk';
import express from 'express';

import { httpOrS, prisma } from '../common';

export const createOpenidConfigration = async (
  req: express.Request,
  issuer: Issuer,
  credentialList: Credential[]
) => {
  const credentialsSupported: Record<string, CredentialMetadata> = {};
  for (const credential of credentialList) {
    credentialsSupported[credential.type] = JSON.parse(credential.metadataJson);
  }
  return OpenidVcIssuance.createServerMetadataForIssuer({
    issuer: `${httpOrS(req.headers.host)}/issuer/${issuer.id}/`,
    authorization_endpoint: `${httpOrS(req.headers.host)}/issuer/${issuer.id}/authorization/`,
    token_endpoint: `${httpOrS(req.headers.host)}/issuer/${issuer.id}/token/`,
    credential_endpoint: `${httpOrS(req.headers.host)}/issuer/${issuer.id}/credential/`,
    credentials_supported: credentialsSupported,
    credential_issuer: { display: [{ name: issuer.name }] },
  });
};

export const createWellKnownDidConfiguration = async () => {
  const didConfigurationResource: DidConfigurationResource = {
    '@context': 'https://identity.foundation/.well-known/contexts/did-configuration-v0.0.jsonld',
    linked_dids: [],
  };

  // Issuer分
  const issuerLinkedDomainList = await prisma.issuerLinkedDomain.findMany();
  for (const linkedDomain of issuerLinkedDomainList) {
    didConfigurationResource.linked_dids.push(linkedDomain.linkedDid);
  }

  // Verifier分
  const verifierLinkedDomainList = await prisma.verifierLinkedDomain.findMany();
  for (const linkedDomain of verifierLinkedDomainList) {
    didConfigurationResource.linked_dids.push(linkedDomain.linkedDid);
  }

  return didConfigurationResource;
};

export default createOpenidConfigration;
