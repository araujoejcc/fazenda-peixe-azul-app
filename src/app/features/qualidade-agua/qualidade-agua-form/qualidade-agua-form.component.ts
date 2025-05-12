import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { QualidadeAguaService } from '../../../core/services/qualidade-agua.service';
import { TanqueService } from '../../../core/services/tanque.service';
import { Tanque } from '../../../core/models/tanque.model';
import { RegistroQualidadeAgua } from '../../../core/models/registro-qualidade-agua.model';

@Component({
  selector: 'app-qualidade-agua-form',
  templateUrl: './qualidade-agua-form.component.html',
  styleUrls: ['./qualidade-agua-form.component.scss']
})
export class QualidadeAguaFormComponent implements OnInit {
  registroForm!: FormGroup;
  tanques: Tanque[] = [];
  isEditMode = false;
  registroId?: number;
  loading = false;
  submitting = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private qualidadeAguaService: QualidadeAguaService,
    private tanqueService: TanqueService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.carregarDados();
    
    // Verifica se estamos em modo de edição
    const idParam = this.route.snapshot.params['id'];
    if (idParam) {
      this.registroId = +idParam;
      this.isEditMode = true;
    }
    
    // Verifica se foi especificado um tanque (por exemplo, vindo da página de detalhes do tanque)
    const tanqueId = this.route.snapshot.queryParams['tanqueId'];
    if (tanqueId) {
      this.registroForm.get('tanqueId')?.setValue(+tanqueId);
    }
  }

  initForm(): void {
    this.registroForm = this.formBuilder.group({
      tanqueId: ['', [Validators.required]],
      data: [this.formatDateForInput(new Date()), [Validators.required]],
      ph: ['', [Validators.required, Validators.min(0), Validators.max(14)]],
      oxigenacao: ['', [Validators.required, Validators.min(0)]],
      temperatura: ['', [Validators.required, Validators.min(0)]],
      amonia: ['', [Validators.required, Validators.min(0)]],
      nitrito: ['', [Validators.required, Validators.min(0)]],
      salinidade: ['', [Validators.min(0)]],
      turbidez: ['', [Validators.min(0)]]
    });
  }

  carregarDados(): void {
    this.loading = true;
    
    forkJoin({
      tanques: this.tanqueService.getTanques().pipe(catchError(() => of([]))),
      registro: this.isEditMode && this.registroId ? 
                this.qualidadeAguaService.getRegistroById(this.registroId).pipe(catchError(() => of(null))) : 
                of(null)
    }).subscribe({
      next: (result) => {
        this.tanques = result.tanques;
        
        if (result.registro) {
          this.patchFormWithRegistro(result.registro);
        }
        
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar dados: ' + (err.message || 'Erro desconhecido');
        this.loading = false;
      }
    });
  }

  patchFormWithRegistro(registro: RegistroQualidadeAgua): void {
    this.registroForm.patchValue({
      tanqueId: registro.tanque.id,
      data: this.formatDateForInput(new Date(registro.data)),
      ph: registro.ph,
      oxigenacao: registro.oxigenacao,
      temperatura: registro.temperatura,
      amonia: registro.amonia,
      nitrito: registro.nitrito,
      salinidade: registro.salinidade,
      turbidez: registro.turbidez
    });
  }

  onSubmit(): void {
    if (this.registroForm.invalid) {
      // Marca todos os campos como tocados para exibir validações
      Object.keys(this.registroForm.controls).forEach(key => {
        this.registroForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.submitting = true;
    const formValues = this.registroForm.value;
    
    // Encontra o tanque pelo ID
    const tanque = this.tanques.find(t => t.id === +formValues.tanqueId);
    
    if (!tanque) {
      this.error = 'Tanque não encontrado. Por favor, selecione um tanque válido.';
      this.submitting = false;
      return;
    }
    
    // Prepara o objeto de registro
    const registro: RegistroQualidadeAgua = {
      tanque: tanque,
      data: formValues.data,
      ph: +formValues.ph,
      oxigenacao: +formValues.oxigenacao,
      temperatura: +formValues.temperatura,
      amonia: +formValues.amonia,
      nitrito: +formValues.nitrito,
      salinidade: +formValues.salinidade || 0,
      turbidez: +formValues.turbidez || 0
    };
    
    if (this.isEditMode && this.registroId) {
      registro.id = this.registroId;
      this.qualidadeAguaService.updateRegistro(this.registroId, registro)
        .subscribe({
          next: () => {
            this.router.navigate(['/qualidade-agua']);
          },
          error: (err) => {
            this.error = 'Erro ao atualizar registro: ' + (err.message || 'Erro desconhecido');
            this.submitting = false;
          }
        });
    } else {
      this.qualidadeAguaService.createRegistro(registro)
        .subscribe({
          next: () => {
            this.router.navigate(['/qualidade-agua']);
          },
          error: (err) => {
            this.error = 'Erro ao criar registro: ' + (err.message || 'Erro desconhecido');
            this.submitting = false;
          }
        });
    }
  }

  cancelar(): void {
    this.router.navigate(['/qualidade-agua']);
  }

  // Formata a data para o formato aceito pelo input type="date"
  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}