import { ResponseContext } from '../runtime';
import { RequestError } from '../types';
import * as api from '@/shared/apiClient';
import {
  ResultFailedWithClientError,
  ResultFailedWithError,
} from '@/shared/asyncProcess';

export const postResponse = async (context: ResponseContext) => {
  const { response } = context;
  if (!(response.status >= 200 && response.status < 300)) {
    const body = await response.json();
    throw new RequestError(response, body);
  }
  return context.response;
};

export const handleApiError = (
  error: any,
  expectedClientErrors?: { [key: string]: string },
): ResultFailedWithError | ResultFailedWithClientError => {
  console.error(error);
  if ((error as api.RequestError).response) {
    const sourceError = error as api.RequestError;
    const { response, body } = sourceError;
    const { status } = response;
    const clientError = status >= 400 && status < 500;
    if (clientError) {
      const message =
        expectedClientErrors && body.name in expectedClientErrors
          ? expectedClientErrors[body.name]
          : 'BAD_REQUEST';
      const clientErrorInfo = {
        message,
        error: body,
      };
      return {
        type: 'client_error',
        statusCode: status,
        clientErrorInfo,
        sourceError,
      };
    } else {
      return { type: 'error', sourceError };
    }
  } else {
    throw error;
  }
};
