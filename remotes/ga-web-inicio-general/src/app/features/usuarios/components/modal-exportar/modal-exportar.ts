import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../services/usuarios.service';

@Component({
  selector: 'app-modal-exportar',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-exportar.html',
  styleUrl: './modal-exportar.scss'
})
export class ModalExportar {
  @Input()  usuarios: Usuario[] = [];
  @Output() cerrar = new EventEmitter<void>();

  formato          = 'xlsx';
  incluirInactivos = false;
  filtroRol        = '';
  loading          = false;

  roles = ['ADMINISTRADOR','CHEF','MESERO','BARTENDER','CAJERO','CONTADORA','INSTRUCTOR'];

  exportar(): void {
    this.loading = true;
    setTimeout(() => {
      const datos = this.usuarios
        .filter(u => this.incluirInactivos ? true : u.estado)
        .filter(u => !this.filtroRol || u.rol.nombreRol === this.filtroRol);

      const encabezados = ['Documento','Nombre','Apellidos','Email','Teléfono','Rol','Estado','Fecha Creación'];
      const filas = datos.map(u => [
        u.documento, u.nombre, u.apellidos, u.email,
        u.telefono, u.rol.nombreRol,
        u.estado ? 'Activo' : 'Inactivo',
        u.fechaCreacion
      ]);

      const csvContent = [encabezados, ...filas]
        .map(row => row.join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url  = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href     = url;
      link.download = `usuarios_gastrosena_${new Date().toISOString().split('T')[0]}.${this.formato}`;
      link.click();
      URL.revokeObjectURL(url);

      this.loading = false;
      this.cerrar.emit();
    }, 1000);
  }
}
