
import { Did } from '@/data/did'


export default async function handler(req, res) {    
    console.log(req.body);
    let r = await fetch(
        Did.static + '/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: req.body,
        })
    r = await r.json()
    console.log(r)
    if (r.access_token) {

        const t = r.access_token.split('.')
        let j = decodeURIComponent(atob(t[1]))
        try { j = JSON.parse(j) } catch (e) {}
        const did = j.sub
        console.log(did)
        r.did = did

        let rr = await fetch(
            Did.static + '/carbon/supplychain/get', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({did: r.did}),
            });
            console.log(rr)
        rr = await rr.json()

        if (rr.status==0) {
            r.staff = rr.data
            console.log(rr)    
        }

        let rrr = await fetch(
            Did.static + '/carbon/supplychain/get', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({did: r.staff.company[0]}),
            });
        rrr = await rrr.json()

        if (rrr.status==0) {
            r.org = rrr.data
        }

    }
    res.status(200).json(r);
}