import { Server as HttpServer } from "http";
import { Server as SocketServer, Socket } from "socket.io";
export interface ServerToClientEvents {
  message: (message: string) => void;
  typing: (userId: string) => void;
}
    
export interface ClientToServerEvents {
  sendMessage: (message: string) => void;
  startTyping: (userId: string) => void;
}

export type ChatSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

export type ChatServer = SocketServer<ClientToServerEvents, ServerToClientEvents>;

export type HTTPServer = HttpServer;
