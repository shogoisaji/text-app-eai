// src/lib/api.ts
import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:8787",
  baseURL: "https://text-app-eai.simacsimac9.workers.dev",
  // baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// リクエストインターセプター
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("auth-token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// レスポンスインターセプター
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("auth-token");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>("/auth/login", credentials);
    return data;
  },

  logout: async () => {
    localStorage.removeItem("auth-token");
    return api.post("/auth/logout");
  },

  getUser: async (): Promise<User> => {
    const { data } = await api.get<User>("/auth/user");
    return data;
  },
};

export default api;
