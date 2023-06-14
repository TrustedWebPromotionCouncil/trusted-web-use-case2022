import axios from "axios"
import { NodeXService } from '../src/$server/services/NodeX'
import { prisma } from '../prisma/client'

interface Record {
    data: string,
    topic: string,
}

(async () => {
    const records = await axios.get<Array<Record>>('http://localhost:3001/records')

    const verified = await Promise.all(records.data.map((r) => {
        return NodeXService.DIDComm.verifyEncryptedMessage({
            message: r.data
        })
    }))

    const rs = await Promise.all(verified.map((r) => {
        const json = JSON.parse(r)

	    const message = json.message
	    const metadata = json.metadata

	    if (! message) { console.log('! message'); return }
	    if (! metadata) { console.log('! metadata'); return }

        // VC パート
	    const did = message.issuer.id
        const issuanceDate = message.issuanceDate

        const container: Array<any> = message.credentialSubject.container

        if (container.length !== 1) { console.log('container.length !== 1'); return }

        const object = container[0]

        if (! object) { console.log('! object'); return }

        const base64_data = object.base64_data
        const filename = object.filename
        const media_type = object.media_type

	    if (! did) { console.log('! did'); return }
        if (! issuanceDate) { console.log('! issuanceDate'); return }
        if (! base64_data) { console.log('! base64_data'); return }
        if (! filename) { console.log('! filename'); return }
        if (! media_type) { console.log('! media_type'); return }

        // メタデータパート
	    const location = metadata.location
	    const mfp_serial = metadata.mfp_serial
	    const user = metadata.user

        return prisma.document.create({
            data: {
                did: did,
                location: location, // 任意
                serialNumber: mfp_serial, // 任意
                username: user, // 任意
                vc: JSON.stringify(message),
                data: base64_data,
                filename: filename,
                mimeType: media_type,
                scanedAt: issuanceDate,
            }
        })
    }))

    rs.forEach((r) => { console.log('imported: ', r?.scanedAt) })
})()
