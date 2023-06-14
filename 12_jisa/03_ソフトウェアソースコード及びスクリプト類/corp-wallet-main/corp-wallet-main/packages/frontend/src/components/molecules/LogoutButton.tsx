import { useMsal } from "@azure/msal-react";

export const LogoutButton: React.FC = () => {
  const { instance } = useMsal();
  return (
    <div>
      <button onClick={() => instance.logout()}>ログアウト</button>
    </div>
  );
};
