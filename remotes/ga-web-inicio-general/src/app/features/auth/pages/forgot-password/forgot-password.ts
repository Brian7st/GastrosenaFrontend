import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss'
})
export class ForgotPassword {
  email    = '';
  loading  = false;
  sent     = false;
  errorMsg = '';

  onSubmit(): void {
    if (!this.email || this.loading) return;
    this.loading  = true;
    this.errorMsg = '';
    // Simulado por ahora — conectar cuando el backend tenga el endpoint
    setTimeout(() => {
      this.loading = false;
      this.sent    = true;
    }, 1500);
  }
}
