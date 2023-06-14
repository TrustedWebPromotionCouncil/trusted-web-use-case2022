import express from "express";

import {
  deleteTransaction,
  getTransaction,
  getTransactions,
  saveNewTransaction,
  updateTransaction,
} from "../repository/store";

export const transactionsRoute = express.Router();

// TODO: エラーハンドリング

transactionsRoute.get("/", async (req, res) => {
  const transactions = await getTransactions();
  return res.json(transactions);
});

transactionsRoute.get("/:transactionID", async (req, res) => {
  const transaction = await getTransaction(req.params.transactionID);
  return res.json(transaction);
});

transactionsRoute.post("/", async (req, res) => {
  const transactionID = await saveNewTransaction(req.body.transaction);
  return res.json({ transactionID });
});

transactionsRoute.delete("/:transactionID", async (req, res) => {
  await deleteTransaction(req.params.transactionID);
  return res.send("DELETE /api/credential");
});

transactionsRoute.post("/:transactionID/update", async (req, res) => {
  const transactionID = `${req.params.transactionID}`;
  await updateTransaction(transactionID, req.body.transaction);
  return res.json({ transactionID });
});
