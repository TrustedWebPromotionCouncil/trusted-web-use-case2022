import cors from 'cors';
import { Log } from 'did-sdk';
import express from 'express';
import http from 'http';

import { errorHandler } from './middlewares/errorHandler';
import { logger } from './middlewares/logger';
import { setViewRoutings } from './router';
import { setSocket } from './socket';

const app = express();
const PORT = 3001;

const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ログ設定
app.use(logger.express);
// SDKのLog出力をloggerを利用するようにセットし、ログ出力にはLogを利用する
Log.set({
  info: (message: unknown, ...args: unknown[]) => logger.app.info(message, ...args),
  warn: (message: unknown, ...args: unknown[]) => logger.app.warn(message, ...args),
  error: (message: unknown, ...args: unknown[]) => logger.app.error(message, ...args),
  debug: (message: unknown, ...args: unknown[]) => logger.app.debug(message, ...args),
});

// 画面のルーティング
setViewRoutings(app);

// エラーハンドリング
app.use(errorHandler);

// socket
setSocket(server);

server.listen(PORT, () => {
  Log.info(`Start on http://localhost:${PORT}`);
});
