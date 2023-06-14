import { WoolletAPI } from '../../../data/did';

export default async function handler(req, res) {
  let r = await fetch(WoolletAPI.server + '/users/new', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body),
  });
  r = await r.json();
  try {
    r = JSON.parse(r);
  } catch (e) {
    console.log(e);
  }
  if ('data' in r) {
    try {
      r.data = JSON.parse(r.data);
    } catch (e) {
      console.log(e);
    }
  }
  res.status(200).json(r);
}
