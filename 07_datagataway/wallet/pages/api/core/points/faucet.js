import { Woollet } from '@data/did';

export default async function handler(req, res) {

  const o = new URLSearchParams(req.body).toString();
  let r = await fetch(Woollet.ai + '/cryptos/faucet?'+o, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.authorization,
    },
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
