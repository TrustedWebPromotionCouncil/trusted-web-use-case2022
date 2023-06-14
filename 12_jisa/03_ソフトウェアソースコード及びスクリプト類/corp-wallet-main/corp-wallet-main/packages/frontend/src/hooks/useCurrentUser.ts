import { AccountInfo } from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";

interface Account extends AccountInfo {
  idTokenClaims: {
    aud: string;
    auth_time: number;
    name: string;
    email: string;
    iss: string;
    nbf: number;
    nonce: string;
    sub: string;
    tfp: string;
    ver: string;
  };
}

export interface User {
  sub: string;
  name: string;
  email: string;
}

const useCurrentUser = (): User | null | undefined => {
  const { accounts } = useMsal();
  if (accounts.length > 0) {
    const account = accounts[0] as Account;
    const user: User = {
      sub: account.idTokenClaims?.sub,
      name: account.idTokenClaims?.name,
      email: account.idTokenClaims?.email,
    };
    return user;
  }
  return null;
};

export default useCurrentUser;
