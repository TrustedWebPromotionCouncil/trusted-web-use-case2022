export const verifyReCaptchaChallenge = async (challenge: string) => {
  const reCaptchaUrl = process.env.RE_CAPTCHA_VERIFY_SERVER_URL || "";
  const secret = process.env.RE_CAPTCHA_SECRET;
  const opt = {
    method: "post",
    body: `secret=${secret}&response=${challenge}`,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  };
  try {
    const response = await fetch(reCaptchaUrl, opt);
    const result = (await response.json()) as { success: boolean };
    console.debug({ result });
    return result.success;
  } catch (err) {
    console.error({ err });
    throw err;
  }
};
