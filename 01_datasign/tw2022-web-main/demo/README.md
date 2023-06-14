# Getting Started with Demo Server
- setup
    ```bash
  $ cd demo
  $ yarn install
  
- create directory by domain
    ```bash
  $ cd output
  $ mkdir example-1st-party.com example-3rd-party1.com example-3rd-party2.com
- put files (op profile set, did.json)
    ```bash
  $ mv op-profile did.json output/example-1st-party.com
  $ mv did.json output/example-3rd-party1.com
  $ mv did.json output/example-3rd-party2.com
  
- start server
    ```bash
  $ yarn start
