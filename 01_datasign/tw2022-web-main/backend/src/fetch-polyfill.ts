// fetch-polyfill.js
// https://github.com/node-fetch/node-fetch#providing-global-access
// https://www.wheresrhys.co.uk/fetch-mock/#usageglobal-non-global
import fetch, { Headers, Request, Response } from "node-fetch";

if (!globalThis.fetch) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  globalThis.fetch = fetch;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  globalThis.Headers = Headers;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  globalThis.Request = Request;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  globalThis.Response = Response;
}
