import express from 'express';

import { createEjsOpt } from '../common';
import { createWellKnownDidConfiguration } from './functions';

export const pageTop = async (_req: express.Request, res: express.Response) => {
  res.render('top', createEjsOpt());
};

export const getWellKnownDidConfiguration = async (_req: express.Request, res: express.Response) =>
  res.json(await createWellKnownDidConfiguration());

export default pageTop;
