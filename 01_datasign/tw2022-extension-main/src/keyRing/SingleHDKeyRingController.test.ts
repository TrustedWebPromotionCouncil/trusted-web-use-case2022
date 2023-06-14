import { SingleHDKeyRingController } from "./SingleHDKeyRingController";

// import crypto from "crypto";
// const crypto = require("crypto").subtle;
// https://nodejs.org/api/crypto.html#cryptogetrandomvaluestypedarray
// > This implementation is not compliant with the Web Crypto spec,
// > to write web-compatible code use crypto.webcrypto.getRandomValues() instead.
// https://nodejs.org/api/webcrypto.html#web-crypto-api
const crypto = require("node:crypto").webcrypto;
// import { webcrypto } from "node:crypto";

// if (!globalThis.crypto) {
//   globalThis.crypto = crypto;
// }
// Object.defineProperty(global.self, "crypto", {
//   value: {
//     getRandomValues: (arr: any) => crypto.randomBytes(arr.length),
//   },
// });

const MOCK_HEX = "0xabcdef0123456789";
let cacheVal: string;
const opts = {
  encryptor: {
    // An optional object for defining encryption schemes:
    // Defaults to Browser-native SubtleCrypto.
    encrypt(password: string, object: {}) {
      return Promise.resolve(MOCK_HEX);
    },
    decrypt(password: string, encryptedString: string) {
      return Promise.resolve(cacheVal || {});
    },
    generateSalt() {
      return "WHADDASALT!";
    },
  },
};
beforeAll(() => {
  console.debug("------------ before all ------------");
  if (!globalThis.crypto) {
    console.debug({ crypto });
    globalThis.crypto = crypto;
  }
});

const testPassword = "test-password";

describe("Single Account", () => {
  let initState = { vault: "" };

  beforeAll(async () => {
    const fn = jest.fn(async (address) => {
      expect(address).toBeTruthy();
      const privateKey = await keyRingController.getPrivateKey(address);
      expect(privateKey).toBeTruthy();
    });
    const keyRingController = new SingleHDKeyRingController();
    keyRingController.onNewVault(fn);

    await keyRingController.createNewVault(testPassword);
    expect(fn.mock.calls.length).toBe(1);

    const addresses = await keyRingController.getAccounts();
    expect(addresses.length).toBe(1);

    initState.vault = keyRingController.encryptedVault;
    expect(initState.vault).toBeTruthy();
  });

  test("succeeded to unlock vault", async () => {
    const keyRingController = new SingleHDKeyRingController({ initState });
    await keyRingController.unlock(testPassword);
    expect(keyRingController.isUnlocked).toBeTruthy();

    await keyRingController.lock();
    expect(keyRingController.isUnlocked).toBeFalsy();
  });

  test("failed to unlock vault", async () => {
    const keyRingController = new SingleHDKeyRingController({ initState });
    await keyRingController.unlock("wrong-password");
    expect(keyRingController.isUnlocked).toBeFalsy();
  });

  test("add account", async () => {
    const keyRingController = new SingleHDKeyRingController({ initState });
    await keyRingController.unlock(testPassword);
    const address = await keyRingController.addAccount();
    const privateKey = await keyRingController.getPrivateKey(address);
    expect(privateKey).toBeTruthy();
  });

  test("get seed phrase", async () => {
    const keyRingController = new SingleHDKeyRingController({ initState });
    await keyRingController.unlock(testPassword);
    const seedPhrase = await keyRingController.getSeedPhrase();
    expect(seedPhrase).toBeTruthy();
  });
});

describe("Multiple Account", () => {
  let initState = { vault: "" };
  beforeAll(async () => {
    const keyRingController = new SingleHDKeyRingController();

    await keyRingController.createNewVault(testPassword);
    await keyRingController.addAccount();

    initState.vault = keyRingController.encryptedVault;
    expect(initState.vault).toBeTruthy();
  });
  test("get accounts", async () => {
    const keyRingController = new SingleHDKeyRingController({ initState });
    await keyRingController.unlock(testPassword);
    const addresses = await keyRingController.getAccounts();
    expect(addresses.length).toBe(2);
  });
});

describe("Restore", () => {
  let seedPhrase = "";
  let originalAddress1 = "";
  let originalAddress2 = "";
  beforeAll(async () => {
    const keyRingController = new SingleHDKeyRingController();
    await keyRingController.createNewVault(testPassword);
    await keyRingController.addAccount(); // second account

    seedPhrase = await keyRingController.getSeedPhrase();

    const addresses = await keyRingController.getAccounts();
    expect(addresses.length).toBe(2);
    originalAddress1 = addresses[0];
    originalAddress2 = addresses[1];
  });

  test("restore", async () => {
    const keyRingController = new SingleHDKeyRingController();
    await keyRingController.restore("new-password", seedPhrase);

    let addresses = await keyRingController.getAccounts();
    expect(addresses.length).toBe(1);
    expect(addresses[0]).toBe(originalAddress1);

    // restore second account
    await keyRingController.addAccount();
    addresses = await keyRingController.getAccounts();
    expect(addresses.length).toBe(2);
    expect(addresses[1]).toBe(originalAddress2);
  });
});
