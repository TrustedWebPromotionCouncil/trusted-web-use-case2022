import KeyringController from "eth-keyring-controller";
import HDKeyring from "@metamask/eth-hd-keyring";

interface InitState {
  vault: string;
}
export class SingleHDKeyRingController {
  private keyringController: KeyringController;
  private _vault: string = "";
  private _isUnlocked = false;

  constructor(opts: { initState?: {}; encryptor?: {} } = {}) {
    const { initState, encryptor } = opts;
    this.keyringController = new KeyringController({
      keyringTypes: [HDKeyring], // optional array of types to support.
      initState: initState,
      encryptor: encryptor,
    });
    this.keyringController.on("update", (args: { isUnlocked: boolean }) => {
      this._isUnlocked = args.isUnlocked;
    });
    this.keyringController.store.subscribe((value: InitState) => {
      const { vault } = value;
      this._vault = vault;
    });
  }

  createNewVault = async (vaultPassword: string) => {
    await this.keyringController.createNewVaultAndKeychain(vaultPassword);
  };

  restore = async (vaultPassword: string, seedPhrase: string) => {
    await this.keyringController.createNewVaultAndRestore(
      vaultPassword,
      seedPhrase
    );
  };

  lock = async () => {
    await this.keyringController.setLocked();
  };

  unlock = async (password: string) => {
    try {
      await this.keyringController.submitPassword(password);
    } catch (err) {
      console.error(err);
    }
    // await this.keyringController.unlockKeyrings(password, "", "");
  };
  addAccount = async () => {
    let newAddress = "";
    const callback = (address: string) => {
      newAddress = address;
    };
    this.keyringController.on("newAccount", callback);
    const keyring = await this.getKeyRing();
    await this.keyringController.addNewAccount(keyring);
    // https://github.com/Zlobin/es-event-emitter/blob/master/src/event-emitter.js#L206
    this.keyringController.off("newAccount", callback);
    return newAddress;
  };

  getAccounts = async () => {
    return this.keyringController.getAccounts();
  };

  getPrivateKey = async (address: string) => {
    // Exports the specified account as a private key hex string.
    return this.keyringController.exportAccount(address);
  };

  getSeedPhrase = async () => {
    const keyring = await this.getKeyRing();
    const { mnemonic } = await keyring.serialize();
    const sp = new TextDecoder("utf-8").decode(Uint8Array.from(mnemonic));
    return sp;
  };

  onNewVault = (onNewVault: (address: string) => void) => {
    this.keyringController.on("newVault", onNewVault);
  };

  onNewAccount = (onNewAccount: (address: string) => void) => {
    this.keyringController.on("newAccount", onNewAccount);
  };

  onRemoveAccount = (onRemovedAccount: (address: string) => void) => {
    this.keyringController.on("removedAccount", onRemovedAccount);
  };

  get encryptedVault() {
    return this._vault;
  }

  get isUnlocked() {
    return this._isUnlocked;
  }

  private getKeyRing = async () => {
    const addresses = await this.keyringController.getAccounts();
    const keyring = await this.keyringController.getKeyringForAccount(
      addresses[0]
    );
    return keyring;
  };
}
