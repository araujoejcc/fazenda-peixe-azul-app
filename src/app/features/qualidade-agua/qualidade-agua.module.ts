import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from '../../core/guards/auth.guard';

import { QualidadeAguaListComponent } from './qualidade-agua-list/qualidade-agua-list.component';
import { QualidadeAguaFormComponent } from './qualidade-agua-form/qualidade-agua-form.component';
import { QualidadeAguaDetailComponent } from './qualidade-agua-detail/qualidade-agua-detail.component';
import { QualidadeAguaDashboardComponent } from './qualidade-agua-dashboard/qualidade-agua-dashboard.component';
import { QualidadeAguaChartComponent } from './qualidade-agua-chart/qualidade-agua-chart.component';

const routes: Routes = [
  { 
    path: '', 
    component: QualidadeAguaListComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'novo', 
    component: QualidadeAguaFormComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'editar/:id', 
    component: QualidadeAguaFormComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: ':id', 
    component: QualidadeAguaDetailComponent, 
    canActivate: [AuthGuard] 
  }
];

@NgModule({
  declarations: [
    QualidadeAguaListComponent,
    QualidadeAguaFormComponent,
    QualidadeAguaDetailComponent,
    QualidadeAguaDashboardComponent,
    QualidadeAguaChartComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    QualidadeAguaDashboardComponent,
    QualidadeAguaChartComponent
  ]
})
export class QualidadeAguaModule { }