
// Test Script for Carbon project datapost endpoint
// Author: DataGateway Pte. Ltd.
// Version: 1.8
// Date: 2023-03-01

// Execute by "nodejs" environment
// e.g. Mac or Linux command line / console
//
// node data-matsumoto.js
// (result will be output to command prompt/console)



/*
 *	Sample data
 *      20230308.json
 */


//  On system with NodeJs < 18, need to require node-fetch package
const fetch = require('node-fetch');
const fs = require('fs')

const batch = {};
const frame = [];
const path = './20230308';


const publish = async o => {

        const URL = 'https://api.woollet.net/carbon/carbon/datapost';
        const DATA = {
                did: '3cc93c3e-e464-44c8-9459-dbc8b22d0981', // Wallet IP address
                data: JSON.stringify(o),
                obj: {},
                multiple: 24,
        };

        console.log('\n\nURL:', URL);
        console.log('\nParameters\n\n', JSON.stringify(DATA, null, 4).substring(0,255)+' ...')

        fetch( URL,
          {
            method: 'POST',
            headers: {'accept':'application/json', 'Content-Type':'application/json'},
            body: JSON.stringify(DATA),
          }
        ).then(r=>{
          r.json().then(j=>{
                  console.log(typeof(j), JSON.stringify(j, null, 4))
          })
        })

};


let c = 0;
let use = 1;
let offset = 0;

fs.readdir(path, (err, files) => {
    if (err)
      console.log('ERROR: '+err);
    else {
  
      files.forEach(file => {
          c++;
          const month = file.substring(0, 6).replace('-', '');
          const date = file.substring(0, 9).replace('-', '');
          const hour = file.substring(0, 11).replace('-', '');
          const time = file.substring(0, 16).replace(/\-/g, '');
          if (!(hour in batch)) {
                  batch[hour] = []
          }
          let data = fs.readFileSync(path+'/'+file,{encoding:'utf8', flag:'r'});
          try { data = JSON.parse(data) } catch (e) { }
          batch[hour].push(data)
          data.month = month-0;
          data.date = date-0;
          data.hour = hour-0;
          data.times = time-0;
          frame.push(data)
      })
      const ba = [];  
      for (const i in batch) {
        ba.push(i)
      }
      const loop = () => {
          const a = ba.shift()
          let s = batch[a]
          try { s = JSON.parse(s) } catch (e) { }
          publish(s)
          if (ba.length>0) {
                setTimeout(loop, 1)
          }
      }
  
      loop()
  
    }
  })
    
