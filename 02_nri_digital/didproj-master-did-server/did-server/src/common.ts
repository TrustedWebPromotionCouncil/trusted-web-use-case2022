import { PrismaClient } from '@prisma/client';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import dayjs from 'dayjs';
import {
  DidManager,
  DidObject,
  IonDidCreaterWithChallenge,
  IonDidResolver,
  selectLocale,
} from 'did-sdk';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import QRCode from 'qrcode';

export const didMgr = new DidManager([new IonDidCreaterWithChallenge()], [new IonDidResolver()]);

export const prisma = new PrismaClient();

/**
 * AccessToken.optionsJson
 */
export class AccessTokenOptions {
  static stringify(values: { nonce?: string }) {
    return JSON.stringify(values);
  }

  static parse(jsonString: string): { nonce?: string } {
    return JSON.parse(jsonString);
  }
}

export const ajv = new Ajv({ allowUnionTypes: true });
addFormats(ajv);

export const orDefault = (obj: Record<string, unknown>, propString: string, defaultValue = '') => {
  const props = propString.split('.');
  let ret = obj;
  for (const item of props) {
    if (!ret[item]) {
      return defaultValue;
    }
    ret = ret[item] as Record<string, unknown>;
  }
  return ret;
};

export const formatDayjs = (date: string | number | Date | dayjs.Dayjs) =>
  dayjs(date).format('YYYY-MM-DD HH:mm:ss');

/**
 * EJSで利用する共通関数の定義
 * @param opt
 * @returns
 */
export const createEjsOpt = (opt: Record<string, unknown> = {}) => ({
  func: {
    orDefault,
    createByJsonString: DidObject.createByJsonString,
    selectLocale,
    formatDayjs,
  },
  ...opt,
});

const SETTING_FILE_PATH = path.join(__dirname, '../setting.json');

export const saveSetting = (setting: unknown) => {
  writeFileSync(SETTING_FILE_PATH, JSON.stringify(setting, null, 2), {
    encoding: 'utf-8',
  });
};

const loadSetting = () => {
  let setting: {
    walletIssuanceUri: string;
    walletOidcSiopUri: string;
  };

  try {
    setting = JSON.parse(
      readFileSync(SETTING_FILE_PATH, {
        encoding: 'utf-8',
      })
    );
  } catch {
    setting = {
      walletIssuanceUri: 'http://localhost:3000/initiate_issuance',
      walletOidcSiopUri: 'http://localhost:3000/oidc_siop',
    };
    saveSetting(setting);
  }
  return setting;
};

export const setting = loadSetting();

export const getQrImgString = (text: string) =>
  new Promise((resolve) => {
    QRCode.toDataURL(text, (_err, str) => {
      resolve(str);
    });
  });

export const createPin = (pinLength: number) => {
  let pin = '';
  for (let i = 0; i < pinLength; i += 1) {
    pin += Math.floor(Math.random() * 10);
  }
  return pin;
};

export const httpOrS = (host?: string) => {
  if (!host) {
    return '';
  }
  return host.indexOf('localhost') === 0 ? `http://${host}` : `https://${host}`;
};
