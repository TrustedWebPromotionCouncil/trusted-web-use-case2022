
import { Did } from '@/data/did'


export default async function handler(req, res) {

    let pid = 0;
    try {
        pid = req.body.page
    } catch (e) { }

    const r = {
        page: {
            "id": pid,
            "type": "verify",
            "uid": "sample",
            "name": pid == "1" ? "test-verifier" : "Membership Issuer",
            "desc": "A testing verifier with Woollet member credential",
            "def": "UQERkGnrUuJBMfaAW6hNPs:3:CL:720:Membership-3.5.1",
            "fc": 3
        },
        fn: ["name", "idx", "idy", "role"],
        fields: [
            { "key": "name", "opr": "", "val": "" },
            { "key": "idx", "opr": "", "val": "" },
            { "key": "idy", "opr": "", "val": "" },
            { "key": "role", "opr": ">", "val": "3" },
        ]
    }

    /*

    let r = await fetch(
        Did.static + '/builder/page/'+pid, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
    r = await r.json()
    */
    res.status(200).json(r);
}