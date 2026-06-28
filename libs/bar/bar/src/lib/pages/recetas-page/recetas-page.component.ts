import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecetaService } from '../../data-access/receta.service';
import { CategoriaService } from '../../data-access/categoria.service';
import { Receta } from '../../models/receta.model';
import { DetalleRecetaComponent } from '../../components/detalle-receta/detalle-receta.component';
import { GestionRecetaComponent } from '../../components/gestion-receta/gestion-receta.component';
import { GestionCategoriasComponent } from '../../components/gestion-categorias/gestion-categorias.component';
import {
  LucideIconComponent,
  PageHeaderComponent,
  SearchFilterComponent,
  SelectFilterComponent,
  ButtonComponent,
  EmptyStateComponent,
  CardComponent,
  ConfirmDialogComponent,
  AlertComponent
} from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-recetas-page',
  standalone: true,
  imports: [
    CommonModule,
    DetalleRecetaComponent,
    GestionRecetaComponent,
    GestionCategoriasComponent,
    LucideIconComponent,
    PageHeaderComponent,
    SearchFilterComponent,
    SelectFilterComponent,
    ButtonComponent,
    EmptyStateComponent,
    CardComponent,
    ConfirmDialogComponent,
    AlertComponent
  ],
  templateUrl: './recetas-page.component.html',
  styleUrl: './recetas-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecetasPageComponent implements OnInit {
  public recetaService = inject(RecetaService);
  public catService = inject(CategoriaService);

  searchTerm = signal<string>('');
  categoriaSeleccionada = signal<string>('');

  // Estado para los modales
  recetaSeleccionada = signal<Receta | null>(null);
  mostrarDetalle = signal<boolean>(false);
  mostrarGestion = signal<boolean>(false);
  mostrarCategorias = signal<boolean>(false);

  // Estados para alertas y confirmación
  confirmDeleteOpen = signal<boolean>(false);
  recetaIdParaEliminar = signal<string | null>(null);
  alertMessage = signal<string>('');
  alertType = signal<'success' | 'error' | 'warning' | 'info'>('info');

  opcionesCategoria = computed(() => {
    const cats = this.catService.categorias();
    return [
      { label: 'Todas las categorías', value: '' },
      ...cats.map(c => ({ label: c.nombreCategoria, value: c.nombreCategoria.toLowerCase() }))
    ];
  });

  recetasFiltradas = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const cat = this.categoriaSeleccionada().toLowerCase().trim();

    return this.recetaService.recetas().filter(r => {
      const matchSearch = r.nombreReceta.toLowerCase().includes(term) ||
                          (r.nombreCategoria && r.nombreCategoria.toLowerCase().includes(term));

      let matchCategory = !cat;
      if (cat && r.nombreCategoria) {
        matchCategory = r.nombreCategoria.toLowerCase().trim() === cat;
      }
      return matchSearch && matchCategory;
    });
  });

  constructor() {
    effect(() => {
      console.log('Datos actualizados en Gastro SENA (Bar):', this.recetaService.recetas());
    });
  }

  ngOnInit(): void {
    this.recetaService.listar();
    this.catService.listar();
  }

  verDetalle(receta: Receta) {
    this.recetaSeleccionada.set(receta);
    this.mostrarDetalle.set(true);
  }

  abrirNuevaReceta() {
    this.recetaSeleccionada.set(null);
    this.mostrarGestion.set(true);
  }

  abrirGestionCategorias() {
    this.mostrarCategorias.set(true);
  }

  editarReceta(receta: Receta) {
    this.recetaSeleccionada.set(receta);
    this.mostrarGestion.set(true);
  }

  cerrarModales(actualizoDatos = false) {
    this.mostrarDetalle.set(false);
    this.mostrarGestion.set(false);
    this.mostrarCategorias.set(false);
    if (actualizoDatos) {
      this.recetaService.listar();
    }
  }

  prepararEliminacion(id: string) {
    this.recetaIdParaEliminar.set(id);
    this.confirmDeleteOpen.set(true);
  }

  cancelarEliminacion() {
    this.confirmDeleteOpen.set(false);
    this.recetaIdParaEliminar.set(null);
  }

  confirmarEliminacion() {
    const id = this.recetaIdParaEliminar();
    if (id) {
      this.recetaService.eliminarReceta(id).subscribe({
        next: () => {
          this.mostrarAlerta('success', 'Receta eliminada correctamente');
          this.recetaService.listar();
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          this.mostrarAlerta('error', 'No se pudo eliminar la receta.');
        }
      });
    }
    this.cancelarEliminacion();
  }

  mostrarAlerta(type: 'success' | 'error' | 'warning' | 'info', message: string) {
    this.alertType.set(type);
    this.alertMessage.set(message);
    setTimeout(() => this.alertMessage.set(''), 3000);
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }
}
