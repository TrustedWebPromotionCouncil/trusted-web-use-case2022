import React from "react";
import * as ReactDOM from "react-dom/client";
import { EmailOfferRequest } from "../../src/popup/emailOfferRequest/EmailOfferRequest";

const rootElement = document.getElementById("root");
// https://blog.logrocket.com/how-to-use-typescript-with-react-18-alpha/
if (!rootElement) throw new Error("Failed to find the root element");
const root = ReactDOM.createRoot(rootElement);
root.render(
  <>
    <EmailOfferRequest />
  </>
);
