// lib/socket.js
import { io } from "socket.io-client";

let socket = null;

export async function getSocket() {
  if (socket) return socket;

  try {
    const res = await fetch("/api/auth/token"); // Must return raw JWT
    const { token } = await res.json();

    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      autoConnect: false,
      transports: ["websocket"],
      auth: { token }, 
    });

    return socket;
  } catch (err) {
    console.error("Failed to create socket:", err);
    throw err;
  }
}
