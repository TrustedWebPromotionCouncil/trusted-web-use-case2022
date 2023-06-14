import * as api from "../../shared/apiClient";
import { DefaultResult } from "../../shared/asyncProcess";

export const expectedClientErrors: { [key: string]: string } = {
  [api.AlterEgoMailAddressReachedMaxCountExceptionNameEnum
    .AlterEgoMailAddressReachedMaxCountException]:
    "alter_ego_mail_address_reached_max_count_exception",
};

export const getDefaultAccountEmail = async (): Promise<
  DefaultResult<api.AccountEmail>
> => {
  try {
    const defaultConfig = await api.defaultConfig();
    const me = await new api.AccountApi(defaultConfig).getMe();
    const email = me.accountEmails.find((email) => email.primaryEmail)!;
    return { type: "ok", data: email };
  } catch (error) {
    return api.handleApiError(error, expectedClientErrors);
  }
};

export const createAlterEgo = async (
  name: string,
  emailId: number
): Promise<DefaultResult<api.AlterEgo>> => {
  try {
    const defaultConfig = await api.defaultConfig();
    const emailIds = emailId ? [emailId] : [];
    const result = await new api.AlterEgosApi(defaultConfig).createAlterEgo({
      alterEgo: { name, emailIds },
    });
    return { type: "ok", data: result };
  } catch (error) {
    return api.handleApiError(error, expectedClientErrors);
  }
};
