import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { TanqueListComponent } from './tanque-list/tanque-list.component';
import { TanqueFormComponent } from './tanque-form/tanque-form.component';
import { TanqueDetailComponent } from './tanque-detail/tanque-detail.component';
import { AuthGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  { 
    path: '', 
    component: TanqueListComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'novo', 
    component: TanqueFormComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'editar/:id', 
    component: TanqueFormComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: ':id', 
    component: TanqueDetailComponent, 
    canActivate: [AuthGuard] 
  }
];

@NgModule({
  declarations: [
    TanqueListComponent,
    TanqueFormComponent,
    TanqueDetailComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class TanquesModule { }