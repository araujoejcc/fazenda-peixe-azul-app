import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';

// Placeholder para futuras implementações
const routes: Routes = [
  { 
    path: '', 
    component: CiclosPlaceholderComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'novo', 
    component: CiclosPlaceholderComponent, 
    canActivate: [AuthGuard] 
  }
];

@NgModule({
  declarations: [
    CiclosPlaceholderComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class CiclosProducaoModule { }

// Componente placeholder simples apenas para o roteamento funcionar
import { Component } from '@angular/core';

@Component({
  selector: 'app-ciclos-placeholder',
  template: `
    <div class="container">
      <h1>Ciclos de Produção</h1>
      <div class="card">
        <p>Esta funcionalidade será implementada em breve!</p>
        <button class="btn-primary" (click)="voltar()">Voltar</button>
      </div>
    </div>
  `,
  styles: []
})
export class CiclosPlaceholderComponent {
  constructor(private router: Router) {}
  
  voltar(): void {
    this.router.navigate(['/dashboard']);
  }
}

import { Router } from '@angular/router';