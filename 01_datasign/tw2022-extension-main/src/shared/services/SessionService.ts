import jwt_decode from "jwt-decode";

import { AuthApi, AuthToken, getConfig } from "../apiClient";
import {
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from "../../utils/dataStore";

interface AccessTokenPayload {
  sub: string;
  exp: number;
}

export const ASYNC_STORAGE_KEY_AUTH_TOKEN = "authToken";
export class SessionService {
  public static async getAuthToken(): Promise<AuthToken | null> {
    return await getLocalStorage(ASYNC_STORAGE_KEY_AUTH_TOKEN);
  }

  public static async saveAuthToken(authToken: AuthToken): Promise<void> {
    await setLocalStorage(ASYNC_STORAGE_KEY_AUTH_TOKEN, authToken);
  }

  public static async clearAuthToken(): Promise<void> {
    await removeLocalStorage(ASYNC_STORAGE_KEY_AUTH_TOKEN);
  }

  public static decodeAccessToken(token: string): AccessTokenPayload {
    const payload: AccessTokenPayload = jwt_decode(token);
    if (payload.exp === undefined || payload.sub === undefined) {
      throw new Error("Invalid access token payload");
    }
    return payload;
  }

  public static hasExpired(
    accessToken: string,
    now: Date = new Date()
  ): boolean {
    const { exp } = SessionService.decodeAccessToken(accessToken);
    return exp * 1000 < now.getTime();
  }

  public static async currentSession(
    refreshIfExpired: boolean = false
  ): Promise<AuthToken | null> {
    const sessionTokens = await SessionService.getAuthToken();
    console.log({ sessionTokens });
    if (sessionTokens) {
      if (
        refreshIfExpired &&
        SessionService.hasExpired(sessionTokens.accessToken)
      ) {
        return await SessionService.refresh(sessionTokens.refreshToken);
      }

      return sessionTokens;
    } else {
      return null;
    }
  }

  public static async refresh(refreshToken: string): Promise<AuthToken> {
    const config = await getConfig();
    const newToken = await new AuthApi(config).getAuthToken({
      refreshToken: { refreshToken },
    });
    await SessionService.saveAuthToken(newToken);
    return newToken;
  }
}
