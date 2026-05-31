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

  // Categorías estáticas del módulo Bar y Barismo
  opcionesCategoria = [
    { label: 'Todas las categorías', value: '' },
    { label: 'Cócteles',            value: 'cocteles' },
    { label: 'Bebidas Calientes',   value: 'bebidas calientes' },
    { label: 'Bebidas Frías',       value: 'bebidas frias' },
    { label: 'Café y Barismo',      value: 'cafe y barismo' },
    { label: 'Shots y Chupitos',    value: 'shots' },
    { label: 'Sin Alcohol',         value: 'sin alcohol' },
  ];

  recetasFiltradas = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const cat = this.categoriaSeleccionada().toLowerCase().trim();

    return this.recetaService.recetas().filter(r => {
      const matchSearch = r.nombreReceta.toLowerCase().includes(term) ||
                          (r.nombreCategoria && r.nombreCategoria.toLowerCase().includes(term));

      let matchCategory = !cat;
      if (cat && r.nombreCategoria) {
        const rc = r.nombreCategoria.toLowerCase().trim();
        // Mapeo inteligente en español para consistencia con mock y base de datos
        if (cat === 'cocteles') {
          matchCategory = rc.includes('cóctel') || rc.includes('coctel') || rc.includes('cócteles') || rc === 'bebidas con alcohol' || rc.includes('alcohol');
        } else if (cat === 'bebidas calientes') {
          matchCategory = rc.includes('caliente') || rc.includes('café') || rc.includes('cafe') || rc.includes('barismo') || rc.includes('té') || rc.includes('te');
        } else if (cat === 'bebidas frias') {
          matchCategory = rc.includes('fría') || rc.includes('fria') || rc.includes('frío') || rc.includes('frio') || rc.includes('helado') || rc.includes('limonada') || rc.includes('smoothie') || rc.includes('jugo');
        } else if (cat === 'cafe y barismo') {
          matchCategory = rc.includes('café') || rc.includes('cafe') || rc.includes('barismo') || rc.includes('espresso') || rc.includes('latte') || rc.includes('cappuccino');
        } else if (cat === 'shots') {
          matchCategory = rc.includes('shot') || rc.includes('chupito') || rc.includes('shooter');
        } else if (cat === 'sin alcohol') {
          matchCategory = rc.includes('sin alcohol') || rc.includes('mocktail') || rc.includes('limonada') || rc.includes('agua');
        } else {
          matchCategory = rc.includes(cat) || cat.includes(rc);
        }
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
