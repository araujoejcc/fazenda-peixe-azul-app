import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { SidebarService } from '../../core/services/sidebar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isLoggedIn$ = this.authService.isLoggedIn();

  constructor(
    private authService: AuthService,
    private sidebarService: SidebarService
  ) {}

  onLogout(): void {
    // Chamada simples ao método logout do serviço
    this.authService.logout();
    // A navegação para página de login agora é feita diretamente no serviço
  }

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }
}