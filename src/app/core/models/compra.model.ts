export enum TipoCompra {
    RACAO = 'RACAO',
    EQUIPAMENTO = 'EQUIPAMENTO',
    ENERGIA = 'ENERGIA',
    PESSOAL = 'PESSOAL',
    OUTROS = 'OUTROS'
  }

  export interface Compra {
    id?: number;
    descricao: string;
    valor: number;
    data: string; // formato ISO 'YYYY-MM-DD'
    tipo: TipoCompra;
  }