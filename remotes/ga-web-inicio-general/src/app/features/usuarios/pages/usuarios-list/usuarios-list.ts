import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService, Usuario } from '../../services/usuarios.service';
import { ModalCrear } from '../../components/modal-crear/modal-crear';
import { ModalImportar } from '../../components/modal-importar/modal-importar';
import { ModalExportar } from '../../components/modal-exportar/modal-exportar';

@Component({
  selector: 'app-usuarios-list',
  imports: [CommonModule, FormsModule, ModalCrear, ModalImportar, ModalExportar],
  templateUrl: './usuarios-list.html',
  styleUrl: './usuarios-list.scss'
})
export class UsuariosList implements OnInit {

  usuarios:         Usuario[] = [];
  usuariosFiltrados:Usuario[] = [];
  busqueda          = '';
  filtroRol         = '';
  loading           = false;

  showModalCrear    = false;
  showModalImportar = false;
  showModalExportar = false;
  usuarioEditar:    Usuario | null = null;

  roles = ['Administrador','Chef','Mesero','Bartender','Cajero','Contadora','Instructor'];

  constructor(private svc: UsuariosService) {}

  ngOnInit(): void { this.cargarUsuarios(); }

  cargarUsuarios(): void {
    this.loading = true;
    this.svc.getUsuarios().subscribe({
      next: data => {
        this.usuarios          = data;
        this.usuariosFiltrados = data;
        this.loading           = false;
      },
      error: () => { this.loading = false; }
    });
  }

  filtrar(): void {
    this.usuariosFiltrados = this.usuarios.filter(u => {
      const matchBusqueda = !this.busqueda ||
        `${u.nombre} ${u.apellidos}`.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        u.email.toLowerCase().includes(this.busqueda.toLowerCase());
     const matchRol = !this.filtroRol || u.rol.nombreRol === this.filtroRol;
      return matchBusqueda && matchRol;
    });
  }

  abrirCrear():    void { this.usuarioEditar = null; this.showModalCrear = true; }
  abrirEditar(u: Usuario): void { this.usuarioEditar = u; this.showModalCrear = true; }

  eliminar(u: Usuario): void {
    if (!confirm(`¿Eliminar a ${u.nombre} ${u.apellidos}?`)) return;
    this.svc.eliminarUsuario(u.idUsuario).subscribe(() => this.cargarUsuarios());
  }

  onUsuarioGuardado(): void {
    this.showModalCrear = false;
    this.cargarUsuarios();
  }

  get totalActivos():   number { return this.usuarios.filter(u => u.estado).length; }
  get totalInactivos(): number { return this.usuarios.filter(u => !u.estado).length; }
}
