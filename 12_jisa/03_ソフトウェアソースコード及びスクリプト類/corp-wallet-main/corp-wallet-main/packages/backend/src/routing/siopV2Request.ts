import express from "express";

import { siopV2 } from "../lib/siop";

export const siopV2RequestRoute = express.Router();

// TODO: エラーハンドリング

siopV2RequestRoute.post("/", async (req, res) => {
  const token = await siopV2(req.body.options);
  return res.send({ token });
});
