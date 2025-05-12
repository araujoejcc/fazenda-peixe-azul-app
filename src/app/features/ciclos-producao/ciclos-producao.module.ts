import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from '../../core/guards/auth.guard';

// Componentes
import { CicloListComponent } from './ciclo-list/ciclo-list.component';
import { CicloFormComponent } from './ciclo-form/ciclo-form.component';
import { CicloDetailComponent } from './ciclo-detail/ciclo-detail.component';

const routes: Routes = [
  { 
    path: '', 
    component: CicloListComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'novo', 
    component: CicloFormComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'editar/:id', 
    component: CicloFormComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: ':id', 
    component: CicloDetailComponent, 
    canActivate: [AuthGuard] 
  }
];

@NgModule({
  declarations: [
    CicloListComponent,
    CicloFormComponent,
    CicloDetailComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class CiclosProducaoModule { }