import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Tanque } from '../../../core/models/tanque.model';
import { CicloProducao } from '../../../core/models/ciclo-producao.model';
import { RegistroQualidadeAgua } from '../../../core/models/registro-qualidade-agua.model';
import { TanqueService } from '../../../core/services/tanque.service';
import { CicloProducaoService } from '../../../core/services/ciclo-producao.service';
import { QualidadeAguaService } from '../../../core/services/qualidade-agua.service';

@Component({
  selector: 'app-tanque-detail',
  templateUrl: './tanque-detail.component.html',
  styleUrls: ['./tanque-detail.component.scss']
})
export class TanqueDetailComponent implements OnInit {
  tanqueId!: number;
  tanque?: Tanque;
  ciclos: CicloProducao[] = [];
  registrosQualidade: RegistroQualidadeAgua[] = [];
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tanqueService: TanqueService,
    private cicloService: CicloProducaoService,
    private qualidadeAguaService: QualidadeAguaService
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(
      tap(params => {
        this.tanqueId = +params['id'];
        this.carregarDados();
      })
    ).subscribe();
  }

  carregarDados(): void {
    this.loading = true;
    this.error = '';

    this.tanqueService.getTanqueById(this.tanqueId).pipe(
      tap(tanque => {
        this.tanque = tanque;
      }),
      switchMap(tanque => {
        // Aqui estamos simulando a busca dos ciclos e registros para o tanque específico
        // Em uma implementação real, você usaria endpoints específicos para isso
        return forkJoin({
          ciclos: this.buscarCiclosPorTanque(tanque.id ?? 0),
          registros: this.buscarRegistrosPorTanque(tanque.id ?? 0)
        });
      }),
      catchError(err => {
        this.error = 'Erro ao carregar informações: ' + (err.message || 'Erro desconhecido');
        this.loading = false;
        return of({ ciclos: [], registros: [] });
      })
    ).subscribe({
      next: result => {
        this.ciclos = result.ciclos;
        this.registrosQualidade = result.registros;
        this.loading = false;
      },
      error: err => {
        this.error = 'Erro ao carregar informações: ' + (err.message || 'Erro desconhecido');
        this.loading = false;
      }
    });
  }

  // Estes métodos simulam chamadas para endpoints específicos
  // Em uma implementação real, você teria estes endpoints no backend
  private buscarCiclosPorTanque(tanqueId: number) {
    return this.cicloService.getCiclos().pipe(
      map(ciclos => ciclos.filter(c => c.tanque.id === tanqueId))
    );
  }

  private buscarRegistrosPorTanque(tanqueId: number) {
    return this.qualidadeAguaService.getRegistros().pipe(
      map(registros => registros.filter(r => r.tanque.id === tanqueId))
    );
  }

  editarTanque(): void {
    this.router.navigate(['/tanques/editar', this.tanqueId]);
  }

  voltarParaLista(): void {
    this.router.navigate(['/tanques']);
  }

  novoCiclo(): void {
    // Navega para o formulário de novo ciclo com o tanque pré-selecionado
    this.router.navigate(['/ciclos-producao/novo'], { queryParams: { tanqueId: this.tanqueId } });
  }

  novoRegistroQualidade(): void {
    // Navega para o formulário de novo registro com o tanque pré-selecionado
    this.router.navigate(['/qualidade-agua/novo'], { queryParams: { tanqueId: this.tanqueId } });
  }

  visualizarRegistroQualidade(id: number): void {
    this.router.navigate(['/qualidade-agua', id]);
  }

  editarRegistroQualidade(id: number): void {
    this.router.navigate(['/qualidade-agua/editar', id]);
  }
}