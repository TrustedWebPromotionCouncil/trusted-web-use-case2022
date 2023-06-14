import { Log } from 'did-sdk';
import express from 'express';

/* eslint-disable */
export const errorWrap = (fn: (...args: any) => any) => {
  return (...args: any) => {
    return fn(...args).catch(args[2]);
  };
};

export const errorHandler = (err: any, _1: unknown, res: express.Response, _2: unknown) => {
  Log.error(err);
  res.status(500).send(err.stack);
};
