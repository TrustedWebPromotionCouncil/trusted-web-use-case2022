import express from "express";

import { resetDB } from "../repository/demo";

export const demoRequestRoute = express.Router();

// TODO: エラーハンドリング

demoRequestRoute.post("/resetDB", async (req, res) => {
  await resetDB();
  return res.status(200).send();
});
