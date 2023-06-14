
import { Did } from '@/data/did'


export default async function handler(req, res) {    
    let r = await fetch(
        Did.static + '/ipfs/unencrypted/private/download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body),
        })
    r = await r.json()
    res.status(200).json(r);
}