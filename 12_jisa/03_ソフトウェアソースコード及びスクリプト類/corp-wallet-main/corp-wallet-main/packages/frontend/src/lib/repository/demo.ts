import { proxyHttpRequest } from "../http";

export const resetDatabase = async () => {
  await proxyHttpRequest("post", `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/demoRequest/resetDB`);
};
