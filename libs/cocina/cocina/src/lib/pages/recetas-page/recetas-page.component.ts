import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecetaService } from '../../data-access/receta.service';
import { Receta } from '../../models/receta.model';
import { DetalleRecetaComponent } from '../../components/detalle-receta/detalle-receta.component';
import { GestionRecetaComponent } from '../../components/gestion-receta/gestion-receta.component';
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

  searchTerm = signal<string>('');
  categoriaSeleccionada = signal<string>('');
  
  // Estado para los modales
  recetaSeleccionada = signal<Receta | null>(null);
  mostrarDetalle = signal<boolean>(false);
  mostrarGestion = signal<boolean>(false);

  // Estados para alertas y confirmación
  confirmDeleteOpen = signal<boolean>(false);
  recetaIdParaEliminar = signal<string | null>(null);
  alertMessage = signal<string>('');
  alertType = signal<'success' | 'error' | 'warning' | 'info'>('info');

  opcionesCategoria = [
    { label: 'Todas las categorías', value: '' },
    { label: 'Platos Fuertes', value: 'platos fuertes' },
    { label: 'Entradas', value: 'entradas' },
    { label: 'Postres', value: 'postres' }
  ];

  recetasFiltradas = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const cat = this.categoriaSeleccionada().toLowerCase().trim();
    
    return this.recetaService.recetas().filter(r => {
      const matchSearch = r.nombreReceta.toLowerCase().includes(term) || 
                          (r.nombreCategoria && r.nombreCategoria.toLowerCase().includes(term));
      
      let matchCategory = !cat;
      if (cat && r.nombreCategoria) {
        const rc = r.nombreCategoria.toLowerCase().trim();
        // Mapeo inteligente en español para consistencia con mock y base de datos
        if (cat === 'platos fuertes') {
          matchCategory = rc === 'platos fuertes' || rc === 'plato fuerte' || rc === 'plato principal' || rc === 'platos principales' || rc === 'sopas' || rc === 'sopa';
        } else if (cat === 'entradas') {
          matchCategory = rc === 'entradas' || rc === 'entrada';
        } else if (cat === 'postres') {
          matchCategory = rc === 'postres' || rc === 'postre';
        } else {
          matchCategory = rc.includes(cat) || cat.includes(rc);
        }
      }
      return matchSearch && matchCategory;
    });
  });

  constructor() {
    effect(() => {
      console.log('Datos actualizados en Gastro SENA:', this.recetaService.recetas());
    });
  }

  ngOnInit(): void {
    this.recetaService.listar();
  }

  verDetalle(receta: Receta) {
    this.recetaSeleccionada.set(receta);
    this.mostrarDetalle.set(true);
  }

  abrirNuevaReceta() {
    this.recetaSeleccionada.set(null);
    this.mostrarGestion.set(true);
  }

  editarReceta(receta: Receta) {
    this.recetaSeleccionada.set(receta);
    this.mostrarGestion.set(true);
  }

  cerrarModales(actualizoDatos = false) {
    this.mostrarDetalle.set(false);
    this.mostrarGestion.set(false);
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
          // Fallback: si es un ID de prueba o el backend está apagado (status 0)
          if (id.startsWith('R-') || err.status === 0) {
            this.recetaService.recetas.update(recetas => recetas.filter(r => r.idReceta !== id));
            this.mostrarAlerta('success', 'Receta eliminada localmente (Modo de prueba)');
          } else {
            this.mostrarAlerta('error', 'No se pudo eliminar la receta.');
          }
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
