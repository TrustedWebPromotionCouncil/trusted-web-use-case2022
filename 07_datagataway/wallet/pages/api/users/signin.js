import { Woollet } from '@data/did';

export default async function handler(req, res) {
  const o = new URLSearchParams(req.body).toString();
  let r = await fetch(Woollet.ui + '/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: o,
  });
  r = await r.json();
  try {
    r = JSON.parse(r);
  } catch (e) {
//    console.log(e);
  }
  if ('data' in r) {
    try {
      r.data = JSON.parse(r.data);
    } catch (e) {
//      console.log(e);
    }
  }
  res.status(200).json(r);
}
