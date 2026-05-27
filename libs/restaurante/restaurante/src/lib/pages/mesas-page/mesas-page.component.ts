import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  PageHeaderComponent, 
  KpiCardComponent, 
  CardComponent, 
  StatusBadgeComponent, 
  ButtonComponent,
  LucideIconComponent,
  EmptyStateComponent,
} from '@restaurant/shared/ui';
import { Router, ActivatedRoute } from '@angular/router';
import { RestauranteFacade } from '../../data-access/restaurante.facade';
import { Mesa } from '../../models/restaurante.model';

@Component({
  selector: 'restaurant-mesas-page',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    PageHeaderComponent, 
    KpiCardComponent, 
    CardComponent, 
    StatusBadgeComponent, 
    ButtonComponent,
    LucideIconComponent,
    EmptyStateComponent
  ],
  templateUrl: './mesas-page.component.html',
  styleUrl: './mesas-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MesasPageComponent {
  private facade = inject(RestauranteFacade);
  private router  = inject(Router);
  private route   = inject(ActivatedRoute);

  // ── Signals del Facade ──────────────────────────────────────────────────────
  mesas          = this.facade.mesas;
  mesasCargando  = this.facade.mesasCargando;
  mesasError     = this.facade.mesasError;
  mesasActivas   = computed(() => this.mesas().filter(m => m.activo));
  mesasInactivas = computed(() => this.mesas().filter(m => !m.activo));
  stats          = this.facade.stats;

  // ── Estado local del modal ───────────────────────────────────────────────────
  modalActivo      = signal<string | null>(null);
  mesaSeleccionada = signal<Mesa | null>(null);
  tabActivo        = signal<'desactivar' | 'activar'>('desactivar');

  // ── Signals para CREAR mesa (MesaCreateRequest) ──────────────────────────────
  nuevoNombre    = signal<string>('');
  nuevaCapacidad = signal<number>(4);
  nuevaZona      = signal<string>('');

  // ── Signals para EDITAR mesa (MesaUpdateRequest) — se pre-llenan al abrir ──
  editNombre    = signal<string>('');
  editCapacidad = signal<number>(4);
  editZona      = signal<string>('');

  // ── Signals para ABRIR mesa ──────────────────────────────────────────────────
  comensales    = signal<number>(1);

  // ── Apertura / cierre de modales ─────────────────────────────────────────────
  abrirModal(nombre: string, mesa: Mesa | null = null) {
    this.modalActivo.set(nombre);
    this.mesaSeleccionada.set(mesa);

    if (nombre === 'agregar') {
      // Resetear formulario de creación
      this.nuevoNombre.set('');
      this.nuevaCapacidad.set(4);
      this.nuevaZona.set('');
    } else if (nombre === 'editar' && mesa) {
      this.editNombre.set(mesa.nombre);
      this.editCapacidad.set(mesa.capacidad);
      this.editZona.set(mesa.zona ?? '');
    } else if (nombre === 'abrir' && mesa) {
      this.comensales.set(1);
    } else if (nombre === 'gestion-mesas') {
      this.tabActivo.set('desactivar');
    }
  }

  cerrarModales() {
    this.modalActivo.set(null);
    this.mesaSeleccionada.set(null);
  }

  // ── CREAR ────────────────────────────────────────────────────────────────────
  crearMesa() {
    const nombre    = this.nuevoNombre().trim();
    const capacidad = this.nuevaCapacidad();
    const zona      = this.nuevaZona().trim();

    if (!nombre) {
      alert('El nombre de la mesa es obligatorio.');
      return;
    }
    if (capacidad < 1 || capacidad > 20) {
      alert('La capacidad debe ser entre 1 y 20 personas.');
      return;
    }

    // Cierra el modal inmediatamente para dar feedback visual rápido;
    // el signal _mesas del Facade se actualiza cuando el backend confirme.
    this.cerrarModales();
    this.facade.agregarMesa(nombre, capacidad, zona);
  }

  // ── EDITAR ───────────────────────────────────────────────────────────────────
  guardarEdicion() {
    const mesa = this.mesaSeleccionada();
    if (!mesa) return;

    const nombre    = this.editNombre().trim();
    const capacidad = this.editCapacidad();
    const zona      = this.editZona().trim();

    if (!nombre) {
      alert('El nombre de la mesa es obligatorio.');
      return;
    }
    if (capacidad < 1 || capacidad > 20) {
      alert('La capacidad debe ser entre 1 y 20 personas.');
      return;
    }

    this.cerrarModales();
    this.facade.editarMesa(mesa.id, {
      nombre,
      capacidad,
      zona: zona || null,
    });
  }

  // ── ACCIONES DE ESTADO ───────────────────────────────────────────────────────
  abrirMesa(id: string) {
    const comensales = this.comensales();
    this.facade.abrirMesa(id, '', comensales);
    this.cerrarModales();
    this.router.navigate(['../pedidos'], { 
      relativeTo: this.route,
      state: { comensales: comensales, mesaId: id }
    });
  }

  verPedido(id: string) {
    this.facade.seleccionarMesaParaPedido(id);
    this.router.navigate(['../pedidos'], { relativeTo: this.route });
  }

  liberarMesa(id: string) {
    this.cerrarModales();
    this.facade.liberarMesa(id);
  }

  // ── ACTIVAR / DESACTIVAR ─────────────────────────────────────────────────────
  /**
   * Llama a /activar o /desactivar según el flag.
   * Para la acción de desactivar se pide confirmación antes de llamar al backend.
   */
  cambiarEstadoMesa(id: string, activo: boolean) {
    if (!activo) {
      const ok = confirm('¿Desactivar esta mesa? Quedará oculta del salón.');
      if (!ok) return;
    }
    this.facade.cambiarEstadoActivoMesa(id, activo);
  }

  /** Alias para el flujo de "eliminar" de la tarjeta (mapea a desactivar). */
  eliminarMesa(id: string) {
    this.cambiarEstadoMesa(id, false);
    this.cerrarModales();
  }

  recargarMesas() {
    this.facade.cargarMesas();
  }

  // ── Helpers de UI ────────────────────────────────────────────────────────────
  getBadgeType(estado: string): 'info' | 'success' | 'warning' | 'danger' {
    switch (estado) {
      case 'LIBRE':     return 'success';
      case 'OCUPADA':   return 'danger';
      case 'POR_PAGAR': return 'warning';
      case 'INACTIVA':  return 'info';
      default:          return 'info';
    }
  }
}
