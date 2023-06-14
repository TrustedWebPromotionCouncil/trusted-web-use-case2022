import * as api from '@/shared/apiClient';
import { ResultWithNoContent } from '@/shared/asyncProcess';

const expectedClientErrors: { [key: string]: string } = {
  [api.EmailNotFoundExceptionNameEnum.EmailNotFoundException]:
    'email_not_found_exception',
  [api.EmailNotConfirmedExceptionNameEnum.EmailNotConfirmedException]:
    'email_not_confirmed_exception',
  [api.AccountLockedOutExceptionNameEnum.AccountLockedOutException]:
    'account_locked_out_exception',
};

export const requestSignIn = async (
  email: string,
): Promise<ResultWithNoContent> => {
  try {
    const config = await api.getConfig();
    await new api.AuthApi(config).reqeustAuthentication({
      requestSignIn: { email },
    });
    console.debug('success reqeustAuthentication');
    return { type: 'no_content' };
  } catch (error) {
    return api.handleApiError(error, expectedClientErrors);
  }
};
