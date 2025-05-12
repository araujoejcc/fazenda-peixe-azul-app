export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  tipo: string;
  usuario: {
    id: number;
    nome: string;
    email: string;
    perfis: string[];
  };
}