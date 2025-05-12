// src/app/features/ciclos-producao/ciclo-form/ciclo-form.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CicloProducao } from '../../../core/models/ciclo-producao.model';
import { Tanque } from '../../../core/models/tanque.model';
import { CicloProducaoService } from '../../../core/services/ciclo-producao.service';
import { TanqueService } from '../../../core/services/tanque.service';

@Component({
  selector: 'app-ciclo-form',
  templateUrl: './ciclo-form.component.html',
  styleUrls: ['./ciclo-form.component.scss']
})
export class CicloFormComponent implements OnInit {
  cicloForm!: FormGroup;
  tanques: Tanque[] = [];
  cicloId?: number;
  isEditMode = false;
  loading = false;
  submitting = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private cicloService: CicloProducaoService,
    private tanqueService: TanqueService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadTanques();
    
    // Verifica se estamos em modo de edição
    const idParam = this.route.snapshot.params['id'];
    if (idParam) {
      this.cicloId = +idParam;
      this.isEditMode = true;
      this.carregarCiclo(this.cicloId);
    }
    
    // Verifica se tem um tanqueId na query string
    const tanqueId = this.route.snapshot.queryParams['tanqueId'];
    if (tanqueId && !this.isEditMode) {
      this.cicloForm.patchValue({ tanqueId: +tanqueId });
    }
  }

  initForm(): void {
    this.cicloForm = this.formBuilder.group({
      tanqueId: ['', Validators.required],
      dataInicio: ['', Validators.required],
      dataFim: [''],
      quantidadePescado: [0, [Validators.required, Validators.min(0)]],
      racaoGasta: [0, [Validators.required, Validators.min(0)]]
    });
  }

  loadTanques(): void {
    this.loading = true;
    this.tanqueService.getTanques()
      .subscribe({
        next: (tanques) => {
          this.tanques = tanques;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Erro ao carregar tanques: ' + (err.message || 'Erro desconhecido');
          this.loading = false;
        }
      });
  }

  carregarCiclo(id: number): void {
    this.loading = true;
    forkJoin({
      ciclo: this.cicloService.getCicloById(id),
      tanques: this.tanqueService.getTanques().pipe(catchError(() => of([])))
    }).subscribe({
      next: (result) => {
        const ciclo = result.ciclo;
        this.tanques = result.tanques;
        
        this.cicloForm.patchValue({
          tanqueId: ciclo.tanque.id,
          dataInicio: ciclo.dataInicio,
          dataFim: ciclo.dataFim || '',
          quantidadePescado: ciclo.quantidadePescado,
          racaoGasta: ciclo.racaoGasta
        });
        
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar dados do ciclo: ' + (err.message || 'Erro desconhecido');
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.cicloForm.invalid) {
      // Marca todos os campos como tocados para exibir validações
      Object.keys(this.cicloForm.controls).forEach(key => {
        this.cicloForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.submitting = true;
    const formData = this.cicloForm.value;
    
    // Encontra o tanque selecionado
    const tanqueSelecionado = this.tanques.find(t => t.id === +formData.tanqueId);
    if (!tanqueSelecionado) {
      this.error = 'Tanque não encontrado.';
      this.submitting = false;
      return;
    }
    
    // Prepara o objeto ciclo
    const ciclo: CicloProducao = {
      tanque: tanqueSelecionado,
      dataInicio: formData.dataInicio,
      dataFim: formData.dataFim || undefined,
      quantidadePescado: formData.quantidadePescado,
      racaoGasta: formData.racaoGasta
    };
    
    if (this.isEditMode && this.cicloId) {
      ciclo.id = this.cicloId;
      this.cicloService.updateCiclo(this.cicloId, ciclo)
        .subscribe({
          next: () => {
            this.router.navigate(['/ciclos-producao']);
          },
          error: (err) => {
            this.error = 'Erro ao atualizar ciclo: ' + (err.message || 'Erro desconhecido');
            this.submitting = false;
          }
        });
    } else {
      this.cicloService.createCiclo(ciclo)
        .subscribe({
          next: () => {
            this.router.navigate(['/ciclos-producao']);
          },
          error: (err) => {
            this.error = 'Erro ao criar ciclo: ' + (err.message || 'Erro desconhecido');
            this.submitting = false;
          }
        });
    }
  }

  cancelar(): void {
    this.router.navigate(['/ciclos-producao']);
  }
}