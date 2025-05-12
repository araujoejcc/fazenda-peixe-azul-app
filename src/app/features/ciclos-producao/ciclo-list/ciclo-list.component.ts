import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CicloProducao } from '../../../core/models/ciclo-producao.model';
import { CicloProducaoService } from '../../../core/services/ciclo-producao.service';

@Component({
  selector: 'app-ciclo-list',
  templateUrl: './ciclo-list.component.html',
  styleUrls: ['./ciclo-list.component.scss']
})
export class CicloListComponent implements OnInit {
  ciclos: CicloProducao[] = [];
  ciclosAtivos: CicloProducao[] = [];
  ciclosFinalizados: CicloProducao[] = [];
  loading = false;
  error = '';

  constructor(
    private cicloService: CicloProducaoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarCiclos();
  }

  carregarCiclos(): void {
    this.loading = true;
    this.error = '';
    
    this.cicloService.getCiclos()
      .subscribe({
        next: (data) => {
          this.ciclos = data;
          
          // Separar ciclos ativos e finalizados
          this.ciclosAtivos = this.ciclos.filter(ciclo => !ciclo.dataFim);
          this.ciclosFinalizados = this.ciclos.filter(ciclo => ciclo.dataFim);
          
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Erro ao carregar ciclos: ' + (err.message || 'Erro desconhecido');
          this.loading = false;
        }
      });
  }

  criarCiclo(): void {
    this.router.navigate(['/ciclos-producao/novo']);
  }

  editarCiclo(id: number): void {
    this.router.navigate(['/ciclos-producao/editar', id]);
  }

  visualizarCiclo(id: number): void {
    this.router.navigate(['/ciclos-producao', id]);
  }

  deletarCiclo(id: number): void {
    if (confirm('Tem certeza que deseja excluir este ciclo de produção?')) {
      this.cicloService.deleteCiclo(id)
        .subscribe({
          next: () => {
            this.carregarCiclos();
          },
          error: (err) => {
            this.error = 'Erro ao excluir ciclo: ' + (err.message || 'Erro desconhecido');
          }
        });
    }
  }

  calcularFCA(ciclo: CicloProducao): number {
    return ciclo.quantidadePescado > 0 ? ciclo.racaoGasta / ciclo.quantidadePescado : 0;
  }
}