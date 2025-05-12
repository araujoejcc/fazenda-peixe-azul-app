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
    // Verifica se há um token no localStorage e atualiza o estado inicial
    this.checkInitialAuthState();
  }

  // Método para verificar o estado de autenticação inicial
  private checkInitialAuthState(): void {
    const token = this.getToken();
    if (token) {
      this.isLoggedInSubject.next(true);
    } else {
      this.isLoggedInSubject.next(false);
      // Limpa qualquer dado de sessão antigo
      this.clearAuthData();
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    // Simular validação de credenciais
    if (credentials.email === this.mockCredentials.email && 
        credentials.senha === this.mockCredentials.senha) {
      
      // Simular delay da rede (500ms)
      return of(this.mockUserResponse).pipe(
        delay(500),
        tap(response => {
          // Armazenar dados
          this.setAuthData(response);
          
          // Atualizar estado de login
          this.isLoggedInSubject.next(true);
        })
      );
    }
    
    // Simular erro de autenticação
    return throwError(() => new Error('Credenciais inválidas')).pipe(delay(500));
  }

  logout(): void {
    // Limpar dados de autenticação
    this.clearAuthData();
    
    // Atualizar estado de login
    this.isLoggedInSubject.next(false);
    
    // Redirecionar para a página de login
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  // Método para verificar se há um token válido
  private hasToken(): boolean {
    const token = this.getToken();
    return !!token;
  }

  // Armazena os dados de autenticação no localStorage
  private setAuthData(response: LoginResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.userKey, JSON.stringify(response.usuario));
  }

  // Limpa os dados de autenticação do localStorage
  private clearAuthData(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  // Obtém informações do usuário
  getUserInfo(): any {
    const userInfo = localStorage.getItem(this.userKey);
    return userInfo ? JSON.parse(userInfo) : null;
  }
}