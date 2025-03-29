export interface Perfil {
    id?: number;
    nome: string;
  }

  export interface Usuario {
    id?: number;
    nome: string;
    email: string;
    senha: string;
    perfis: Perfil[];
  }