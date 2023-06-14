import { Validator } from 'jsonschema';
import fs from 'node:fs/promises';

const publicKeyJwkSchema = {
  id: '/PublicKeyJwk',
  type: 'object',
  properties: {
    kty: { type: 'string' },
    crv: { type: 'string' },
    x: { type: 'string' },
    y: { type: 'string' },
  },
  required: ['kty', 'crv', 'x', 'y'],
};

const publicKeySchema = {
  id: '/PublicKey',
  type: 'object',
  properties: {
    id: { type: 'string' },
    type: { type: 'string' },
    publicKeyJwk: { $ref: '/PublicKeyJwk' },
    purposes: {
      type: 'array',
      items: { type: 'string' },
    },
  },
  required: ['id', 'type', 'publicKeyJwk', 'purposes'],
};
const publicKeyListSchema = { type: 'array', items: { $ref: '/PublicKey' } };

const serviceEndpointSchema = {
  id: '/ServiceEndpoint',
  oneOf: [
    { type: 'string' },
    {
      type: 'object',
      properties: {
        nodes: {
          type: 'array',
          items: { type: 'string' },
        },
      },
      required: ['nodes'],
    },
  ],
};

const serviceSchema = {
  id: '/Service',
  type: 'object',
  properties: {
    id: { type: 'string' },
    type: { type: 'string' },
    serviceEndpoint: { $ref: '/ServiceEndpoint' },
  },
  required: ['id', 'type', 'serviceEndpoint'],
};
const serviceListSchema = { type: 'array', items: { $ref: '/Service' } };

const v = new Validator();
export const publicKeyValidator = (publicKey) => {
  v.addSchema(publicKeyJwkSchema, '/PublicKeyJwk');
  v.addSchema(publicKeySchema, '/PublicKey');
  return v.validate(JSON.parse(publicKey), publicKeyListSchema, { throwError: true });
};

export const serviceValidator = (service) => {
  v.addSchema(serviceEndpointSchema, '/ServiceEndpoint');
  v.addSchema(serviceSchema, '/Service');
  return v.validate(JSON.parse(service), serviceListSchema, { throwError: true });
};

export const fileExist = async (file) => {
  try {
    return await fs.stat(file);
  } catch (error) {
    return false;
  }
};
