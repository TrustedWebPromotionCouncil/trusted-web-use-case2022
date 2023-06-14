import * as dotenv from "dotenv";
import Koa from "koa";
import Router from "koa-router";
import { koaBody } from "koa-body";

import jwtHandler, { tokenProfile } from "./utils/jwt";
import { verifyReCaptchaChallenge } from "./re-captcha";
import store from "./store";
import vc from "./verifiable-credentials";

import "./fetch-polyfill";
import {
  buildOriginatorProfile,
  validateHolderProfile,
} from "./originatorProfile/originatorProfile";
import keys from "./keys";

dotenv.config();
const app = new Koa();
const router = new Router();
await store.createDb();

/*
Sample Credential
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1"
  ],
  "id": "http://example.edu/credentials/3732",
  "type": ["VerifiableCredential", "UniversityDegreeCredential"],
  "issuer": "https://example.edu/issuers/565049",
  "issuanceDate": "2010-01-01T00:00:00Z",
  "credentialSubject": {
    "id": "did:example:ebfeb1f712ebc6f1c276e12ec21",
    "degree": {
      "type": "BachelorDegree",
      "name": "Bachelor of Science and Arts"
    }
  }
}
 */
export const generateExpireDate = (date: Date, expire: number): string => {
  const newDate = new Date(date);
  if (expire) {
    newDate.setDate(newDate.getDate() + expire);
  }
  return newDate.toLocaleString();
};

router.get("/api/3rd-party/op-list", async (ctx: Koa.Context) => {
  const allProfile = await store.selectALLHolderProfile();
  const opList = allProfile.map((profile) => ({
    rowid: profile.rowid,
    name: JSON.parse(profile.profile).name,
    url: JSON.parse(profile.profile).url,
    issuedAt: generateExpireDate(profile.created_at, 0),
    expire: generateExpireDate(profile.created_at, profile.expire),
  }));
  setKoaResponse(200, opList, ctx.response);
});

router.get("/api/3rd-party/op/:id", async (ctx: Koa.Context) => {
  const { id } = ctx.params;
  const profile = await store.selectHolderProfile(id);
  if (profile) {
    const b64PrivateKeys = keys.getEnvKeys();

    const keyId = "key-1";
    const signingKey = keys.getPrivateById(keyId, b64PrivateKeys);
    const op = buildOriginatorProfile(profile);
    // 本来であれば複数あるキーペアから署名する秘密鍵を選択するような運用になるが、
    // 今はkeyIdを固定で指定
    const privateKeyPem = keys.getPrivateKeyPem(signingKey!.key, "P-256");
    const jwt = tokenProfile(op, keyId, privateKeyPem);
    setKoaResponse(200, jwt, ctx.response);
  } else {
    setKoaResponse(400, [], ctx.response);
  }
});
router.get("/.well-known/jwks.json", async (ctx: Koa.Context) => {
  const b64PrivateKeys = keys.getEnvKeys();
  const PublicJwk = keys.getPublicJwks(b64PrivateKeys);
  setKoaResponse(200, PublicJwk, ctx.response);
});

router.post("/api/3rd-party/op", koaBody(), async (ctx: Koa.Context) => {
  const body = ctx.request.body;
  try {
    validateHolderProfile(body);
    await store.insertHoldersProfile(body);
    setKoaResponse(201, [], ctx.response);
  } catch (err) {
    console.error(err);
    setKoaResponse(400, [], ctx.response);
  }
});

router.delete("/api/3rd-party/vc/:id", (ctx: Koa.Context) => {
  // issue new verifiable credential
  // send new vc to d-web node
  const { id } = ctx.params;
  console.debug({ id });
  setKoaResponse(204, [], ctx.response);
});

router.get("/api/not-bot/re-captcha-site-key", (ctx: Koa.Context) => {
  const siteKey = process.env.RE_CAPTCHA_SITE_KEY;
  setKoaResponse(200, { reCaptchaSiteKey: siteKey }, ctx.response);
});
router.post("/api/not-bot/register", koaBody(), async (ctx: Koa.Context) => {
  const body = ctx.request.body;
  try {
    const { issuer, payload } = await jwtHandler.decodeJwt(body.token);
    const success = await verifyReCaptchaChallenge(payload.challenge);
    if (success) {
      await store.insertVerifiedDID(issuer);
      setKoaResponse(201, [], ctx.response);
    } else {
      setKoaResponse(400, [], ctx.response);
    }
  } catch (err) {
    console.error(err);
    setKoaResponse(400, [], ctx.response);
  }
});
router.post("/api/not-bot/issue-vc", koaBody(), async (ctx: Koa.Context) => {
  const body = ctx.request.body;
  try {
    const { issuer, payload } = await jwtHandler.decodeJwt(body.token);
    const row = await store.selectVerifiedDID(issuer);
    if (row?.did) {
      const vcJwt = await vc.issueNotBotVC(payload.sub!);
      setKoaResponse(201, { notBotVC: vcJwt }, ctx.response);
    } else {
      setKoaResponse(400, [], ctx.response);
    }
  } catch (err) {
    console.error(err);
    setKoaResponse(400, [], ctx.response);
  }
});
// todo 後で消す
router.get("/api/test", (ctx: Koa.Context) => {
  console.debug("/api/test is called");
  setKoaResponse(200, "This is a temporary endpoint!", ctx.response);
});

app.use(router.routes()).use(router.allowedMethods());

// Handler to return bad request for all unhandled paths.
app.use((ctx, _next) => {
  ctx.response.status = 400;
});

const port = process.env.APP_PORT;
app.listen(port, () => {
  console.log(`running on port: ${port}`);
});

const setKoaResponse = (
  statusCode: number,
  body: any,
  koaResponse: Koa.Response
) => {
  koaResponse.status = statusCode;
  if (statusCode !== 204) {
    koaResponse.set("Content-Type", "application/json");
    koaResponse.body = JSON.stringify(body);
  }
};
export default app;
