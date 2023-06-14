import { useMsal } from "@azure/msal-react";

import { loginRequest } from "../../lib/auth/config";

export const LoginButton: React.FC = () => {
  const { instance } = useMsal();
  return (
    <div>
      <button onClick={() => instance.loginRedirect(loginRequest)}>ログイン</button>
    </div>
  );
};
