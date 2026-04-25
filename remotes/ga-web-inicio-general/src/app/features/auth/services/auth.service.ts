import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface LoginRequest {
  email:      string;
  contrasena: string;
}

export interface LoginResponse {
  token:          string;
  tipo:           string;
  expiracionMs:   number;
  idUsuario:      string;
  nombreCompleto: string;
  email:          string;
  rol:            string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly BASE  = 'http://localhost:8081/auth';
  private readonly MOCK  = true;

  private mockUsers = [
    { email: 'admin@sena.edu.co',     contrasena: 'admin123',    nombreCompleto: 'Administrador Sistema', rol: 'ADMINISTRADOR' },
    { email: 'chef@sena.edu.co',      contrasena: 'chef123',     nombreCompleto: 'Carlos Chef',           rol: 'CHEF'          },
    { email: 'mesero@sena.edu.co',    contrasena: 'mesero123',   nombreCompleto: 'Ana Mesero',            rol: 'MESERO'        },
    { email: 'contador@sena.edu.co',  contrasena: 'contador123', nombreCompleto: 'Laura Contadora',       rol: 'CONTADORA'     }
  ];

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    if (this.MOCK) {
      const user = this.mockUsers.find(
        u => u.email === credentials.email && u.contrasena === credentials.contrasena
      );
      if (user) {
        const res: LoginResponse = {
          token:          'mock-token-' + Date.now(),
          tipo:           'Bearer',
          expiracionMs:   3600000,
          idUsuario:      '1',
          nombreCompleto: user.nombreCompleto,
          email:          user.email,
          rol:            user.rol
        };
        localStorage.setItem('token', res.token);
        localStorage.setItem('user',  JSON.stringify(res));
        return of(res);
      }
      return throwError(() => ({ error: { message: 'Credenciales incorrectas.' } }));
    }
    return this.http.post<LoginResponse>(`${this.BASE}/login`, credentials).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user',  JSON.stringify(res));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null { return localStorage.getItem('token'); }

  getUser(): LoginResponse | null {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }

  isAuthenticated(): boolean { return !!this.getToken(); }
}
