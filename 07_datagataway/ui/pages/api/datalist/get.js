
import { Did } from '@/data/did'


export default async function handler(req, res) {    
    let r = await fetch(
        Did.static + '/carbon/envelope/datalist/get', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body),
        })
    r = await r.json()
    try { r = JSON.parse(r) } catch (e) { }
    try { r.data = JSON.parse(r.data.results) } catch (e) { }
    delete r.data._id
    res.status(200).json(r);
}