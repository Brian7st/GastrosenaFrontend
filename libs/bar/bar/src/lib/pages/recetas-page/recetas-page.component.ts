import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecetaService } from '../../data-access/receta.service';
import { Receta } from '../../models/receta.model';
import { DetalleRecetaComponent } from '../../components/detalle-receta/detalle-receta.component';
import { GestionRecetaComponent } from '../../components/gestion-receta/gestion-receta.component';
import { LucideIconComponent, PageHeaderComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-recetas-page',
  standalone: true,
  imports: [CommonModule, DetalleRecetaComponent, GestionRecetaComponent, LucideIconComponent, PageHeaderComponent],
  templateUrl: './recetas-page.component.html',
  styleUrl: './recetas-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecetasPageComponent implements OnInit {
  public recetaService = inject(RecetaService);

  searchTerm = signal<string>('');

  // Estado para los modales
  recetaSeleccionada = signal<Receta | null>(null);
  mostrarDetalle = signal<boolean>(false);
  mostrarGestion = signal<boolean>(false);

  recetasFiltradas = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.recetaService.recetas().filter(r =>
      r.nombreReceta.toLowerCase().includes(term) ||
      (r.nombreCategoria && r.nombreCategoria.toLowerCase().includes(term))
    );
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

  eliminarReceta(id: string) {
    if (confirm('¿Desea eliminar esta receta? Esta acción no se puede deshacer.')) {
      this.recetaService.eliminarReceta(id).subscribe({
        next: () => {
          alert('Receta eliminada correctamente');
          this.recetaService.listar();
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          alert('No se pudo eliminar la receta.');
        }
      });
    }
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }
}
