import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { LoginRequest, LoginResponse } from '../models/auth.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceMock {
  private tokenKey = 'auth_token_mock';
  private userKey = 'user_info_mock';
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());

  // Credenciais mockadas para teste
  private mockCredentials = {
    email: 'admin@exemplo.com',
    senha: 'admin123'
  };

  private mockUserResponse: LoginResponse = {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkbWluaXN0cmFkb3IiLCJpYXQiOjE1MTYyMzkwMjJ9',
    tipo: 'Bearer',
    usuario: {
      id: 1,
      nome: 'Administrador',
      email: 'admin@exemplo.com',
      perfis: ['ADMIN']
    }
  };

  constructor(private router: Router) {
    console.log('AuthServiceMock initialized');
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    console.log('Login attempt with:', credentials);
    
    // Simular validação de credenciais
    if (credentials.email === this.mockCredentials.email && 
        credentials.senha === this.mockCredentials.senha) {
      
      // Simular delay da rede (500ms)
      return of(this.mockUserResponse).pipe(
        delay(500),
        tap(response => {
          localStorage.setItem(this.tokenKey, response.token);
          localStorage.setItem(this.userKey, JSON.stringify(response.usuario));
          this.isLoggedInSubject.next(true);
          console.log('Login successful');
        })
      );
    }
    
    // Simular erro de autenticação
    return throwError(() => new Error('Credenciais inválidas')).pipe(delay(500));
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): Observable<boolean> {
    console.log('isLoggedIn called, current value:', this.isLoggedInSubject.value);
    return this.isLoggedInSubject.asObservable();
  }

  private hasToken(): boolean {
    const hasToken = !!this.getToken();
    console.log('hasToken check result:', hasToken);
    return hasToken;
  }
}