import express from "express";

import { siop } from "../lib/siop";

export const siopRequestRoute = express.Router();

// TODO: エラーハンドリング

siopRequestRoute.post("/", async (req, res) => {
  const token = await siop(req.body.options);
  return res.send({ token });
});
