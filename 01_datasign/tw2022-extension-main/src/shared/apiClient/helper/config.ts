// import { Config } from '@/config';

import { Configuration } from '../runtime';
import { postResponse } from './postResponse';

// basePath: 'https://api.develop.bunsin.io/v1',
export const getConfig = (accessToken?: string) => {
  return new Configuration({
    basePath: process.env.API_BASE_PATH,
    fetchApi: fetch,
    middleware: [{ post: postResponse }],
    accessToken,
  });
};
