import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Component } from '@angular/core';

// Componente simples para testar o roteamento
@Component({
  selector: 'app-test',
  template: '<div style="padding: 20px;"><h2>Teste de Roteamento</h2><p>Se você está vendo esta mensagem, o roteamento está funcionando!</p></div>'
})
class TestComponent {} 

const routes: Routes = [
  {
    path: '',
    component: TestComponent
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule],
  declarations: [TestComponent]
})
export class AppRoutingModule { }