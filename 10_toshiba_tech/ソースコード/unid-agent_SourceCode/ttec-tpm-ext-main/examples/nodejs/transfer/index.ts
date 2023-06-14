import * as os from 'os'
import * as path from 'path'
import got from 'got'

const generate_random_data = (size: number) => {
    var chars = 'abcdefghijklmnopqrstuvwxyz'.split('')
    var len = chars.length
    var random_data = []

    while (size--) {
        random_data.push(chars[Math.random()*len | 0])
    }

    return random_data.join('')
}

(async () => {
    const payload = generate_random_data(1024 /** 1k */ * 15000)

    const base = `unix:${ path.join(os.homedir(), '.unid/run/unid.sock') }`
    const json = await got.post([ base, '/transfer' ].join(':'), {
        enableUnixSockets: true,
        json: {
            destinations: [ 'did:unid:test:EiBprXreMiba4loyl3psXm0RsECdtlCiQIjM8G9BtdQplA' ],
            messages: [ {
                payload: payload,
            } ],
            metadata: {
                string: 'value',
                number: 1,
                boolean: true,
                array: [],
                map: {}
            },
        },
    }).json()

    console.log(JSON.stringify(json, null, 4))
})()
