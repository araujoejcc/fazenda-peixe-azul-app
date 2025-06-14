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
    email: 'usuario',
    senha: 'senha123'
  };

  private mockUserResponse: LoginResponse = {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkbWluaXN0cmFkb3IiLCJpYXQiOjE1MTYyMzkwMjJ9',
    tipo: 'Bearer',
    usuario: {
      id: 1,
      nome: 'Administrador',
      email: 'usuario',
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
          // Limpar quaisquer dados antigos
          localStorage.removeItem(this.tokenKey);
          localStorage.removeItem(this.userKey);
          
          // Armazenar novos dados
          localStorage.setItem(this.tokenKey, response.token);
          localStorage.setItem(this.userKey, JSON.stringify(response.usuario));
          
          // Atualizar estado de login
          this.isLoggedInSubject.next(true);
          console.log('Login successful, token stored:', response.token);
        })
      );
    }
    
    // Simular erro de autenticação
    return throwError(() => new Error('Credenciais inválidas')).pipe(delay(500));
  }

  logout(): void {
    console.log('Logout called');
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.isLoggedInSubject.next(false);
    // Adicionar navegação para a página de login
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    console.log('getToken called, token:', token);
    return token;
  }

  isLoggedIn(): Observable<boolean> {
    const loggedIn = this.hasToken();
    console.log('isLoggedIn called, current value:', loggedIn);
    return this.isLoggedInSubject.asObservable();
  }

  private hasToken(): boolean {
    const token = this.getToken();
    const hasToken = !!token;
    console.log('hasToken check result:', hasToken);
    return hasToken;
  }
}