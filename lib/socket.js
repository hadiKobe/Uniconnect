// lib/socket.js
import { io } from "socket.io-client";

let socket;

export function getSocket() {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      autoConnect: false,
      transports: ["websocket"], // optional: ensure stable connection
    });
  }
  return socket;
}
