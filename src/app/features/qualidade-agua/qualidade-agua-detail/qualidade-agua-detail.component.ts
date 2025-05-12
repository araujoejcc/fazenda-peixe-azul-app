import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistroQualidadeAgua } from '../../../core/models/registro-qualidade-agua.model';
import { QualidadeAguaService } from '../../../core/services/qualidade-agua.service';

@Component({
  selector: 'app-qualidade-agua-detail',
  templateUrl: './qualidade-agua-detail.component.html',
  styleUrls: ['./qualidade-agua-detail.component.scss']
})
export class QualidadeAguaDetailComponent implements OnInit {
  registroId!: number;
  registro?: RegistroQualidadeAgua;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private qualidadeAguaService: QualidadeAguaService
  ) { }

  ngOnInit(): void {
    this.registroId = +this.route.snapshot.params['id'];
    this.carregarRegistro();
  }

  carregarRegistro(): void {
    this.loading = true;
    this.error = '';

    this.qualidadeAguaService.getRegistroById(this.registroId)
      .subscribe({
        next: (registro) => {
          this.registro = registro;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Erro ao carregar registro: ' + (err.message || 'Erro desconhecido');
          this.loading = false;
        }
      });
  }

  editarRegistro(): void {
    this.router.navigate(['/qualidade-agua/editar', this.registroId]);
  }

  voltarParaLista(): void {
    this.router.navigate(['/qualidade-agua']);
  }
}