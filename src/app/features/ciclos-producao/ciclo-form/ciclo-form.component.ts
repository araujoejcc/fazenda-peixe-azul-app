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
  isEditMode = false;
  cicloId?: number;
  loading = false;
  loadingTanques = false;
  submitting = false;
  error = '';
  dataMaxima = new Date().toISOString().split('T')[0]; // Data atual no formato ISO

  constructor(
    private formBuilder: FormBuilder,
    private cicloService: CicloProducaoService,
    private tanqueService: TanqueService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.carregarDados();
    
    // Verifica se estamos em modo de edição
    const idParam = this.route.snapshot.params['id'];
    if (idParam) {
      this.cicloId = +idParam;
      this.isEditMode = true;
    }
    
    // Verifica se há um tanqueId na query string (para pré-selecionar o tanque)
    const tanqueId = this.route.snapshot.queryParams['tanqueId'];
    if (tanqueId) {
      this.cicloForm.get('tanqueId')?.setValue(+tanqueId);
    }
  }

  initForm(): void {
    this.cicloForm = this.formBuilder.group({
      tanqueId: ['', [Validators.required]],
      dataInicio: ['', [Validators.required]],
      dataFim: [''],
      quantidadePescado: [0, [Validators.min(0)]],
      racaoGasta: [0, [Validators.min(0)]]
    });
  }

  carregarDados(): void {
    this.loading = true;
    this.loadingTanques = true;
    
    forkJoin({
      tanques: this.tanqueService.getTanques().pipe(catchError(() => of([]))),
      ciclo: this.isEditMode && this.cicloId 
        ? this.cicloService.getCicloById(this.cicloId).pipe(catchError(() => of(null))) 
        : of(null)
    }).subscribe({
      next: (result) => {
        this.tanques = result.tanques;
        this.loadingTanques = false;
        
        if (result.ciclo && this.isEditMode) {
          // Preenche o formulário com os dados do ciclo
          this.cicloForm.patchValue({
            tanqueId: result.ciclo.tanque.id,
            dataInicio: result.ciclo.dataInicio,
            dataFim: result.ciclo.dataFim || '',
            quantidadePescado: result.ciclo.quantidadePescado,
            racaoGasta: result.ciclo.racaoGasta
          });
        }
        
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar dados: ' + (err.message || 'Erro desconhecido');
        this.loading = false;
        this.loadingTanques = false;
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
    
    // Encontra o objeto tanque completo pelo ID
    const tanque = this.tanques.find(t => t.id === +formData.tanqueId);
    
    if (!tanque) {
      this.error = 'Tanque não encontrado';
      this.submitting = false;
      return;
    }
    
    // Prepara objeto ciclo
    const ciclo: CicloProducao = {
      tanque: tanque,
      dataInicio: formData.dataInicio,
      dataFim: formData.dataFim || undefined,
      quantidadePescado: formData.quantidadePescado,
      racaoGasta: formData.racaoGasta
    };

    if (this.isEditMode && this.cicloId) {
      // Modo edição
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
      // Modo criação
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