// src/app/features/qualidade-agua/qualidade-agua-list/qualidade-agua-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegistroQualidadeAgua } from '../../../core/models/registro-qualidade-agua.model';
import { QualidadeAguaService } from '../../../core/services/qualidade-agua.service';

@Component({
  selector: 'app-qualidade-agua-list',
  templateUrl: './qualidade-agua-list.component.html',
  styleUrls: ['./qualidade-agua-list.component.scss']
})
export class QualidadeAguaListComponent implements OnInit {
  registros: RegistroQualidadeAgua[] = [];
  loading = false;
  error = '';

  constructor(
    private qualidadeAguaService: QualidadeAguaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarRegistros();
  }

  carregarRegistros(): void {
    this.loading = true;
    this.error = '';
    
    this.qualidadeAguaService.getRegistros()
      .subscribe({
        next: (data) => {
          this.registros = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Erro ao carregar registros: ' + (err.message || 'Erro desconhecido');
          this.loading = false;
        }
      });
  }

  criarRegistro(): void {
    this.router.navigate(['/qualidade-agua/novo']);
  }

  visualizarRegistro(id: number): void {
    this.router.navigate(['/qualidade-agua', id]);
  }

  editarRegistro(id: number): void {
    this.router.navigate(['/qualidade-agua/editar', id]);
  }

  deletarRegistro(id: number): void {
    if (confirm('Tem certeza que deseja excluir este registro?')) {
      this.qualidadeAguaService.deleteRegistro(id)
        .subscribe({
          next: () => {
            this.carregarRegistros();
          },
          error: (err) => {
            this.error = 'Erro ao excluir registro: ' + (err.message || 'Erro desconhecido');
          }
        });
    }
  }
}