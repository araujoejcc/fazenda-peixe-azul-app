import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Tanque } from '../../../core/models/tanque.model';
import { TanqueService } from '../../../core/services/tanque.service';

@Component({
  selector: 'app-tanque-form',
  templateUrl: './tanque-form.component.html',
  styleUrls: ['./tanque-form.component.scss']
})
export class TanqueFormComponent implements OnInit {
  tanqueForm!: FormGroup;
  isEditMode = false;
  tanqueId?: number;
  loading = false;
  submitting = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private tanqueService: TanqueService
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    // Verifica se estamos em modo de edição
    const idParam = this.route.snapshot.params['id'];
    if (idParam) {
      this.tanqueId = +idParam;
      this.isEditMode = true;
      this.carregarTanque(this.tanqueId);
    }
  }

  initForm(): void {
    this.tanqueForm = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.maxLength(255)]],
      capacidade: ['', [Validators.required, Validators.min(0)]],
      localizacao: ['', [Validators.required, Validators.maxLength(255)]],
      especieCultura: ['', [Validators.required, Validators.maxLength(255)]]
    });
  }

  carregarTanque(id: number): void {
    this.loading = true;
    this.tanqueService.getTanqueById(id)
      .subscribe({
        next: (tanque) => {
          this.tanqueForm.patchValue(tanque);
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Erro ao carregar dados do tanque: ' + (err.message || 'Erro desconhecido');
          this.loading = false;
        }
      });
  }

  onSubmit(): void {
    if (this.tanqueForm.invalid) {
      // Marca todos os campos como tocados para exibir validações
      Object.keys(this.tanqueForm.controls).forEach(key => {
        this.tanqueForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.submitting = true;
    const tanque: Tanque = this.tanqueForm.value;

    if (this.isEditMode && this.tanqueId) {
      this.tanqueService.updateTanque(this.tanqueId, tanque)
        .subscribe({
          next: () => {
            this.router.navigate(['/tanques']);
          },
          error: (err) => {
            this.error = 'Erro ao atualizar tanque: ' + (err.message || 'Erro desconhecido');
            this.submitting = false;
          }
        });
    } else {
      this.tanqueService.createTanque(tanque)
        .subscribe({
          next: () => {
            this.router.navigate(['/tanques']);
          },
          error: (err) => {
            this.error = 'Erro ao criar tanque: ' + (err.message || 'Erro desconhecido');
            this.submitting = false;
          }
        });
    }
  }

  cancelar(): void {
    this.router.navigate(['/tanques']);
  }
}