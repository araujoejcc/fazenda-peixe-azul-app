// src/app/features/ciclos-producao/ciclo-list/ciclo-list.component.ts

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
  ciclosEncerrados: CicloProducao[] = [];
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
        next: (ciclos) => {
          this.ciclos = ciclos;
          this.filtrarCiclos();
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Erro ao carregar ciclos: ' + (err.message || 'Erro desconhecido');
          this.loading = false;
        }
      });
  }

  filtrarCiclos(): void {
    this.ciclosAtivos = this.ciclos.filter(ciclo => !ciclo.dataFim);
    this.ciclosEncerrados = this.ciclos.filter(ciclo => ciclo.dataFim);
  }

  novoCiclo(): void {
    this.router.navigate(['/ciclos-producao/novo']);
  }

  visualizarCiclo(id: number): void {
    this.router.navigate(['/ciclos-producao', id]);
  }

  editarCiclo(id: number): void {
    this.router.navigate(['/ciclos-producao/editar', id]);
  }

  excluirCiclo(id: number): void {
    if (confirm('Tem certeza que deseja excluir este ciclo?')) {
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
    if (ciclo.quantidadePescado > 0) {
      return ciclo.racaoGasta / ciclo.quantidadePescado;
    }
    return 0;
  }
}