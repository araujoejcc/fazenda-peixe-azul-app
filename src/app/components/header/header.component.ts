import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isLoggedIn$ = this.authService.isLoggedIn();

  constructor(private authService: AuthService) {}

  onLogout(): void {
    this.authService.logout();
  }
}