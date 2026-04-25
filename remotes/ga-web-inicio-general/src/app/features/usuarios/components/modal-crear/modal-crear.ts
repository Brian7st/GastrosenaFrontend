import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService, Usuario, CrearUsuarioRequest } from '../../services/usuarios.service';

@Component({
  selector: 'app-modal-crear',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-crear.html',
  styleUrl: './modal-crear.scss'
})
export class ModalCrear implements OnInit {
  @Input()  usuarioEditar: Usuario | null = null;
  @Output() cerrar  = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<void>();

  loading  = false;
  showPass = false;
  errorMsg = '';

  roles = [
    { idRol: '1', nombreRol: 'ADMINISTRADOR' },
    { idRol: '2', nombreRol: 'CHEF'          },
    { idRol: '3', nombreRol: 'MESERO'        },
    { idRol: '4', nombreRol: 'BARTENDER'     },
    { idRol: '5', nombreRol: 'CAJERO'        },
    { idRol: '6', nombreRol: 'CONTADORA'     },
    { idRol: '7', nombreRol: 'INSTRUCTOR'    }
  ];

  form: CrearUsuarioRequest = {
    documento:  '',
    nombre:     '',
    apellidos:  '',
    email:      '',
    telefono:   '',
    contrasena: '',
    idRol:      ''
  };

  get esEdicion(): boolean { return !!this.usuarioEditar; }
  get titulo():    string  { return this.esEdicion ? 'Editar Usuario' : 'Crear Nuevo Usuario'; }

  constructor(private svc: UsuariosService) {}

  ngOnInit(): void {
    if (this.usuarioEditar) {
      this.form = {
        documento:  this.usuarioEditar.documento,
        nombre:     this.usuarioEditar.nombre,
        apellidos:  this.usuarioEditar.apellidos,
        email:      this.usuarioEditar.email,
        telefono:   this.usuarioEditar.telefono,
        contrasena: '',
        idRol:      this.usuarioEditar.rol.idRol
      };
    }
  }

  guardar(): void {
    if (this.loading) return;
    this.loading  = true;
    this.errorMsg = '';

    this.svc.crearUsuario(this.form).subscribe({
      next: () => {
        this.loading = false;
        this.guardado.emit();
      },
      error: err => {
        this.loading  = false;
        this.errorMsg = err.error?.message ?? 'Error al guardar el usuario.';
      }
    });
  }
}
