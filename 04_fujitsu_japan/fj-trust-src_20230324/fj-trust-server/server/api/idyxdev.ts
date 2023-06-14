import crypto from 'crypto';
import { Router, Request, Response } from 'express';
import axiosBase from 'axios'; // axios

const router = Router();

const axios = axiosBase.create({
    baseURL: '（IDYXに接続するためのURL：ポートを設定してください）',
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Trust-Request-Id': '（指定されたTrust-Request-Idを設定してください）'
    },
    proxy: false,
    responseType: 'json'
});

// Settings
const MAX_CERT_NUMBER = 2;

// Create Certification & Send Certification
router.post("/create_cert_dev", async (req: Request, res: Response) => {
    // issuer
    axios.defaults.headers.common['Trust-Agent-Id'] = req.body.trustAgentId;
    axios.defaults.headers.common['Trust-Agent-Role'] = req.body.trustAgentRole;
    axios.defaults.headers.common['Trust-User-Id'] = req.body.trustUserId;
    axios.defaults.headers.common['Trust-User-Role'] = req.body.trustUserRole;

    console.log('post:[create_cert_dev]{%j}', req.body)
    const requestCreateData = req.body.requestData;
    try {
        console.log('create_cert_dev:' + req.method);
        // Create Certification
        const resp = await axios.post('tseal_create_certificate', requestCreateData);
        console.log('end_cert_id:' + resp.data.detail.certificate_id);
        res.send(resp.data.detail.certificate_id);
    } catch (e) {
        if (e instanceof Error) console.error(e.message);
        res.status(500).send('Server Error');
    }
});

// Send Certification
router.post("/send_cert_dev", async (req: Request, res: Response) => {
    // issuer
    axios.defaults.headers.common['Trust-Agent-Id'] = req.body.trustAgentId;
    axios.defaults.headers.common['Trust-Agent-Role'] = req.body.trustAgentRole;
    axios.defaults.headers.common['Trust-User-Id'] = req.body.trustUserId;
    axios.defaults.headers.common['Trust-User-Role'] = req.body.trustUserRole;

    console.log('post:[send_cert_dev]{%j}', req.body)
    const requestSendData = req.body.requestData;

    try {
        console.log('send_cert_dev:' + req.method);
        // Send Certification
        const respSend = await axios.post('tseal_send_certificate', requestSendData);
        console.log('end_result:' + respSend.data.result);
        res.send(respSend.data.result);
    } catch (e) {
        if (e instanceof Error) console.error(e.message);
        res.status(500).send('Server Error');
    }
});

// Revoke Certification
router.post("/revoke_cert_dev", async (req: Request, res: Response) => {
    // issuer
    axios.defaults.headers.common['Trust-Agent-Id'] = req.body.trustAgentId;
    axios.defaults.headers.common['Trust-Agent-Role'] = req.body.trustAgentRole;
    axios.defaults.headers.common['Trust-User-Id'] = req.body.trustUserId;
    axios.defaults.headers.common['Trust-User-Role'] = req.body.trustUserRole;

    console.log('post:[revoke_cert_dev]{%j}', req.body)
    const requestRevokeData = req.body.requestRevokeData;
    try {
        console.log('revoke_cert_dev:' + req.method);
        // Create Certification
        const resp = await axios.post('tseal_revoke_certificate', requestRevokeData);
        console.log('end_result:' + resp.data.detail.result);
        res.send(resp.data.detail.result);
    } catch (e) {
        if (e instanceof Error) console.error(e.message);
        res.status(500).send('Server Error');
    }
});

router.post("/list_received_dev", async (req: Request, res: Response) => {
    console.log('post:[list_received_dev]{%j}', req.body)
    axios.defaults.headers.common['Trust-Agent-Id'] = req.body.trustAgentId;
    axios.defaults.headers.common['Trust-Agent-Role'] = req.body.trustAgentRole;
    axios.defaults.headers.common['Trust-User-Id'] = req.body.trustUserId;
    axios.defaults.headers.common['Trust-User-Role'] = req.body.trustUserRole;

    const requestGetData = req.body.requestData;

    try {
        const resp = await axios.post('tseal_list_received_certificates', requestGetData);
        console.log('end_certs={%j}', resp.data.detail);
        res.send(resp.data.detail);
    } catch (e) {
        if (e instanceof Error) console.error(e.message);
        res.status(500).send('Server Error');
    }
})

router.post("/apply_seal_dev", async (req: Request, res: Response) => {
    console.log('post:[apply_seal_dev]{%j}', req.body)
    axios.defaults.headers.common['Trust-Agent-Id'] = req.body.trustAgentId;
    axios.defaults.headers.common['Trust-Agent-Role'] = req.body.trustAgentRole;
    axios.defaults.headers.common['Trust-User-Id'] = req.body.trustUserId;
    axios.defaults.headers.common['Trust-User-Role'] = req.body.trustUserRole;

    // holder
    const requestApplyData = req.body.applyData;

    try {
        console.log('apply_seal_dev:' + req.method);
        // Create TrustSeal
        const respApply = await axios.post('tseal_create_trust_seal', requestApplyData);
        console.log('end_sealId:' + respApply.data.detail.trust_seal_id);
        res.send(respApply.data.detail.trust_seal_id);

    } catch (e) {
        if (e instanceof Error) console.error(e.message);
        res.status(500).send('Server Error');
    }
})

router.post("/verify_seal_dev", async (req: Request, res: Response) => {
    console.log('post:[verify_seal_dev]{%j}', req.body)
    axios.defaults.headers.common['Trust-Agent-Id'] = req.body.trustAgentId;
    axios.defaults.headers.common['Trust-Agent-Role'] = req.body.trustAgentRole;
    axios.defaults.headers.common['Trust-User-Id'] = req.body.trustUserId;
    axios.defaults.headers.common['Trust-User-Role'] = req.body.trustUserRole;

    // verifier
    const requestVerifyData = req.body.verifyData;
    // Verify Seal
    const resp = await axios.post('tseal_verify_trust_seal', requestVerifyData);
    console.log('end_resut:' + resp.data.result);
    // Get Attributes
    const requestGetData = {
        trust_seal_id: requestVerifyData.trust_seal_id
    };
    console.log('requestGetData={%j}', requestGetData)
    const respAttr = await axios.post('tseal_get_trust_seal_attributes', requestGetData);
    console.log('end_data:{%j}', respAttr.data.detail);
    res.send(respAttr.data.detail);
})

export default router;