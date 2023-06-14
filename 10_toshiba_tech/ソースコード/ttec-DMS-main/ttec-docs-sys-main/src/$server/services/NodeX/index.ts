import got from 'got'
import path from "path"
import os from "os"

type AnyMap = { [ key: string ]: any }

class DID {
    // NOTE: VC 生成
    static async generateVC(params: {
        message: string,
    }): Promise<string> {
        const base = `unix:${ path.join(os.homedir(), '.unid/run/unid.sock') }`
        const text = await got.post([ base, '/internal/verifiable-credentials' ].join(':'), {
            enableUnixSockets: true,
            json: {
                message: JSON.parse(params.message),
            },
        }).text()

        return text
    }

    // NOTE: VC 検証
    static async verifyVC(params: {
        message: string,
    }): Promise<string> {
        const base = `unix:${ path.join(os.homedir(), '.unid/run/unid.sock') }`
        const text = await got.post([ base, '/internal/verifiable-credentials/verify' ].join(':'), {
            enableUnixSockets: true,
            json: {
                message: JSON.parse(params.message),
            }
        }).text()

        return text
    }
}

class DIDComm {
    // NOTE: DIDComm Plain 生成
    static async generatePlaintextMessage(params: {
        destinations: Array<string>,
        message: string,
    }): Promise<string> {
        const base = `unix:${ path.join(os.homedir(), '.unid/run/unid.sock') }`
        const text = await got.post([ base, '/internal/didcomm/plaintext-messages' ].join(':'), {
            enableUnixSockets: true,
            json: {
                destinations: params.destinations,
                message: JSON.parse(params.message),
            },
        }).text()

        return text
    }

    // NOTE: DIDComm Plain 検証
    static async verifyPlaintextMessage(params: {
        message: string,
    }): Promise<string> {
        const base = `unix:${ path.join(os.homedir(), '.unid/run/unid.sock') }`
        const text = await got.post([ base, '/internal/didcomm/plaintext-messages/verify' ].join(':'), {
            enableUnixSockets: true,
            json: {
                message: JSON.parse(params.message),
            },
        }).text()

        return text
    }

    // NOTE: DIDComm Sign 生成
    static async generateSignedMessage(params: {
        destinations: Array<string>,
        message: string,
    }): Promise<string> {
        const base = `unix:${ path.join(os.homedir(), '.unid/run/unid.sock') }`
        const text = await got.post([ base, '/internal/didcomm/signed-messages' ].join(':'), {
            enableUnixSockets: true,
            json: {
                destinations: params.destinations,
                message: JSON.parse(params.message),
            },
        }).text()

        return text
    }

    // NOTE: DIDComm Sign 検証
    static async verifySignedMessage(params: {
        message: string,
    }): Promise<string> {
        const base = `unix:${ path.join(os.homedir(), '.unid/run/unid.sock') }`
        const text = await got.post([ base, '/internal/didcomm/signed-messages/verify' ].join(':'), {
            enableUnixSockets: true,
            json: {
                message: JSON.parse(params.message),
            },
        }).text()

        return text

    }

    // NOTE: DIDComm Enc 生成
    static async generateEncryptedMessage(params: {
        destinations: Array<string>,
        message: string,
    }): Promise<string> {
        const base = `unix:${ path.join(os.homedir(), '.unid/run/unid.sock') }`
        const text = await got.post([ base, '/internal/didcomm/encrypted-messages' ].join(':'), {
            enableUnixSockets: true,
            json: {
                destinations: params.destinations,
                message: JSON.parse(params.message),
            },
        }).text()

        return text
    }

    // NOTE: DIDComm Enc 検証
    static async verifyEncryptedMessage(params: {
        message: string,
    }): Promise<string> {
        const base = `unix:${ path.join(os.homedir(), '.unid/run/unid.sock') }`
        const text = await got.post([ base, '/internal/didcomm/encrypted-messages/verify' ].join(':'), {
            enableUnixSockets: true,
            json: {
                message: JSON.parse(params.message),
            },
        }).text()

        return text
    }
}

export class NodeXService {
    static get DIDComm() {
        return DIDComm
    }

    static get DID() {
        return DID
    }
}