import { SessionService } from "./SessionService";
import { AuthTokenTokenTypeEnum } from "../apiClient";
import * as assert from "assert";

describe("test SessionService", () => {
  test("test saveAuthToken", async () => {
    await SessionService.saveAuthToken({
      accessToken: "abcd",
      refreshToken: "efgh",
      tokenType: AuthTokenTokenTypeEnum.Bearer,
    });
  });
  test("test getAuthToken", async () => {
    const authToken = {
      accessToken: "abcd",
      refreshToken: "efgh",
      tokenType: AuthTokenTokenTypeEnum.Bearer,
    };
    // @ts-ignore
    chrome.storage.local.get.mockResolvedValueOnce({
      authToken,
    });
    const result = await SessionService.getAuthToken();
    assert.equal(result?.accessToken, "abcd");
    assert.equal(result?.refreshToken, "efgh");
    assert.equal(result?.tokenType, AuthTokenTokenTypeEnum.Bearer);
  });
});
