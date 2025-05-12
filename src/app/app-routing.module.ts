import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'tanques',
    loadChildren: () => import('./features/tanques/tanques.module').then(m => m.TanquesModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'ciclos-producao',
    loadChildren: () => import('./features/ciclos-producao/ciclos-producao.module').then(m => m.CiclosProducaoModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'qualidade-agua',
    loadChildren: () => import('./features/qualidade-agua/qualidade-agua.module').then(m => m.QualidadeAguaModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'financeiro',
    loadChildren: () => import('./features/financeiro/financeiro.module').then(m => m.FinanceiroModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'relatorios',
    loadChildren: () => import('./features/relatorios/relatorios.module').then(m => m.RelatoriosModule),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ]
})
export class AppRoutingModule { }