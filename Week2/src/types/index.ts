export type UserRole = "user" | "admin";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  userId: number;
  createdAt?: string;
}