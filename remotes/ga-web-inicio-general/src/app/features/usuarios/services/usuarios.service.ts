import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface Usuario {
  idUsuario:          string;
  documento:          string;
  nombre:             string;
  apellidos:          string;
  email:              string;
  telefono:           string;
  estado:             boolean;
  fechaCreacion:      string;
  rol:                { idRol: string; nombreRol: string; };
  cuentaBloqueada:    boolean;
  intentosFallidos:   number;
}

export interface CrearUsuarioRequest {
  documento:  string;
  nombre:     string;
  apellidos:  string;
  email:      string;
  telefono:   string;
  contrasena: string;
  idRol:      string;
}

@Injectable({ providedIn: 'root' })
export class UsuariosService {

  private readonly BASE = 'http://localhost:8081/api/usuarios';
  private readonly MOCK = true;

  private mockUsuarios: Usuario[] = [
    { idUsuario: '1', documento: '1234567890', nombre: 'María',  apellidos: 'González', email: 'maria@restaurant.com',  telefono: '+57 301 234 5678', rol: { idRol: '1', nombreRol: 'ADMINISTRADOR' }, estado: true,  fechaCreacion: '2024-01-15', cuentaBloqueada: false, intentosFallidos: 0 },
    { idUsuario: '2', documento: '0987654321', nombre: 'Carlos', apellidos: 'Ramírez',  email: 'carlos@restaurant.com', telefono: '+57 300 123 4567', rol: { idRol: '2', nombreRol: 'CHEF'          }, estado: true,  fechaCreacion: '2024-01-14', cuentaBloqueada: false, intentosFallidos: 0 },
    { idUsuario: '3', documento: '1122334455', nombre: 'Ana',    apellidos: 'López',    email: 'ana@restaurant.com',    telefono: '+57 302 345 6789', rol: { idRol: '3', nombreRol: 'MESERO'        }, estado: true,  fechaCreacion: '2024-01-19', cuentaBloqueada: false, intentosFallidos: 0 },
    { idUsuario: '4', documento: '5544332211', nombre: 'José',   apellidos: 'Martín',   email: 'jose@restaurant.com',   telefono: '+57 303 456 7890', rol: { idRol: '4', nombreRol: 'BARTENDER'     }, estado: false, fechaCreacion: '2024-01-14', cuentaBloqueada: true,  intentosFallidos: 3 },
    { idUsuario: '5', documento: '9988776655', nombre: 'Laura',  apellidos: 'Silva',    email: 'laura@restaurant.com',  telefono: '+57 304 567 8901', rol: { idRol: '5', nombreRol: 'CAJERO'        }, estado: true,  fechaCreacion: '2024-01-15', cuentaBloqueada: false, intentosFallidos: 0 }
  ];

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<Usuario[]> {
    if (this.MOCK) return of(this.mockUsuarios);
    return this.http.get<Usuario[]>(this.BASE);
  }

  crearUsuario(data: CrearUsuarioRequest): Observable<Usuario> {
    if (this.MOCK) {
      const nuevo: Usuario = {
        idUsuario:        Date.now().toString(),
        documento:        data.documento,
        nombre:           data.nombre,
        apellidos:        data.apellidos,
        email:            data.email,
        telefono:         data.telefono,
        rol:              { idRol: data.idRol, nombreRol: data.idRol },
        estado:           true,
        fechaCreacion:    new Date().toISOString().split('T')[0],
        cuentaBloqueada:  false,
        intentosFallidos: 0
      };
      this.mockUsuarios.push(nuevo);
      return of(nuevo);
    }
    return this.http.post<Usuario>(this.BASE, data);
  }

  eliminarUsuario(id: string): Observable<void> {
    if (this.MOCK) {
      this.mockUsuarios = this.mockUsuarios.filter(u => u.idUsuario !== id);
      return of(void 0);
    }
    return this.http.delete<void>(`${this.BASE}/${id}`);
  }
}
