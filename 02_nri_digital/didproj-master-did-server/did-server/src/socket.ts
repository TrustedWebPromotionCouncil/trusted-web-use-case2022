import { Log } from 'did-sdk';
import http from 'http';
import { Server } from 'socket.io';

class SocketManager {
  private io?: Server;

  private socketidMap: Map<string, string>;

  private tokenidMap: Map<string, string>;

  constructor() {
    this.socketidMap = new Map();
    this.tokenidMap = new Map();
  }

  init(io: Server) {
    this.io = io;
  }

  set(socketId: string, tokenId: string) {
    this.socketidMap.set(socketId, tokenId);
    this.tokenidMap.set(tokenId, socketId);
  }

  delete(socketId: string) {
    const tokenId = this.socketidMap.get(socketId);
    if (tokenId) {
      this.tokenidMap.delete(tokenId);
      this.socketidMap.delete(socketId);
    }
  }

  send(tokenId: string, event: string, param?: Record<string, unknown>) {
    const socketId = this.tokenidMap.get(tokenId);
    if (this.io && socketId) {
      this.io.to(socketId).emit(event, param);
    }
  }
}

export const socketMgr = new SocketManager();

export const setSocket = (server: http.Server) => {
  const io = new Server(server);
  socketMgr.init(io);

  io.on('connection', (socket) => {
    Log.log('socket connect:', socket.id, socket.handshake.query.tokenId);
    socketMgr.set(socket.id, socket.handshake.query.tokenId as string);

    socket.on('disconnect', (reason) => {
      Log.log('socket disconnect:', reason, socket.id);
      socketMgr.delete(socket.id);
    });
  });
};
