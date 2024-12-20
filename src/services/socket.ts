import { io } from "socket.io-client";
import { API_URL } from "../config";

const socket = io(API_URL);

export const joinRoom = (userId: string, roomId: string) => {
  socket.emit("join-room", { roomId, userId });
};

export const leaveRoom = (roomId: string) => {
  socket.emit("leave-room", roomId);
};

export const logout = (userId: string) => {
  socket.emit("logout", userId);
};

export const pingUser = (
  senderId: string,
  recipientId: string,
  roomId: string
) => {
  socket.emit("ping", { senderId, recipientId, roomId });
};

export const onUserJoined = (callback: (data: any) => void) => {
  socket.on("user-joined", callback);
};

export const onUserLeft = (callback: (data: any) => void) => {
  socket.on("user-left", callback);
};

export const onPingNotification = (callback: (data: any) => void) => {
  socket.on("ping-notification", callback);
};

export const onReceievePing = (callback: (data: any) => void) => {
  socket.on("receivePing", callback);
};

export default socket;
