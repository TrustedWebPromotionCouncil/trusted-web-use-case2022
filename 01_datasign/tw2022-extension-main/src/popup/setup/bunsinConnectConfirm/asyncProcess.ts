import * as api from '@/shared/apiClient';
import { DefaultResult } from '@/shared/asyncProcess';
import { SessionService } from '@/shared/services';

const expectedClientErrors: { [key: string]: string } = {
  [api.BadRequestNameEnum.InvalidParameterException]:
    'invalid_parameter_exception',
  [api.InvalidCodeExceptionNameEnum.InvalidCodeException]:
    'invalid_code_exception',
  [api.ExpiredCodeExceptionNameEnum.ExpiredCodeException]:
    'expired_code_exception',
  [api.AlreadyConfirmedExceptionNameEnum.AlreadyConfirmedException]:
    'already_confirmed_exception',
};

export const requestSignInConfirm = async (
  email: string,
  code: string,
  decryption: boolean,
): Promise<DefaultResult<api.Me>> => {
  try {
    const config = await api.getConfig();
    // メールアドレス複合化
    if (decryption) {
      const decryptedEmail = await new api.CryptoApi(config).decryptEmail({
        encryptedEmail: { email: email },
      });
      email = decryptedEmail.email;
    }
    const result = await new api.AuthApi(config).confirmEmailForSignIn({
      confirmSignIn: { code, email },
    });
    await SessionService.saveAuthToken(result);
    const defaultConfig = await api.defaultConfig();
    const me = await new api.AccountApi(defaultConfig).getMe();
    return { type: 'ok', data: me };
  } catch (error) {
    return api.handleApiError(error, expectedClientErrors);
  }
};
