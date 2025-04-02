import { Component, OnInit } from '@angular/core';
import { TanqueService } from '../../core/services/tanque.service';
import { QualidadeAguaService } from '../../core/services/qualidade-agua.service';
import { CicloProducaoService } from '../../core/services/ciclo-producao.service';
import { Tanque } from '../../core/models/tanque.model';
import { RegistroQualidadeAgua } from '../../core/models/registro-qualidade-agua.model';
import { CicloProducao } from '../../core/models/ciclo-producao.model';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  tanques: Tanque[] = [];
  ultimosRegistros: RegistroQualidadeAgua[] = [];
  ciclosAtivos: CicloProducao[] = [];
  qualidadeAguaChartData: any[] = [];
  loading = false;
  error = '';

  constructor(
    private tanqueService: TanqueService,
    private qualidadeAguaService: QualidadeAguaService,
    private cicloService: CicloProducaoService
  ) { }

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.loading = true;
    this.error = '';

    forkJoin({
      tanques: this.tanqueService.getTanques().pipe(catchError(() => of([]))),
      registros: this.qualidadeAguaService.getRegistros().pipe(catchError(() => of([]))),
      ciclos: this.cicloService.getCiclos().pipe(catchError(() => of([])))
    }).subscribe({
      next: (result) => {
        this.tanques = result.tanques;
        this.ultimosRegistros = result.registros.slice(0, 5); // Últimos 5 registros
        
        // Filtra ciclos ativos (sem data de fim)
        this.ciclosAtivos = result.ciclos.filter(ciclo => !ciclo.dataFim);
        
        // Aqui poderia preparar dados para gráficos se necessário
        this.qualidadeAguaChartData = this.prepararDadosGrafico(result.registros);
        
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar dados do dashboard: ' + (err.message || 'Erro desconhecido');
        this.loading = false;
      }
    });
  }

  private prepararDadosGrafico(registros: RegistroQualidadeAgua[]): any[] {
    // Implementação simplificada - em uma versão mais completa,
    // você processaria os dados para o formato esperado pelo componente de gráfico
    return registros;
  }
}