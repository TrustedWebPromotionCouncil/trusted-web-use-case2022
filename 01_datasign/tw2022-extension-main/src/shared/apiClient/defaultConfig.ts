import { Configuration } from "./runtime";
import { getConfig } from "./helper/config";
import { SessionService } from "../services/SessionService";

export const defaultConfig = async (): Promise<Configuration> => {
  let accessToken;
  const result = await SessionService.currentSession(true);
  if (result) {
    accessToken = result.accessToken;
  }
  return getConfig(accessToken);
};
