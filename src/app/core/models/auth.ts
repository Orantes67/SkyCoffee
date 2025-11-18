import { Usuario } from "./ usuario.model";

export interface LoginRequest {
  correo: string;
  password: string;
}

export interface AuthResponse {
  user: Usuario;
  token?: string;
  message?: string;
}


export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}