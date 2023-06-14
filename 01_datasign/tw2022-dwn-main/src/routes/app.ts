import * as dotenv from "dotenv";
dotenv.config();
import Koa from "koa";
import Router from "koa-router";
import getRawBody from "raw-body";
import {
  Dwn,
  DidResolver,
  Response,
  CollectionsWriteMessage,
} from "@tbd54566975/dwn-sdk-js";
import { MessageStoreLevel } from "../../node_modules/@tbd54566975/dwn-sdk-js/dist/esm/src/store/message-store-level";
import AccessLogger from "../services/accessLog";

const messageStore = new MessageStoreLevel();
const didResolver = new DidResolver();

const app = new Koa();
const router = new Router();

// Raw body parser.
app.use(async (ctx, next) => {
  ctx.body = await getRawBody(ctx.req);
  await next();
});

console.log(`Instantiating DWN...`);
const dwn = await Dwn.create({ messageStore });

router.post("/", async (ctx, _next) => {
  const response = await dwn.processRequest(ctx.body);
  const content = ctx.body;
  // console.debug({ response });
  setKoaResponse(response, ctx.response);
  try {
    const accessLogger = new AccessLogger(content, response, {
      messageStore,
      didResolver,
    });
    await accessLogger.save();
  } catch (err) {
    console.error(err);
    throw err;
  }
});

app.use(router.routes()).use(router.allowedMethods());

// Handler to return bad request for all unhandled paths.
app.use((ctx, _next) => {
  ctx.response.status = 400;
});

/**
 * Sets the koa response according to the DWN response object given.
 */
const setKoaResponse = (response: Response, koaResponse: Koa.Response) => {
  koaResponse.status = response.status ? response.status.code : 200;

  koaResponse.set("Content-Type", "application/json");
  koaResponse.body = JSON.stringify(response);
};

export default app;
