import { Tanque } from "./tanque.model";

export interface Venda {
    id?: number;
    tanque: Tanque;
    quantidadePescado: number;
    valorTotal: number;
    data: string; // formato ISO 'YYYY-MM-DD'
  }