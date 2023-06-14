import express from "express";

import { createVP } from "../lib/siop";

export const vpRequest = express.Router();

// TODO: エラーハンドリング

vpRequest.post("/", async (req, res) => {
  const token = await createVP(req.body.options);
  return res.send({ token });
});
