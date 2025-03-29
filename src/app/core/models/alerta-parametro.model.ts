export interface AlertaParametro {
    id?: number;
    parametro: string;
    valorMinimo: number;
    valorMaximo: number;
    nivelCriticidade: number;
    mensagem: string;
  }