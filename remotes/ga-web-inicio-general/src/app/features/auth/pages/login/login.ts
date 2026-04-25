import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink, HttpClientModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  form     = { email: '', contrasena: '' };
  loading  = false;
  showPass = false;
  errorMsg = '';

  panelFeatures = [
    'Gestión de cocina y bar en tiempo real',
    'Control de inventario integrado',
    'Reportes financieros por rol',
    'Administración de usuarios y fichas',
  ];

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(): void {
    if (this.loading) return;
    this.loading  = true;
    this.errorMsg = '';

    this.auth.login(this.form).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        this.loading  = false;
        this.errorMsg = err.error?.message ?? 'Credenciales incorrectas. Intenta de nuevo.';
      }
    });
  }
}
