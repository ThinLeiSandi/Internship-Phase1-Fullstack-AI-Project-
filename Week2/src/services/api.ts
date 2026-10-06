import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export async function getBackendHealth() {
  const response = await api.get<{ status: string }>("/health");
  return response.data;
}

export async function getRagHealth() {
  const response = await axios.get<{ status: string }>(
    "http://127.0.0.1:8000/health",
  );

  return response.data;
}

export async function askQuestion(question: string) {
  const response = await api.post<{ answer: string }>("/chat", {
    question,
  });

  return response.data.answer;
}

export default api;