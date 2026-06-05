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
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
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
  mesas = this.facade.mesas;
  mesasCargando = this.facade.mesasCargando;
  mesasError = this.facade.mesasError;
  mesasActivas = computed(() => this.mesas().filter(m => m.activo));
  mesasInactivas = computed(() => this.mesas().filter(m => !m.activo));
  stats = this.facade.stats;

  // ── Estado local del modal ───────────────────────────────────────────────────
  modalActivo = signal<string | null>(null);
  mesaSeleccionada = signal<Mesa | null>(null);
  tabActivo        = signal<'desactivar' | 'activar'>('desactivar');
  searchQueryGestionMesas = signal<string>('');
  
  // ── Estado local de la vista principal ───────────────────────────────────────
  searchQueryMain = signal<string>('');

  filteredMesasActivasMain = computed(() => {
    return this.mesasActivas().filter(m => this._matchMesa(m.nombre, this.searchQueryMain()));
  });

  private _sortMesas(mesas: Mesa[]): Mesa[] {
    return [...mesas].sort((a, b) => {
      const numA = parseInt(a.nombre.replace(/\D/g, ''), 10) || 0;
      const numB = parseInt(b.nombre.replace(/\D/g, ''), 10) || 0;
      return numA - numB;
    });
  }

  filteredMesasLibres = computed(() => {
    return this._sortMesas(this.filteredMesasActivasMain().filter(m => m.estado === 'LIBRE'));
  });

  filteredMesasOcupadas = computed(() => {
    return this._sortMesas(this.filteredMesasActivasMain().filter(m => m.estado === 'OCUPADA'));
  });

  filteredMesasPorPagar = computed(() => {
    return this._sortMesas(this.filteredMesasActivasMain().filter(m => m.estado === 'POR_PAGAR'));
  });

  filteredMesasActivasModal = computed(() => {
    return this.mesasActivas().filter(m => this._matchMesa(m.nombre, this.searchQueryGestionMesas()));
  });

  filteredMesasInactivasModal = computed(() => {
    return this.mesasInactivas().filter(m => this._matchMesa(m.nombre, this.searchQueryGestionMesas()));
  });

  private _matchMesa(nombreMesa: string, query: string): boolean {
    const q = query.toLowerCase().trim();
    if (!q) return true;

    const nombre = nombreMesa.toLowerCase();
    const cleanNombre = nombre.replace(/^mesa\s*/, '');
    const cleanQuery = q.replace(/^mesa\s*/, '');

    const esNumeroNombre = /^\d+$/.test(cleanNombre);
    const esNumeroQuery = /^\d+$/.test(cleanQuery);

    if (esNumeroNombre && esNumeroQuery) {
      const numNombre = parseInt(cleanNombre, 10).toString();
      const numQuery = parseInt(cleanQuery, 10).toString();
      return numNombre.includes(numQuery);
    }

    return cleanNombre.includes(cleanQuery) || nombre.includes(q);
  }

  // ── Mesas en servicio (Ocupadas / Por pagar) ──────────────────────────────────
  mesasEnServicio = computed(() => {
    const meseros = [
      'M01 - Juan Pérez', 
      'M02 - Ana Gómez', 
      'M03 - Carlos Ruiz', 
      'M04 - María López', 
      'M05 - Luisa Fernanda'
    ];
    return this.mesasActivas()
      .filter(m => m.estado === 'OCUPADA' || m.estado === 'POR_PAGAR')
      .map(m => {
        const index = m.id.charCodeAt(0) % meseros.length;
        return { ...m, meseroAsignado: meseros[index] };
      });
  });

  // ── Signals para CREAR mesa (MesaCreateRequest) ──────────────────────────────
  nuevoNombre = signal<string>('');
  nuevaCapacidad = signal<number | null>(1);
  nuevaZona = signal<string>('');

  // ── Signals para EDITAR mesa (MesaUpdateRequest) — se pre-llenan al abrir ──
  editNombre = signal('');
  editCapacidad = signal(1);
  editZona = signal('');
  editObservaciones = signal('');

  // ── Opciones de Zona (Autocomplete) ──────────────────────────────────────────
  opcionesZonas = ['Salón Principal', 'Terraza', 'Salón VIP', 'Barra'];

  showNuevaZonaDropdown = signal(false);
  filteredNuevaZonas = computed(() => {
    const q = this.nuevaZona().toLowerCase().trim();
    if (!q || this.opcionesZonas.some(z => z.toLowerCase() === q)) {
      return this.opcionesZonas;
    }
    return this.opcionesZonas.filter(z => z.toLowerCase().includes(q));
  });

  showEditZonaDropdown = signal(false);
  filteredEditZonas = computed(() => {
    const q = this.editZona().toLowerCase().trim();
    if (!q || this.opcionesZonas.some(z => z.toLowerCase() === q)) {
      return this.opcionesZonas;
    }
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
    }, 200);
  }

  // ── Signals para ABRIR mesa ──────────────────────────────────────────────────
  comensales = signal<number>(1);

  // ── Apertura / cierre de modales ─────────────────────────────────────────────
  abrirModal(nombre: string, mesa: Mesa | null = null) {
    this.modalActivo.set(nombre);
    this.mesaSeleccionada.set(mesa);

    if (nombre === 'agregar') {
      this.nuevoNombre.set('');
      this.nuevaCapacidad.set(1);
      this.nuevaZona.set('');
    } else if (nombre === 'editar' && mesa) {
      this.mesaSeleccionada.set(mesa);
      const nombreLimpio = mesa.nombre.toUpperCase().startsWith('MESA ') 
        ? mesa.nombre.substring(5) 
        : mesa.nombre;
      this.editNombre.set(nombreLimpio);
      this.editCapacidad.set(mesa.capacidad);
      this.editZona.set(mesa.zona || '');
      this.editObservaciones.set(mesa.observaciones || '');
    } else if (nombre === 'abrir' && mesa) {
      this.comensales.set(1);
    } else if (nombre === 'gestion-mesas') {
      this.tabActivo.set('desactivar');
      this.searchQueryGestionMesas.set('');
    }
  }

  cerrarModales() {
    this.modalActivo.set(null);
    this.mesaSeleccionada.set(null);
    
    this.showNuevaZonaDropdown.set(false);
    this.showEditZonaDropdown.set(false);
    this.searchQueryGestionMesas.set('');
  }

  // ── Modal de alertas y notificaciones ────────────────────────────────────────
  alertDialog = signal<{
    open: boolean,
    title: string,
    message: string,
    type: 'success' | 'error' | 'confirm',
    confirmText?: string,
    cancelText?: string,
    onConfirm?: () => void,
    onCancel?: () => void
  }>({
    open: false,
    title: '',
    message: '',
    type: 'error'
  });
  
  cerrarAlertDialog() {
    const state = this.alertDialog();
    if (state.onCancel) {
      state.onCancel();
    }
    this.alertDialog.update(s => ({...s, open: false}));
  }

  confirmAlertDialog() {
    const state = this.alertDialog();
    if (state.onConfirm) {
      state.onConfirm();
    }
    this.alertDialog.update(s => ({...s, open: false}));
  }

  mostrarExito(mensaje: string) {
    this.alertDialog.set({ open: true, title: '¡Éxito!', message: mensaje, type: 'success' });
  }

  mostrarError(mensaje: string) {
    this.alertDialog.set({ open: true, title: 'Atención', message: mensaje, type: 'error' });
  }

  pedirConfirmacion(title: string, message: string, onConfirm: () => void) {
    this.alertDialog.set({
      open: true,
      title,
      message,
      type: 'confirm',
      confirmText: 'Aceptar',
      cancelText: 'Cancelar',
      onConfirm
    });
  }

  // ── CREAR ────────────────────────────────────────────────────────────────────
  crearMesa() {
    const rawNombre = this.nuevoNombre().trim();
    const nombre    = rawNombre ? `MESA ${rawNombre}` : '';
    let capacidad   = this.nuevaCapacidad();
    const zona      = this.nuevaZona().trim();

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
    const zona = this.editZona().trim();
    const obs = this.editObservaciones().trim();
    const obsCambiada = obs !== (mesa.observaciones || '');

    if (!rawNombre) {
      this.mostrarError('El número o identificador de la mesa es obligatorio.');
      return;
    }
    if (capacidad < 1 || capacidad > 20) {
      this.mostrarError('La capacidad debe ser entre 1 y 20 personas.');
      return;
    }

    this.cerrarModales();
    this.facade.editarMesa(mesa.id, {
      nombre,
      capacidad,
      zona: zona || null,
      observaciones: obs || null,
    });

    if (obs && obsCambiada) {
      if (mesa.estado !== 'LIBRE') {
        this.mostrarExito('Observaciones actualizadas, pero la mesa no se desactivó porque está ocupada.');
      } else {
        this.facade.cambiarEstadoActivoMesa(mesa.id, false);
        this.mostrarExito('Mesa actualizada y desactivada por daños/observaciones.');
      }
    } else {
      this.mostrarExito('Mesa actualizada correctamente.');
    }
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

  incrementarComensales() {
    const actual = Number(this.comensales()) || 1;
    const max = Number(this.mesaSeleccionada()?.capacidad) || 20;
    if (actual < max) this.comensales.set(actual + 1);
  }

  decrementarComensales() {
    const actual = Number(this.comensales()) || 1;
    if (actual > 1) this.comensales.set(actual - 1);
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
    const mesa = this.facade.mesas().find(m => m.id === id);
    if (mesa && (mesa.estado === 'OCUPADA' || mesa.estado === 'POR_PAGAR')) {
      this.facade.cargarPedidoDeMesaOcupada(id).subscribe({
        next: (exito) => {
          if (exito) {
            this.router.navigate(['../pedidos'], { relativeTo: this.route });
          } else {
            this.pedirConfirmacion(
              'Mesa sin comanda activa',
              `La mesa figura como ${mesa.estado}, pero no tiene ningún pedido en curso.\n\n¿Deseas forzar su liberación para corregir este problema?`,
              () => {
                this.facade.liberarMesa(id);
              }
            );
          }
        }
      });
    } else {
      this.facade.seleccionarMesaParaPedido(id);
      this.router.navigate(['../pedidos'], { relativeTo: this.route });
    }
  }

  liberarMesa(id: string) {
    this.cerrarModales();
    this.facade.liberarMesa(id);
  }

  // ── ACTIVAR / DESACTIVAR ─────────────────────────────────────────────────────
  cambiarEstadoMesa(id: string, activo: boolean) {
    if (!activo) {
      const mesa = this.facade.mesas().find(m => m.id === id);
      if (mesa && mesa.estado !== 'LIBRE') {
        this.mostrarError('No se puede desactivar una mesa que está ocupada o por pagar.');
        return;
      }

      this.pedirConfirmacion(
        'Desactivar mesa',
        '¿Desactivar esta mesa? Quedará oculta del salón.',
        () => {
          this.facade.cambiarEstadoActivoMesa(id, activo);
        }
      );
    } else {
      this.facade.cambiarEstadoActivoMesa(id, activo);
    }
  }

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
