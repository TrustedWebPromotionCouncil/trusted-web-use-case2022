# Woollet Admin System for Carbon Tracing Project

## **Description**

Carbon Tracing Admin UI Web application.

This is mostly a [Next.js](https://urldefense.com/v3/__https://nextjs.org/__;!!GCTRfqYYOYGmgK_z!509Ld1Mwvz_YXX0WV7naoVN-cLT-Qg-LBrqvIC-QZXY67ImyJwhxV0ylT6PtppFutXLH-NydxR62v-UFg__rzTtHZpZ4PdvjNJmDrByaxA$ ) project bootstrapped with [`create-next-app`](https://urldefense.com/v3/__https://github.com/vercel/next.js/tree/canary/packages/create-next-app__;!!GCTRfqYYOYGmgK_z!509Ld1Mwvz_YXX0WV7naoVN-cLT-Qg-LBrqvIC-QZXY67ImyJwhxV0ylT6PtppFutXLH-NydxR62v-UFg__rzTtHZpZ4PdvjNJnv1Reh5g$ ).

## **Features**

The admin UI system can, among other things:

-   Maintain schemas and envelope schemas that fit the actual data pattern, and splitting for Precise Targeting query
-   Store logs of issuing and verification requests
-   Manage profile of the company, mainly for reporting purposes
-   Supplychain partner Admin Signin/Signout
-   Raw Data credential reporting
-   Manage connections
-   Manage organization and supplychain partner's staff
-   Request and view data according to staff or partnership role

## **Requirements**

-   NodeJS >= 18.16

Some major libraries that will be automatically installed with `npm install` below include:

-   React >= 18.2
-   NextJS >= 13.0.5
-   Bootstrap >= 5.2.3
-   Chart.js >= 4.2.1
-   React-chartjs-2 >= 5.2.0
-   Datatables.net >= 1.13.1
-   Next-qrcode >= 2.4.0
-   Socket.io-client >= 4.5.4

## **How to Run**

First, install required libraries:

```bash
npm install
```

Then, run the development server:

```bash
npm run start
```

or

```bash
yarn start
```

Go to [https://urldefense.com/v3/__http://localhost:3000*(http:/*localhost:3000)__;XS8!!GCTRfqYYOYGmgK_z!509Ld1Mwvz_YXX0WV7naoVN-cLT-Qg-LBrqvIC-QZXY67ImyJwhxV0ylT6PtppFutXLH-NydxR62v-UFg__rzTtHZpZ4PdvjNJn1clJBbw$  on your browser to see the result.

## **Directory Structure**

### `/components`

---

-   Major UI components for pages rendering, including:
    -   Main Menu:
        -   `Navbar.js`

### `/data`

---

-   Woollet API connectors
    -   `did.js`
-   Socket operation
    -   `socket.js`
-   Table Rendering Lib
    -   `woollet.js`

### `/pages`

---

-   `/api`
    -   Local wrapper of API for preprocessing & data handling functions
        `/conn` : Connection management
        `/data` : Data handling requesting
        `/wallet` : Data credentials' listing for review
        `/ipfs` : Data content retrieval from Woollet private IPFS (operation to be carried out through a TEE)
        `/issues` : VC Issuing logging
        `/verify` : Presentation request handling
        `/envelope` : Maintenance of data envelope, meta data retrieval
-   `/supplychain`
    -   Creation of new partners (organizations) by Admin
    -   Major supply-chain partner, and their staffs maintenance
    -   Linking to new staff members
    -   Partner's staff login
-   `/data`
    -   Data requesting by staff members
    -   Data vieweing by staff members
-   `/system`
    -   Current organization's main configurations & status
    -   Schema maintenance, including data envelope & identity schemas
    -   Wallet Content (mainly data credentials list)
