import { CicloProducao } from "./ciclo-producao.model";

export interface Alimentacao {
    id?: number;
    cicloProducao: CicloProducao;
    data: string; // formato ISO 'YYYY-MM-DD'
    horario: string; // formato 'HH:MM:SS'
    tipoRacao: string;
    quantidade: number;
    observacao?: string;
  }