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
  ConfirmDialogComponent
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
    EmptyStateComponent,
    ConfirmDialogComponent
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
  searchQueryGestionMesas = signal<string>('');
  
  // ── Estado local de la vista principal ───────────────────────────────────────
  searchQueryMain = signal<string>('');

  filteredMesasActivasMain = computed(() => {
    const q = this.searchQueryMain().toLowerCase();
    return this.mesasActivas().filter(m => m.nombre.toLowerCase().includes(q));
  });

  filteredMesasActivasModal = computed(() => {
    const q = this.searchQueryGestionMesas().toLowerCase();
    return this.mesasActivas().filter(m => m.nombre.toLowerCase().includes(q));
  });
  
  filteredMesasInactivasModal = computed(() => {
    const q = this.searchQueryGestionMesas().toLowerCase();
    return this.mesasInactivas().filter(m => m.nombre.toLowerCase().includes(q));
  });

  // ── Mesas en servicio (Ocupadas / Por pagar) ──────────────────────────────────
  mesasEnServicio = computed(() => {
    const meseros = ['Juan Pérez', 'Ana Gómez', 'Carlos Ruiz', 'María López', 'Luisa Fernanda'];
    return this.mesasActivas()
      .filter(m => m.estado === 'OCUPADA' || m.estado === 'POR_PAGAR')
      .map(m => {
        // Generador determinista simple basado en id para asignar mesero mock
        const index = m.id.charCodeAt(0) % meseros.length;
        return { ...m, meseroAsignado: meseros[index] };
      });
  });

  // ── Signals para CREAR mesa (MesaCreateRequest) ──────────────────────────────
  nuevoNombre    = signal<string>('');
  nuevaCapacidad = signal<number | null>(null);
  nuevaZona      = signal<string>('');

  // ── Signals para EDITAR mesa (MesaUpdateRequest) — se pre-llenan al abrir ──
  editNombre    = signal<string>('');
  editCapacidad = signal<number>(4);
  editZona      = signal<string>('');

  // ── Opciones de Zona (Autocomplete) ──────────────────────────────────────────
  opcionesZonas = ['Salón Principal', 'Terraza', 'Salón VIP', 'Barra'];
  
  showNuevaZonaDropdown = signal(false);
  filteredNuevaZonas = computed(() => {
    const q = this.nuevaZona().toLowerCase();
    if (!q) return this.opcionesZonas;
    return this.opcionesZonas.filter(z => z.toLowerCase().includes(q));
  });

  showEditZonaDropdown = signal(false);
  filteredEditZonas = computed(() => {
    const q = this.editZona().toLowerCase();
    if (!q) return this.opcionesZonas;
    return this.opcionesZonas.filter(z => z.toLowerCase().includes(q));
  });

  selectZona(zona: string, tipo: 'nueva' | 'editar') {
    if (tipo === 'nueva') {
      this.nuevaZona.set(zona);
      this.showNuevaZonaDropdown.set(false);
    } else {
      this.editZona.set(zona);
      this.showEditZonaDropdown.set(false);
    }
  }

  onBlurZona(tipo: 'nueva' | 'editar') {
    setTimeout(() => {
      if (tipo === 'nueva') this.showNuevaZonaDropdown.set(false);
      else this.showEditZonaDropdown.set(false);
    }, 150);
  }

  // ── Apertura / cierre de modales ─────────────────────────────────────────────
  abrirModal(nombre: string, mesa: Mesa | null = null) {
    this.modalActivo.set(nombre);
    this.mesaSeleccionada.set(mesa);

    if (nombre === 'agregar') {
      // Resetear formulario de creación
      this.nuevoNombre.set('');
      this.nuevaCapacidad.set(null);
      this.nuevaZona.set('');
    } else if (nombre === 'editar' && mesa) {
      // Pre-llenar formulario de edición con los datos actuales de la mesa
      this.mesaSeleccionada.set(mesa);
      const nombreLimpio = mesa.nombre.toUpperCase().startsWith('MESA ') 
        ? mesa.nombre.substring(5) 
        : mesa.nombre;
      this.editNombre.set(nombreLimpio);
      this.editCapacidad.set(mesa.capacidad);
      this.editZona.set(mesa.zona || '');
    } else if (nombre === 'gestion-mesas') {
      this.tabActivo.set('desactivar');
      this.searchQueryGestionMesas.set('');
    }
  }

  cerrarModales() {
    this.modalActivo.set(null);
    this.mesaSeleccionada.set(null);
    
    // Limpiar estados de autocompletado y búsqueda
    this.showNuevaZonaDropdown.set(false);
    this.showEditZonaDropdown.set(false);
    this.searchQueryGestionMesas.set('');
  }

  // ── Modal de alertas y notificaciones ────────────────────────────────────────
  alertDialog = signal<{open: boolean, title: string, message: string, type: 'success' | 'error'}>({
    open: false,
    title: '',
    message: '',
    type: 'error'
  });
  
  cerrarAlertDialog() {
    this.alertDialog.update(state => ({...state, open: false}));
  }

  mostrarExito(mensaje: string) {
    this.alertDialog.set({ open: true, title: '¡Éxito!', message: mensaje, type: 'success' });
  }

  mostrarError(mensaje: string) {
    this.alertDialog.set({ open: true, title: 'Atención', message: mensaje, type: 'error' });
  }

  // ── CREAR ────────────────────────────────────────────────────────────────────
  crearMesa() {
    const rawNombre = this.nuevoNombre().trim();
    const nombre    = rawNombre ? `MESA ${rawNombre}` : '';
    let capacidad   = this.nuevaCapacidad();
    const zona      = this.nuevaZona().trim();

    // Si no se llena la capacidad, por defecto será 1
    if (capacidad === null || capacidad === undefined || capacidad.toString().trim() === '') {
      capacidad = 1;
    }
    
    capacidad = Number(capacidad);

    if (!rawNombre) {
      this.mostrarError('El número o identificador de la mesa es obligatorio.');
      return;
    }
    if (capacidad < 1 || capacidad > 20 || isNaN(capacidad)) {
      this.mostrarError('La capacidad debe ser entre 1 y 20 personas.');
      return;
    }

    this.facade.agregarMesa(nombre, capacidad, zona);
    this.cerrarModales();
    this.mostrarExito(`La mesa "${nombre}" ha sido creada correctamente.`);
  }

  // ── EDITAR ───────────────────────────────────────────────────────────────────
  guardarEdicion() {
    const mesa = this.mesaSeleccionada();
    if (!mesa) return;

    const rawNombre = this.editNombre().trim();
    const nombre    = rawNombre ? `MESA ${rawNombre}` : '';
    const capacidad = this.editCapacidad();
    const zona      = this.editZona().trim();

    if (!rawNombre) {
      alert('El número o identificador de la mesa es obligatorio.');
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

  // ── CONTROLES DE CAPACIDAD ───────────────────────────────────────────────────
  incrementarCapacidad(tipo: 'nueva' | 'editar') {
    if (tipo === 'nueva') {
      const actual = this.nuevaCapacidad() || 1;
      if (actual < 20) this.nuevaCapacidad.set(actual + 1);
    } else {
      const actual = this.editCapacidad() || 1;
      if (actual < 20) this.editCapacidad.set(actual + 1);
    }
  }

  decrementarCapacidad(tipo: 'nueva' | 'editar') {
    if (tipo === 'nueva') {
      const actual = this.nuevaCapacidad() || 1;
      if (actual > 1) this.nuevaCapacidad.set(actual - 1);
    } else {
      const actual = this.editCapacidad() || 1;
      if (actual > 1) this.editCapacidad.set(actual - 1);
    }
  }

  // ── ACCIONES DE ESTADO ───────────────────────────────────────────────────────
  abrirMesa(id: string) {
    this.facade.abrirMesa(id, '', 1);
    this.cerrarModales();
    this.router.navigate(['../pedidos'], { relativeTo: this.route });
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
  soloNumeros(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    // Solo permitir números (códigos 48 a 57)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

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
