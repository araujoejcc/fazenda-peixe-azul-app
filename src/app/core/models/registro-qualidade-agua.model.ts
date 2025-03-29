import { Tanque } from "./tanque.model";

export interface RegistroQualidadeAgua {
    id?: number;
    tanque: Tanque;
    amonia: number;
    nitrito: number;
    salinidade: number;
    turbidez: number;
    temperatura: number;
    ph: number;
    oxigenacao: number;
    data: string; // formato ISO 'YYYY-MM-DD'
  }