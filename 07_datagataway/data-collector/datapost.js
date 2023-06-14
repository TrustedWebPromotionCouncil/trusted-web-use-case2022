
// Test Script for ORPHE project datapost endpoint
// Author: DataGateway
// Version: 1.0
// Date: 2023-02-01

// Execute by "nodejs" environment
// e.g. Mac or Linux command line / console
//
// node datapost.js
// (result will be output to command prompt/console)

/*
 *	Sample data
 */


const DATA = {"id": "1", "time": 1678287572.3161664, "data": [{"id": "4", "data": [{"type": "tempreture", "val": "30.6", "unit": "C"}, {"type": "humidity", "val": "12.1", "unit": "%"}]}, {"id": "2", "data": [{"type": "tempreture", "val": "22.0", "unit": "C"}, {"type": "humidity", "val": "20.2", "unit": "%"}]}, {"id": "3", "data": [{"type": "tempreture", "val": "31.7", "unit": "C"}, {"type": "humidity", "val": "11.6", "unit": "%"}]}, {"id": "1", "data": [{"type": "brightness", "val": "0", "unit": "Lux"}]}, {"id": 5, "data": [{"type": "voltage", "val": "105.43", "unit": "V"}]}, {"id": 6, "data": [{"type": "voltage", "val": "105.45", "unit": "V"}]}, {"id": 7, "data": [{"type": "amperage", "val": "0.0", "unit": "A"}]}, {"id": 8, "data": [{"type": "amperage", "val": "0.0", "unit": "A"}]}, {"id": 9, "data": [{"type": "amperage", "val": "3.36", "unit": "A"}]}, {"id": 10, "data": [{"type": "amperage", "val": "0.9", "unit": "A"}]}, {"id": 11, "data": [{"type": "amperage", "val": "0.74", "unit": "A"}]}, {"id": 12, "data": [{"type": "voltage", "val": "234.0", "unit": "V"}]}, {"id": 13, "data": [{"type": "tempreture", "val": "31", "unit": "C"}]}, {"id": 14, "data": [{"type": "capacity", "val": "40", "unit": "%"}]}, {"id": 15, "data": [{"type": "amperage", "val": "-1.5", "unit": "A"}]}, {"id": 16, "data": [{"type": "powerunit", "val": "-351", "unit": "W"}]}, {"id": 17, "data": [{"type": "tempreture", "val": "41", "unit": "C"}]}, {"id": 18, "data": [{"type": "voltage", "val": "0.0", "unit": "V"}]}, {"id": 19, "data": [{"type": "amperage", "val": "0.0", "unit": "A"}]}, {"id": 20, "data": [{"type": "powerunit", "val": "0", "unit": "W"}]}, {"id": 21, "data": [{"type": "voltage", "val": "100.9", "unit": "V"}]}, {"id": 22, "data": [{"type": "amperage", "val": "1.2", "unit": "A"}]}, {"id": 23, "data": [{"type": "powerunit", "val": "47", "unit": "W"}]}, {"id": 24, "data": [{"type": "supplyunit", "val": "131", "unit": "VA"}]}, {"id": 25, "data": [{"type": "voltage", "val": "100.9", "unit": "V"}]}, {"id": 26, "data": [{"type": "amperage", "val": "3.4", "unit": "A"}]}, {"id": 27, "data": [{"type": "powerunit", "val": "288", "unit": "W"}]}, {"id": 28, "data": [{"type": "supplyunit", "val": "360", "unit": "VA"}]}, {"id": 29, "data": [{"type": "frequency", "val": "60.0", "unit": "Hz"}]}]}

/*
	Supplementary functions
*/

// const crypto = require('crypto');

/*
 * 	Main workflow begins
 */


const URL = 'https://api.woollet.net/carbon/carbon/datapost';

const POST = {
//	did: 'a54349c1-ab06-4eb1-8144-51b23ed81c32',
	//did: 'bc9b5654-c6d5-471f-9c6a-295ce41a3829',
	did: '6026856c-f014-4e12-921c-709ceb806e66',
	data: JSON.stringify(DATA),
	obj: {},
};

console.log('\n\nURL:', URL);
console.log('\nParameters\n\n', JSON.stringify(POST, null, 4))


fetch( URL,
  {
    method: 'POST',
    headers: {'accept':'application/json', 'Content-Type':'application/json'},
    body: JSON.stringify(POST),
  }
).then(r=>{
  r.json().then(j=>{
	  console.log(typeof(j), JSON.stringify(j, null, 4))
  })
})


/*
// normal resposne "app_id"
{
  status: 0,
  time: '2023-02-01T05:55:52.336626',
  response: '',
  data: {
    vc: {
      updated_at: '2023-02-01 05:18:38.400637Z',
      created_at: '2023-02-01 05:18:38.400637Z',
      settings: [Object],
      key_management_mode: 'managed',
      wallet_id: 'df512c75-18f7-48b6-a76a-b745a46642b2',
      token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ3YWxsZXRfaWQiOiJkZjUxMmM3NS0xOGY3LTQ4YjYtYTc2YS1iNzQ1YTQ2NjQyYjIifQ.n82GautfsK1GvQXYHnzImlH_zR1ml5gAXHaPBxqIDHE'
    },
    eth: {
      address: '0x6c67ab0B56c912Dc36Af1728Ed4Ce8627E6aa543',
      privateKey: '0x31a0281e106ea229389bb84e62b842e2a6118aaf2b7e86cfd1d130338a7fc20c'
    }
  },
  code: 200,
  key: '',
  hash: ''
}
*/

