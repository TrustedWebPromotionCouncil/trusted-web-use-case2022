# Woollet Universal Wallet for Carbon Tracing

## **Description**

Carbon Tracing web wallet application.

This is mostly a [Next.js](https://urldefense.com/v3/__https://nextjs.org/__;!!GCTRfqYYOYGmgK_z!_5ZZnZ25nOaYX10JbFmnoWB5ODXc2vavlESHmCavYjnuwU7OYEJD7ye4RH8fDhDeeqYqYEBokf1rRptA4zdSo9ITwySUcYJSRDIW$ ) project bootstrapped with [`create-next-app`](https://urldefense.com/v3/__https://github.com/vercel/next.js/tree/canary/packages/create-next-app__;!!GCTRfqYYOYGmgK_z!_5ZZnZ25nOaYX10JbFmnoWB5ODXc2vavlESHmCavYjnuwU7OYEJD7ye4RH8fDhDeeqYqYEBokf1rRptA4zdSo9ITwySUcTdjoHya$ ).

## **Basic Workflow**

### New user

1. A new user goes to the **Index** page (`index.js`)
2. The user **Signs Up**, filling in username and password to request a new wallet
3. When the wallet is created, they will be redirected to the **Home** page

### Receive Credential

1. Currently, credentials are being received automatically
2. Once received, they can be see in the **Wallet** page
3. Users can click on a **credential box**, which will expand and show the details of the credential

### Response to Presentation Request

1. In the Wallet page, requested credentials will have a red flashing dot showing at the top right corner
2. Users can open that credential, which will show an addtional box below the details with an **Accept** and **Reject** buttons
3. Users can see:
    - Requested Party (or name of this operation)
    - Reason for the request
    - Exact requested field(s) which are being requested
    - Technical information (e.g. presentation ID for follow up purposes, etc.)
4. Users clicks on one of the buttons
    - **Accept**: the credential field(s) will be presented to the Requester.
    - **Reject**: the request will be rejected. The Requester side can now see status of the rejection.
5. By pressing one of the buttons, the request will no longer be shown in the Credential box.
6. A log of the presentation request can later be found in the **Transactions** page.

## **Features**

The web wallet can, among other things:

-   List identity and data credentials issued to the wallet owner
-   Respond to data sharing requests, allowing users to accept or reject them
-   Show past history of data sharing requests
-   Revoke viewing of shared carbon data

## **Requirements**

-   NodeJS >= 18.16

Some major libraries that will be automatically installed with `npm install` below include:

-   React >= 18.2
-   NextJS >= 13.0.5
-   Bootstrap >= 5.2.3
-   Web3.js >= 1.8.1

## **How to Run**

First, install required libraries:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

or

```bash
yarn dev
```

Go to [https://urldefense.com/v3/__http://localhost:3000*(http:/*localhost:3000)__;XS8!!GCTRfqYYOYGmgK_z!_5ZZnZ25nOaYX10JbFmnoWB5ODXc2vavlESHmCavYjnuwU7OYEJD7ye4RH8fDhDeeqYqYEBokf1rRptA4zdSo9ITwySUcejV5c7j$  on your browser to see the result.

## **Directory Structure**

### `/components`

---

-   Major UI components for pages rendering, including:
    -   Main Menu:
        -   `Menu.js`
        -   `Nav.js`
    -   Home Page Credentials List
        -   `Card.js`
-   QRCode handler for scanning operation
    -   `QrScannerModal.js`
    -   `qr/\*`

### `/data`

---

-   Woollet API connectors
    -   `did.js`
    -   `woollet.js`
-   Socket operation
    -   `socket.js`

### `/pages`

---

-   `index.js`
    -   First page
    -   Sign-in & Sign-up features
-   `home.js`
    -   Credentials Wallet: shows all identity and data credentials
    -   When a presentation request is received, a notification will be shown here
    -   Users can choose Credential to reply to Presentation Requests, or they can Reject it.
    -   A User's wallets will mainly keep the user's credentials, used to sign-in on Admin & Partner systems.
-   `profile.js`
    -   User name, email & wallet ID
    -   Profile editing functions
-   `transactions.js`
    -   Records all connections information and presentation requests
    -   Serves as main log for Verifiable Credential operations
-   `setting.js`
    -   _TBD_
