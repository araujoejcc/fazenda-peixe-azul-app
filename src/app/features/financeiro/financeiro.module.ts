import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';

// Placeholder para futuras implementações
const routes: Routes = [
  { 
    path: '', 
    component: FinanceiroPlaceholderComponent, 
    canActivate: [AuthGuard] 
  }
];

@NgModule({
  declarations: [
    FinanceiroPlaceholderComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class FinanceiroModule { }

// Componente placeholder simples apenas para o roteamento funcionar
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-financeiro-placeholder',
  template: `
    <div class="container">
      <h1>Gestão Financeira</h1>
      <div class="card">
        <p>Esta funcionalidade será implementada em breve!</p>
        <button class="btn-primary" (click)="voltar()">Voltar</button>
      </div>
    </div>
  `,
  styles: []
})
export class FinanceiroPlaceholderComponent {
  constructor(private router: Router) {}
  
  voltar(): void {
    this.router.navigate(['/dashboard']);
  }
}