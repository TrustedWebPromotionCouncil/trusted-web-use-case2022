import { Woollet } from '@data/did';

export default async function handler(req, res) {

  let r = await fetch(Woollet.ui + '/users/profile', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.authorization,
    }
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
