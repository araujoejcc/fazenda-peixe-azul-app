import { Component, OnInit, Input } from '@angular/core';
import { RegistroQualidadeAgua } from '../../../core/models/registro-qualidade-agua.model';
import { QualidadeAguaService } from '../../../core/services/qualidade-agua.service';

@Component({
  selector: 'app-qualidade-agua-dashboard',
  templateUrl: './qualidade-agua-dashboard.component.html',
  styleUrls: ['./qualidade-agua-dashboard.component.scss']
})
export class QualidadeAguaDashboardComponent implements OnInit {
  @Input() tanqueId?: number;
  
  registros: RegistroQualidadeAgua[] = [];
  loading = false;
  error = '';

  constructor(private qualidadeAguaService: QualidadeAguaService) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.loading = true;
    this.error = '';

    this.qualidadeAguaService.getRegistros()
      .subscribe({
        next: (data) => {
          if (this.tanqueId) {
            // Filtra registros para o tanque especificado
            this.registros = data.filter(r => r.tanque.id === this.tanqueId);
          } else {
            // Obtém os últimos 5 registros
            this.registros = data.sort((a, b) => 
              new Date(b.data).getTime() - new Date(a.data).getTime()
            ).slice(0, 5);
          }
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Erro ao carregar dados: ' + (err.message || 'Erro desconhecido');
          this.loading = false;
        }
      });
  }

  // Avalia a condição dos parâmetros
  avaliarParametro(valor: number, tipo: string): string {
    switch (tipo) {
      case 'ph':
        if (valor < 7.0 || valor > 8.5) return 'warning';
        return 'good';
      case 'oxigenacao':
        if (valor < 4.0) return 'critical';
        if (valor < 5.0) return 'warning';
        return 'good';
      case 'temperatura':
        if (valor < 25.0 || valor > 32.0) return 'warning';
        return 'good';
      case 'amonia':
        if (valor > 0.5) return 'critical';
        if (valor > 0.3) return 'warning';
        return 'good';
      case 'nitrito':
        if (valor > 0.1) return 'critical';
        if (valor > 0.05) return 'warning';
        return 'good';
      default:
        return '';
    }
  }
}