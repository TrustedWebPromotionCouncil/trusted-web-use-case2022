import express from "express";

import { initKeyPair } from "./lib/key/key";
import { credentialsRoute } from "./routing/credentials";
import { demoRequestRoute } from "./routing/demo";
import { siopRequestRoute } from "./routing/siopRequest";
import { siopV2RequestRoute } from "./routing/siopV2Request";
import { transactionsRoute } from "./routing/transactions";
import { vpRequest } from "./routing/vpRequest";

const app = express();
const port = process.env.PORT || 8080;

// TODO: Add msal middleware

app.get("/", async (req, res) => {
  res.send("Hello World!");
});

app.use(express.json());

app.use("/api/credentials", credentialsRoute);

app.use("/api/transactions", transactionsRoute);

app.use("/api/siopRequest", siopRequestRoute);

app.use("/api/siopV2Request", siopV2RequestRoute);

app.use("/api/vpRequest", vpRequest);

app.use("/api/demoRequest", demoRequestRoute);

app.listen(port, async () => {
  await initKeyPair();
  console.log(`App listening on port ${port}`);
});
