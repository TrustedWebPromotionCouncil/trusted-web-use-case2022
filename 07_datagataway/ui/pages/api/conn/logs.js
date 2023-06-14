
import { Did } from '@/data/did'


export default async function handler(req, res) {    
    console.log(Did.static)
    let r = await fetch(
        Did.static + '/conn/logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body),
        })
    r = await r.json()
    try { r = JSON.parse(r) } catch (e) { }
    try { r.data = JSON.parse(r.data.logs) } catch (e) { }
    res.status(200).json(r);
}