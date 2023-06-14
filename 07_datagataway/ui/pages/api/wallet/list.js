
import { Did } from '@/data/did'


export default async function handler(req, res) {    
    let r = await fetch(
        Did.static + '/issuance/list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body),
        })
    r = await r.json()
    try { r = JSON.parse(r) } catch (e) { }
    r.data = r.data.results
    res.status(200).json(r);
}