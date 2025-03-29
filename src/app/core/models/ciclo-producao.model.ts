import { Tanque } from "./tanque.model";

export interface CicloProducao {
    id?: number;
    tanque: Tanque;
    dataInicio: string; // formato ISO 'YYYY-MM-DD'
    dataFim?: string;
    quantidadePescado: number;
    racaoGasta: number;
  }