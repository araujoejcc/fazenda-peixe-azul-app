import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  returnUrl: string = '/dashboard';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Verificar se há um returnUrl nos parâmetros de consulta
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';
    
    this.authService.login({
      email: this.f['email'].value,
      senha: this.f['senha'].value
    })
    .pipe(
      finalize(() => {
        this.loading = false;
      })
    )
    .subscribe({
      next: () => {
        this.router.navigate([this.returnUrl]);
      },
      error: error => {
        this.error = error?.message || 'Usuário ou senha inválidos';
      }
    });
  }
}