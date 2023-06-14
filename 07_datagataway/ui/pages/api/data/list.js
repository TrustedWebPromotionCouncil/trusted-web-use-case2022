import { Did } from '@/data/did'


export default async function handler(req, res) {    
    let r = await fetch(
        Did.static + '/carbon/wallet/list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body),
        })
    r = await r.json()
//    try { r = JSON.parse(r) } catch (e) { console.error(e) }
//    try { r = JSON.parse(r.data) } catch (e) { console.error(e) }
        console.log(r)
    try { r = JSON.parse(r.data.results) } catch (e) { console.error(e) }
//    JSON.parse(r.data.results)
    res.status(200).json(r.data.results);
}