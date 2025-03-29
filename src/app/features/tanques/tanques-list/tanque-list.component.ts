import { Component, OnInit } from '@angular/core';
import { Tanque } from '../../../core/models/tanque.model';
import { TanqueService } from '../../../core/services/tanque.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tanque-list',
  templateUrl: './tanque-list.component.html',
  styleUrls: ['./tanque-list.component.scss']
})
export class TanqueListComponent implements OnInit {
  tanques: Tanque[] = [];
  loading = false;
  error = '';

  constructor(
    private tanqueService: TanqueService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarTanques();
  }

  carregarTanques(): void {
    this.loading = true;
    this.error = '';
    
    this.tanqueService.getTanques()
      .subscribe({
        next: (data) => {
          this.tanques = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Erro ao carregar tanques: ' + (err.message || 'Erro desconhecido');
          this.loading = false;
        }
      });
  }

  criarTanque(): void {
    this.router.navigate(['/tanques/novo']);
  }

  editarTanque(id: number): void {
    this.router.navigate(['/tanques/editar', id]);
  }

  visualizarTanque(id: number): void {
    this.router.navigate(['/tanques', id]);
  }

  deletarTanque(id: number): void {
    if (confirm('Tem certeza que deseja excluir este tanque?')) {
      this.tanqueService.deleteTanque(id)
        .subscribe({
          next: () => {
            this.carregarTanques();
          },
          error: (err) => {
            this.error = 'Erro ao excluir tanque: ' + (err.message || 'Erro desconhecido');
          }
        });
    }
  }
}