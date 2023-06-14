import { resolve } from "@decentralized-identity/ion-tools";
import { DIDResolutionResult, Resolver } from "did-resolver";

const resolverMap = {
  ion: async (did: string) => {
    return await resolveIon(did);
  },
};

export const resolveIon = async (did: string): Promise<DIDResolutionResult> => {
  const response = await resolve(did);
  console.debug({ response });
  return response;
};

export const ionResolver = new Resolver(resolverMap);
