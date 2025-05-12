import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component'; // Esta linha deve importar o componente correto
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/header/sidebar/sidebar.component';

// Serviços
import { AuthService } from './core/services/auth.service';
import { TanqueService } from './core/services/tanque.service';
import { CicloProducaoService } from './core/services/ciclo-producao.service';
import { QualidadeAguaService } from './core/services/qualidade-agua.service';
import { SidebarService } from './core/services/sidebar.service'; // Importando o SidebarService

// Serviços mock
import { AuthServiceMock } from './core/services/auth.service-mock';
import { TanqueServiceMock } from './core/services/tanque.service-mock';
import { CicloProducaoServiceMock } from './core/services/ciclo-producao.service-mock';
import { QualidadeAguaServiceMock } from './core/services/qualidade-agua.service-mock';

// Variável de ambiente para determinar se deve usar mocks
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [
    // Para desenvolvimento local, use os mocks
    { provide: AuthService, useClass: AuthServiceMock },
    { provide: TanqueService, useClass: TanqueServiceMock },
    { provide: CicloProducaoService, useClass: CicloProducaoServiceMock },
    { provide: QualidadeAguaService, useClass: QualidadeAguaServiceMock },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    SidebarService // Adicionando o SidebarService aos providers
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }