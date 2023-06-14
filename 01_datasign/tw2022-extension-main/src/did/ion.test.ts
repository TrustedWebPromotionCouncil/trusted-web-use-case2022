/**
 * @jest-environment ./jest-custom-environment
 */

import ion from "./ion";

jest.mock("@decentralized-identity/ion-tools", () => {
  // https://jestjs.io/ja/docs/mock-functions#mocking-partials
  const originalModule = jest.requireActual(
    "@decentralized-identity/ion-tools"
  );
  const originalConstructor =
    originalModule.AnchorRequest.prototype.constructor;
  class AnchorRequest {
    submit() {}
  }
  AnchorRequest.prototype.constructor = originalConstructor;
  const paritallyMocked = {
    ...originalModule,
    AnchorRequest,
  };
  return {
    __esModule: true,
    default: paritallyMocked,
  };
});

const privateKeyHex =
  "7c43fb7cea9a6b2a0b6f97c6c6313c9e067e2933eb45a5101760544874b15790";
describe("generate did", () => {
  test("use given key", async () => {
    const result = await ion.issueDID(privateKeyHex, "http://localhost:8080");
    const { shortForm, longForm } = result;
    expect(shortForm).toBeTruthy();
    expect(longForm).toBeTruthy();
  });
});
