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
    private cicloService: CicloProducaoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.cicloId = +params['id'];
      this.carregarCiclo();
    });
  }

  carregarCiclo(): void {
    this.loading = true;
    this.error = '';
    
    this.cicloService.getCicloById(this.cicloId)
      .subscribe({
        next: (data) => {
          this.ciclo = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Erro ao carregar ciclo: ' + (err.message || 'Erro desconhecido');
          this.loading = false;
        }
      });
  }

  calcularFCA(): number {
    if (!this.ciclo || this.ciclo.quantidadePescado <= 0) return 0;
    return this.ciclo.racaoGasta / this.ciclo.quantidadePescado;
  }

  calcularDuracao(): number {
    if (!this.ciclo) return 0;
    
    const dataInicio = new Date(this.ciclo.dataInicio);
    const dataFim = this.ciclo.dataFim ? new Date(this.ciclo.dataFim) : new Date();
    
    // Calcula a diferença em milissegundos e converte para dias
    const diffTime = Math.abs(dataFim.getTime() - dataInicio.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  editarCiclo(): void {
    this.router.navigate(['/ciclos-producao/editar', this.cicloId]);
  }

  voltarParaLista(): void {
    this.router.navigate(['/ciclos-producao']);
  }

  finalizarCiclo(): void {
    if (!this.ciclo) return;
    
    // Cria uma cópia do ciclo para atualização
    const cicloAtualizado: CicloProducao = {
      ...this.ciclo,
      dataFim: new Date().toISOString().split('T')[0] // Data atual no formato ISO
    };
    
    this.cicloService.updateCiclo(this.cicloId, cicloAtualizado)
      .subscribe({
        next: (data) => {
          this.ciclo = data;
        },
        error: (err) => {
          this.error = 'Erro ao finalizar ciclo: ' + (err.message || 'Erro desconhecido');
        }
      });
  }
}