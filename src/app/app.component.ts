import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Sistema de Gestão para Carinicultura';
  isLoggedIn$: Observable<boolean>;

  constructor(private authService: AuthService) {
    console.log('AppComponent initialized');
    this.isLoggedIn$ = this.authService.isLoggedIn();
    console.log('AuthService initialized');
  }

  ngOnInit(): void {
  }
}