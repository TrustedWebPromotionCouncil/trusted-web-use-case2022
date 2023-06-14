import { Configuration } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: "66159013-5574-4d26-a076-0ece113e83cc",
    authority: "https://devvcb2c.b2clogin.com/devvcb2c.onmicrosoft.com/B2C_1A_SIGNUP_SIGNIN_VC",
    knownAuthorities: ["devvcb2c.b2clogin.com"],
    redirectUri: "/",
    postLogoutRedirectUri: "/",
  },
  cache: {
    cacheLocation: "localStorage",
  },
};

export const loginRequest = {
  scopes: ["openid", "offline_access"],
};
