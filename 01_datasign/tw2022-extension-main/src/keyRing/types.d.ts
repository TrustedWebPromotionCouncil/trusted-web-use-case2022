// declare module "eth-keyring-controller" {
//   export default class ObservableStore {
//     subscribe: (value: { vault: {} }) => void;
//   }
// }

interface KeyringProtocol {
  serialize: () => Promise<{ mnemonic: Uint8Array }>;
  addAccounts: (n: number) => Promise<string[]>;
  getAccounts: () => Promise<string[]>;
  exportAccount: (address: string) => Promise<string>;
}
interface Subscriber {
  subscribe: (value: any) => void;
}
declare module "eth-keyring-controller" {
  export default class KeyringController {
    constructor(opts: {});
    createNewVaultAndKeychain: (vaultPassword: string) => Promise<Object>;
    createNewVaultAndRestore: (
      vaultPassword: string,
      seedPhrase: string | number[]
    ) => Promise<Object>;
    setLocked: () => Promise<Object>;
    unlockKeyrings: (
      password,
      encryptionKey,
      encryptionSalt
    ) => Promise<Array<Object>>;
    submitPassword: (password: string) => Promise<Object>;
    addNewAccount: (keyring: KeyringProtocol) => Promise<Object>;
    getAccounts: () => Promise<string[]>;
    exportAccount: (address: string) => Promise<string>;
    getKeyringForAccount: (address: string) => Promise<KeyringProtocol>;
    on: (eventName: string, listener: (...args: any[]) => void) => void;
    off: (eventName: string, listener: (...args: any[]) => void) => void;
    store: Subscriber;
  }
}
declare module "@metamask/eth-hd-keyring";
