
import { Did } from '@/data/did'


export default async function handler(req, res) {
    let r = await fetch(
        Did.static + '/verify/free', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body),
        })
    r = await r.json()
    try { r = JSON.parse(r) } catch (e) { }
//    r.data = r.data
    res.status(200).json(r);
}


/*
class JsonVerify(BaseModel):
    name: str
    con_id: str
    def_id: str
    attrs: list
    preds: list
    comment: str | None = None
*/