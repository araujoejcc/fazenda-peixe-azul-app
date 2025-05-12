import { Component, OnInit, Input } from '@angular/core';
import { RegistroQualidadeAgua } from '../../../core/models/registro-qualidade-agua.model';
import { QualidadeAguaService } from '../../../core/services/qualidade-agua.service';

@Component({
  selector: 'app-qualidade-agua-chart',
  templateUrl: './qualidade-agua-chart.component.html',
  styleUrls: ['./qualidade-agua-chart.component.scss']
})
export class QualidadeAguaChartComponent implements OnInit {
  @Input() tanqueId?: number;
  @Input() diasHistorico: number = 7;
  
  registros: RegistroQualidadeAgua[] = [];
  chartData: any[] = [];
  loading = false;
  error = '';
  
  // Parâmetro selecionado para visualização
  parametroSelecionado: 'ph' | 'oxigenacao' | 'temperatura' | 'amonia' | 'nitrito' = 'ph';
  
  // Cores para os gráficos
  cores = {
    ph: '#3f51b5',
    oxigenacao: '#4caf50',
    temperatura: '#ff9800',
    amonia: '#f44336',
    nitrito: '#9c27b0'
  };

  constructor(private qualidadeAguaService: QualidadeAguaService) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.loading = true;
    this.error = '';

    this.qualidadeAguaService.getRegistros()
      .subscribe({
        next: (data) => {
          // Filtra registros se houver um tanque especificado
          if (this.tanqueId) {
            this.registros = data.filter(r => r.tanque.id === this.tanqueId);
          } else {
            this.registros = data;
          }
          
          // Filtra pelos últimos X dias
          const dataLimite = new Date();
          dataLimite.setDate(dataLimite.getDate() - this.diasHistorico);
          
          this.registros = this.registros.filter(r => 
            new Date(r.data) >= dataLimite
          ).sort((a, b) => 
            new Date(a.data).getTime() - new Date(b.data).getTime()
          );
          
          this.prepararDadosGrafico();
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Erro ao carregar dados: ' + (err.message || 'Erro desconhecido');
          this.loading = false;
        }
      });
  }

  prepararDadosGrafico(): void {
    // Agrupamento dos dados por data
    const dataMap = new Map<string, Map<string, any>>();
    
    // Inicializa o mapa para cada tanque e data
    this.registros.forEach(registro => {
      const dataFormatada = new Date(registro.data).toLocaleDateString();
      const tanqueNome = registro.tanque.nome;
      
      if (!dataMap.has(dataFormatada)) {
        dataMap.set(dataFormatada, new Map<string, any>());
      }
      
      const tanquesMap = dataMap.get(dataFormatada)!;
      tanquesMap.set(tanqueNome, registro);
    });
    
    // Converte para o formato do gráfico
    this.chartData = Array.from(dataMap.entries()).map(([data, tanques]) => {
      const item: any = { data };
      
      Array.from(tanques.entries()).forEach(([tanqueNome, registro]) => {
        item[`${tanqueNome}_${this.parametroSelecionado}`] = registro[this.parametroSelecionado];
        item[`${tanqueNome}_id`] = registro.tanque.id;
      });
      
      return item;
    });
  }

  mudarParametro(parametro: 'ph' | 'oxigenacao' | 'temperatura' | 'amonia' | 'nitrito'): void {
    this.parametroSelecionado = parametro;
    this.prepararDadosGrafico();
  }
  
  // Obtém tanques únicos dos registros
  get tanquesUnicos(): { id: number, nome: string }[] {
    const tanques = new Map<number, string>();
    
    this.registros.forEach(registro => {
      tanques.set(registro.tanque.id!, registro.tanque.nome);
    });
    
    return Array.from(tanques.entries()).map(([id, nome]) => ({ id, nome }));
  }
  
  // Determina a cor para cada tanque
  getCor(index: number): string {
    const cores = ['#3f51b5', '#4caf50', '#ff9800', '#f44336', '#9c27b0', '#00bcd4', '#607d8b'];
    return cores[index % cores.length];
  }
  
  // Obtém o nome completo do parâmetro
  getParametroNome(parametro: string): string {
    switch (parametro) {
      case 'ph': return 'pH';
      case 'oxigenacao': return 'Oxigenação (mg/L)';
      case 'temperatura': return 'Temperatura (°C)';
      case 'amonia': return 'Amônia (mg/L)';
      case 'nitrito': return 'Nitrito (mg/L)';
      default: return parametro;
    }
  }
}