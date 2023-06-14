import { WoolletAPI } from '../../../data/did';

export default async function handler(req, res) {
  let r = await fetch(WoolletAPI.static + '/server/status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body),
  });
  r = await r.json();
  const o = r; //{ label: r.data.label, version: r.data.version };
  res.status(200).json(o);
}
