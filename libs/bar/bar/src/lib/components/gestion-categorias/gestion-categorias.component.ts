import { Component, inject, OnInit, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from '../../data-access/categoria.service';
import { Categoria } from '../../models/receta.model';
import { LucideIconComponent, ButtonComponent, AlertComponent, InputComponent, ConfirmDialogComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-bar-gestion-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideIconComponent, ButtonComponent, AlertComponent, InputComponent, ConfirmDialogComponent],
  templateUrl: './gestion-categorias.component.html',
  styleUrl: './gestion-categorias.component.scss',
})
export class GestionCategoriasComponent implements OnInit {
  public categoriaService = inject(CategoriaService);

  @Output() closeManage = new EventEmitter<boolean>();

  nuevaCategoriaNombre = '';
  categoriaEnEdicion: Categoria | null = null;

  alertMessage = signal<string>('');
  alertType = signal<'success' | 'error' | 'info'>('info');

  confirmDeleteOpen = signal<boolean>(false);
  categoriaIdParaEliminar = signal<string | null>(null);

  ngOnInit() {
    this.categoriaService.listar();
  }

  cerrar() {
    this.closeManage.emit(true);
  }

  guardarCategoria() {
    if (!this.nuevaCategoriaNombre.trim()) {
      this.mostrarAlerta('error', 'El nombre no puede estar vacío');
      return;
    }

    if (this.categoriaEnEdicion) {
      this.categoriaService.actualizarCategoria(this.categoriaEnEdicion.idCategoria!, { nombreCategoria: this.nuevaCategoriaNombre })
        .subscribe({
          next: () => {
            this.mostrarAlerta('success', 'Categoría actualizada correctamente');
            this.resetFormulario();
            this.categoriaService.listar();
          },
          error: () => this.mostrarAlerta('error', 'Error al actualizar categoría')
        });
    } else {
      this.categoriaService.guardarCategoria({ nombreCategoria: this.nuevaCategoriaNombre })
        .subscribe({
          next: () => {
            this.mostrarAlerta('success', 'Categoría creada correctamente');
            this.resetFormulario();
            this.categoriaService.listar();
          },
          error: () => this.mostrarAlerta('error', 'Error al crear categoría')
        });
    }
  }

  editarCategoria(cat: Categoria) {
    this.categoriaEnEdicion = cat;
    this.nuevaCategoriaNombre = cat.nombreCategoria || '';
  }

  eliminarCategoria(id: string) {
    this.categoriaIdParaEliminar.set(id);
    this.confirmDeleteOpen.set(true);
  }

  cancelarEliminacion() {
    this.confirmDeleteOpen.set(false);
    this.categoriaIdParaEliminar.set(null);
  }

  confirmarEliminacion() {
    const id = this.categoriaIdParaEliminar();
    if (id) {
      this.categoriaService.eliminarCategoria(id).subscribe({
        next: () => {
          this.mostrarAlerta('success', 'Categoría eliminada con éxito');
          this.categoriaService.listar();
        },
        error: () => {
          this.mostrarAlerta('error', 'La categoría está en uso por una o más recetas y no se puede eliminar.');
        }
      });
    }
    this.cancelarEliminacion();
  }

  cancelarEdicion() {
    this.resetFormulario();
  }

  private resetFormulario() {
    this.nuevaCategoriaNombre = '';
    this.categoriaEnEdicion = null;
  }

  mostrarAlerta(type: 'success' | 'error' | 'info', message: string) {
    this.alertType.set(type);
    this.alertMessage.set(message);
    setTimeout(() => this.alertMessage.set(''), 4000);
  }
}
