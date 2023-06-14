import express from "express";

import { addVCHistory, deleteCredentials, getCredential, getCredentials, saveNewCredential } from "../repository/store";

export const credentialsRoute = express.Router();

// TODO: エラーハンドリング

credentialsRoute.get("/", async (req, res) => {
  const credentials = await getCredentials();
  return res.json(credentials);
});

credentialsRoute.post("/", async (req, res) => {
  const credentialID = await saveNewCredential(req.body.credential);
  return res.json({ credentialID: credentialID });
});

credentialsRoute.get("/:credentialID", async (req, res) => {
  const credentials = await getCredential(req.params.credentialID);
  return res.json(credentials);
});

credentialsRoute.post("/:credentialID/addHistory", async (req, res) => {
  const credentialID = `${req.params.credentialID}`;
  await addVCHistory(credentialID, req.body.history);
  return res.send("`POST /:credentialID/addHistory");
});

credentialsRoute.delete("/:credentialID", (req, res) => {
  deleteCredentials(req.params.credentialID);
  return res.send("DELETE /api/credential");
});
