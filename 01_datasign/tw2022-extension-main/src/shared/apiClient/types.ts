/* tslint:disable */
/* eslint-disable */

export class RequestError extends Error {
  public readonly response: Response;
  public readonly body: any;

  constructor(response: Response, body: any) {
    super(body?.message ?? '');
    this.name = body?.name ?? '';
    this.response = response;
    this.body = body;
  }
}
