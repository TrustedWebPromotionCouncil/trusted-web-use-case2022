interface ClientErrorInfo {
  level?: 'info' | 'error' | 'warn';
  message: string;
  subMessage?: string;
  error?: Error;
}

// https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions
// 結果を表す型に全て`type`プロパティを定義してその直で型推論が可能となるように構成する
export interface ResultSucceeded<T> {
  type: 'ok';
  data: T;
}
export interface ResultSucceededWithNoContent<T = {}> {
  type: 'no_content';
}
export interface ResultFailedWithClientError {
  type: 'client_error';
  statusCode: number;
  clientErrorInfo: ClientErrorInfo;
  sourceError: Error;
}
export interface ResultFailedWithError {
  type: 'error';
  sourceError: Error;
}

export type ResultFailed = ResultFailedWithClientError | ResultFailedWithError;
export type DefaultResult<T> = ResultSucceeded<T> | ResultFailed;
export type ResultWithNoContent = ResultSucceededWithNoContent | ResultFailed;
