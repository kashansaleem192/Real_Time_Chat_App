import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (userId) => {
  if (socket) return socket;

  const SOCKET_URL = import.meta.env.DEV
    ? "http://localhost:5000"
    : "/";

  socket = io(SOCKET_URL, {
    query: { userId },
    transports: ["websocket"],
    withCredentials: true,
  });

  socket.on("connect", () => {
    console.log("🟢 Socket CONNECTED:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.log("🔴 Socket ERROR:", err.message);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
