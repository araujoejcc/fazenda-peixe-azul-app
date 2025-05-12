import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { Router } from '@angular/router';

// Componente placeholder simples apenas para o roteamento funcionar
import { Component } from '@angular/core';

@Component({
  selector: 'app-qualidade-agua-placeholder',
  template: `
    <div class="container">
      <h1>Monitoramento de Qualidade da Água</h1>
      <div class="card">
        <p>Esta funcionalidade será implementada em breve!</p>
        <button class="btn-primary" (click)="voltar()">Voltar</button>
      </div>
    </div>
  `,
  styles: []
})
export class QualidadeAguaPlaceholderComponent {
  constructor(private router: Router) {}
  
  voltar(): void {
    this.router.navigate(['/dashboard']);
  }
}

// Rotas definidas após a declaração do componente
const routes: Routes = [
  { 
    path: '', 
    component: QualidadeAguaPlaceholderComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'novo', 
    component: QualidadeAguaPlaceholderComponent, 
    canActivate: [AuthGuard] 
  }
];

@NgModule({
  declarations: [
    QualidadeAguaPlaceholderComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class QualidadeAguaModule { }