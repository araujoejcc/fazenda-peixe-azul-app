// src/app/features/ciclos-producao/ciclo-detail/ciclo-detail.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CicloProducao } from '../../../core/models/ciclo-producao.model';
import { CicloProducaoService } from '../../../core/services/ciclo-producao.service';

@Component({
  selector: 'app-ciclo-detail',
  templateUrl: './ciclo-detail.component.html',
  styleUrls: ['./ciclo-detail.component.scss']
})
export class CicloDetailComponent implements OnInit {
  cicloId!: number;
  ciclo?: CicloProducao;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cicloService: CicloProducaoService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.params['id'];
    if (idParam) {
      this.cicloId = +idParam;
      this.carregarCiclo();
    }
  }

  carregarCiclo(): void {
    this.loading = true;
    this.cicloService.getCicloById(this.cicloId)
      .subscribe({
        next: (ciclo) => {
          this.ciclo = ciclo;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Erro ao carregar ciclo: ' + (err.message || 'Erro desconhecido');
          this.loading = false;
        }
      });
  }

  editarCiclo(): void {
    this.router.navigate(['/ciclos-producao/editar', this.cicloId]);
  }

  voltarParaLista(): void {
    this.router.navigate(['/ciclos-producao']);
  }

  calcularFCA(): number {
    if (this.ciclo && this.ciclo.quantidadePescado > 0) {
      return this.ciclo.racaoGasta / this.ciclo.quantidadePescado;
    }
    return 0;
  }

  encerrarCiclo(): void {
    if (!this.ciclo) return;
    
    const hoje = new Date().toISOString().split('T')[0];
    if (this.ciclo.dataFim) {
      alert('Este ciclo já está encerrado.');
      return;
    }
    
    if (confirm('Deseja encerrar este ciclo hoje?')) {
      const cicloAtualizado = { ...this.ciclo, dataFim: hoje };
      this.cicloService.updateCiclo(this.cicloId, cicloAtualizado)
        .subscribe({
          next: () => {
            this.carregarCiclo();
          },
          error: (err) => {
            this.error = 'Erro ao encerrar ciclo: ' + (err.message || 'Erro desconhecido');
          }
        });
    }
  }
}