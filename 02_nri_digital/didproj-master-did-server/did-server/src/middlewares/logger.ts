import { configure, connectLogger, getLogger } from 'log4js';

configure(`${__dirname}/../../log4js.json`);
const app = getLogger();
const express = connectLogger(getLogger('access'), {});

export const logger = { app, express };
export default logger;
