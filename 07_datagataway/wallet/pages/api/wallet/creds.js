

import { Woollet, APIS } from '@data/woollet';


export default async function handler(req, res) {

    let r = await fetch(Woollet.ui + '/wallet/list', {
    method: 'POST',
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
//    console.log(e);
  }

  if (typeof(r.data) != 'undefined') {
    try {
      r.data = JSON.parse(r.data);
    } catch (e) {
//      console.log(e);
    }
  }
  res.status(200).json(r);
}
