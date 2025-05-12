import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { Observable } from 'rxjs';
import { SidebarService } from './core/services/sidebar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Sistema de Gestão para Carcinicultura';
  isLoggedIn$: Observable<boolean>;
  sidebarCollapsed = false;

  constructor(
    private authService: AuthService,
    private sidebarService: SidebarService
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn();
  }

  ngOnInit(): void {
    this.sidebarService.sidebarState$.subscribe(state => {
      this.sidebarCollapsed = state.collapsed;
    });
  }
}