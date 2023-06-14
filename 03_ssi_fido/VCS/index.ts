import express from 'express';

import createBbsKeyPair from './lib/createBbsKeyPair';
import blsSign from './lib/blsSign';
import getBlsVerifiedResult from './lib/blsVerify';
import createBbsProof from './lib/createBbsProof';
import obtainResult from './lib/obtainResult';



const app: express.Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//CORS
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
})

app.listen(3000, () => {
    console.log("Start on port 3000.")
})


// input  : 
//
// output : keyPair
app.get('/generate_key_pair', async function(req, res) {
    const keyPair = await createBbsKeyPair();

    res.json({
        "keyPair": keyPair,
    });
})


// input  : publicKey
//        : secretkey
//        : messages
//
// output : proof
app.post('/bls_sign', async function(req, res) {
    const proof = await blsSign(
        req.body.pk,
        req.body.sk,
        req.body.messages,
    );

    res.json({
        "proof": proof
    });
})


// input  : signature
//        : publickey
//        : messages
//
// output : result
app.post('/bls_verify', async function(req, res) {
    const is_verified = await getBlsVerifiedResult(
        req.body.signature,
        req.body.publicKey,
        req.body.messages
    );

    res.json({
        "is_verified": is_verified
    });
})

// input  : signature
//        : publickey
//        : messages
//        : revealed
//        : nonce
//
// output : proof
app.post('/bls_create_proof', async function(req, res) {
    const proof = await createBbsProof(
        req.body.signature,
        req.body.publicKey,
        req.body.messages,
        req.body.revealed,
        req.body.nonce,
    );

    res.json({
        "proof": proof
    });
})


app.post('/bls_verify_proof', async function(req, res) {
    const isProofVerified = await obtainResult(
        req.body.proof,
        req.body.publicKey,
        req.body.messages,
        req.body.nonce,
    );

    res.json({
        "isProofVerified": isProofVerified
    });
})




