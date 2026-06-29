import { Component, inject, OnInit, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../i18n/i18n.service';
import { CategoriaService } from '../../data-access/categoria.service';
import { Categoria } from '../../models/receta.model';
import { LucideIconComponent, ButtonComponent, AlertComponent, InputComponent, ConfirmDialogComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-gestion-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideIconComponent, ButtonComponent, AlertComponent, InputComponent, ConfirmDialogComponent],
  templateUrl: './gestion-categorias.component.html',
  styleUrl: './gestion-categorias.component.scss',
})
export class GestionCategoriasComponent implements OnInit {
  protected readonly i18n = inject(I18nService);
  public categoriaService = inject(CategoriaService);
  
  @Output() close = new EventEmitter<boolean>();
  
  nuevaCategoriaNombre = '';
  categoriaEnEdicion: Categoria | null = null;
  
  // Alertas y Confirmación
  alertMessage = signal<string>('');
  alertType = signal<'success' | 'error' | 'info'>('info');
  
  confirmDeleteOpen = signal<boolean>(false);
  categoriaIdParaEliminar = signal<string | null>(null);

  ngOnInit() {
    this.categoriaService.listar();
  }

  cerrar() {
    this.close.emit(true);
  }

  guardarCategoria() {
    if (!this.nuevaCategoriaNombre.trim()) {
      this.mostrarAlerta('error', this.i18n.t('gestion-categorias.alerta_vacio'));
      return;
    }

    if (this.categoriaEnEdicion) {
      // Actualizar
      this.categoriaService.actualizarCategoria(this.categoriaEnEdicion.idCategoria!, { nombreCategoria: this.nuevaCategoriaNombre })
        .subscribe({
          next: () => {
            this.mostrarAlerta('success', this.i18n.t('gestion-categorias.alerta_actualizada'));
            this.resetFormulario();
            this.categoriaService.listar();
          },
          error: (err) => this.mostrarAlerta('error', this.i18n.t('gestion-categorias.alerta_error_actualizar'))
        });
    } else {
      // Crear nueva
      this.categoriaService.guardarCategoria({ nombreCategoria: this.nuevaCategoriaNombre })
        .subscribe({
          next: () => {
            this.mostrarAlerta('success', this.i18n.t('gestion-categorias.alerta_creada'));
            this.resetFormulario();
            this.categoriaService.listar();
          },
          error: (err) => this.mostrarAlerta('error', this.i18n.t('gestion-categorias.alerta_error_crear'))
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
          this.mostrarAlerta('success', this.i18n.t('gestion-categorias.alerta_eliminada'));
          this.categoriaService.listar();
        },
        error: (err) => {
          // El backend rechaza la eliminación por integridad referencial
          this.mostrarAlerta('error', this.i18n.t('gestion-categorias.alerta_error_eliminar'));
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
    setTimeout(() => this.alertMessage.set(''), 4000); // 4 segundos para que le dé tiempo a leer
  }
}
