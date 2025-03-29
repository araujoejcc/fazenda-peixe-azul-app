import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
    this.tanqueId = this.route.snapshot.params['id'];
    this.carregarDados();
  }

  carregarDados(): void {
    this.loading = true;
    this.error = '';

    // Exemplo de como poderia ser feito com mais requisições paralelas
    // Na prática, você precisaria criar endpoints específicos no backend para isso
    forkJoin({
      tanque: this.tanqueService.getTanqueById(this.tanqueId),
      ciclos: of([]), // Aqui deveria ser uma chamada para buscar ciclos por tanque
      registros: of([]) // Aqui deveria ser uma chamada para buscar registros por tanque
    }).pipe(
      catchError(err => {
        this.error = 'Erro ao carregar informações: ' + (err.message || 'Erro desconhecido');
        this.loading = false;
        return of({ tanque: null, ciclos: [], registros: [] });
      })
    ).subscribe(result => {
      if (result.tanque) {
        this.tanque = result.tanque;
        this.ciclos = result.ciclos;
        this.registrosQualidade = result.registros;
      }
      this.loading = false;
    });
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
}