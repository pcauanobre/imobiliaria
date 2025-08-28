import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  withCredentials: false,
});

// Interceptor simples (log de erro)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API error:", err?.response?.status, err?.message);
    return Promise.reject(err);
  }
);

// endpoints básicos
export const authApi = {
  register: (data: { nome: string; email: string; password: string; role: string }) =>
    api.post("/api/v1/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post("/api/v1/auth/login", data),
};
