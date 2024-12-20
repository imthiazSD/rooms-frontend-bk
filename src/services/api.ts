import axios from "axios";
import { API_URL } from "../config";
import { useNavigate } from "react-router-dom";

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (
      !config.url?.includes("/auth/login") &&
      !config.url?.includes("/auth/signup")
    ) {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      const navigate = useNavigate();
      navigate("/login");
    }
    return Promise.reject(error);
  }
);

export const signup = async (username: string, password: string) => {
  const response = await api.post("/auth/signup", {
    username,
    password,
  });
  return response.data;
};

export const login = async (username: string, password: string) => {
  const response = await api.post("/auth/login", { username, password });
  return response.data;
};

export const createRoom = async (name: string) => {
  const response = await api.post("/rooms/create", { name });
  return response.data;
};

export const fetchRooms = async () => {
  const response = await api.get("/rooms");
  return response.data;
};

export const getUsersInRoom = async (roomId: string) => {
  const response = await api.get(`/user-rooms/${roomId}/users`);
  return response.data;
};

export const joinRoom = async (roomId: string) => {
  try {
    const response = await api.post(`/user-rooms/join`, { roomId });
    if (response.status === 400) {
      // Handle case where status 400 is return when user rejoins already joined room
      return response.data;
    }
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      return error.response.data;
    }
    throw error;
  }
};

export const leaveRoom = async (roomId: string) => {
  const response = await api.post(`/user-rooms/leave`, { roomId });
  return response.data;
};

export const setFocusMode = async (roomId: string, focusMode: boolean) => {
  const response = await api.put(`/user-rooms/${roomId}/focus-mode`, {
    roomId,
    focusMode,
  });
  return response.data;
};

export const getFocusMode = async (roomId: string) => {
  const response = await api.get(`/user-rooms/${roomId}/focus-mode`);
  return response.data;
};

export const getRoomById = async (roomId: string) => {
  const response = await api.get(`/rooms/${roomId}`);
  return response.data;
};

export const sendPing = async (recipientId: string, roomId: string) => {
  const response = await api.post("/ping/send", {
    recipientId,
    roomId,
  });
  return response.data;
};

const _api = {
  signup,
  login,
  createRoom,
  fetchRooms,
  getUsersInRoom,
  joinRoom,
  leaveRoom,
  getRoomById,
  setFocusMode,
  getFocusMode,
  sendPing,
};

export default _api;
