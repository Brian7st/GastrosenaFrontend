import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ButtonComponent, DataTableComponent } from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { FacturasFacade } from '../../../data-access/facturas.facade';
import { InventarioFacade } from '../../../data-access/inventario.facade';
import { ConciliacionGilDiferencia, FacturaLinea } from '../../../models/facturas.model';
import { Bien } from '../../../models/inventario.model';

/** Sentinel del backend para líneas de factura sin bien de catálogo asignado. */
const PRODUCTO_PENDIENTE = 'PENDIENTE-CATALOGO';

@Component({
  selector: 'restaurant-factura-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ButtonComponent, DataTableComponent, BackButtonComponent],
  templateUrl: './factura-detail.component.html',
  styleUrl: './factura-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacturaDetailPageComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private facade = inject(FacturasFacade);
  private inventario = inject(InventarioFacade);

  factura              = this.facade.facturaSeleccionada;
  loading              = this.facade.loading;
  conciliacionGil      = this.facade.conciliacionGil;
  conciliacionCargada  = this.facade.conciliacionCargada;
  gilesDisponibles     = this.facade.gilesDisponibles;

  observaciones   = signal<Record<string, string>>({});
  gilParaVincular = signal('');

  showConfirmVerificar  = signal(false);
  showConfirmPagada     = signal(false);

  // ── Buscador de bien para asociar líneas pendientes ──
  buscadorBienAbierto  = signal(false);
  lineaPendienteActiva = signal<string | null>(null);
  bienAConfirmar       = signal<Bien | null>(null);
  catalogoBienes       = this.inventario.bienes;
  catalogoLoading      = this.inventario.loading;

  /** Líneas de la factura que aún no tienen bien de catálogo asignado. */
  lineasPendientes = computed<FacturaLinea[]>(() =>
    (this.factura()?.lineas ?? []).filter(l => this.esPendiente(l)));

  esPendiente(linea: FacturaLinea): boolean {
    return linea.productoId === PRODUCTO_PENDIENTE;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.facade.cargarFactura(id);
      this.facade.intentarCargarConciliacion(id);
      this.facade.cargarGilesDisponibles();
    }
  }

  setObservacion(gilItemId: string, event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.observaciones.update(o => ({ ...o, [gilItemId]: val }));
  }

  resolverDiferencia(gilItemId: string): void {
    const c = this.conciliacionGil();
    if (!c) return;
    const obs = this.observaciones()[gilItemId] ?? '';
    if (!obs.trim()) return; // observation required — don't send empty string to backend
    this.facade.resolverDiferenciaGil(c.id, gilItemId, obs);
    this.observaciones.update(o => { const next = { ...o }; delete next[gilItemId]; return next; });
  }

  abrirBuscadorBien(descripcion: string): void {
    this.lineaPendienteActiva.set(descripcion);
    this.buscadorBienAbierto.set(true);
    this.inventario.cargarBienes({ estado: 'Activo', page: 0, size: 8 });
  }

  onBuscarBienCatalogo(term: string): void {
    this.inventario.cargarBienes({ estado: 'Activo', busqueda: term, page: 0, size: 8 });
  }

  cerrarBuscadorBien(): void {
    this.buscadorBienAbierto.set(false);
    this.lineaPendienteActiva.set(null);
    this.bienAConfirmar.set(null);
  }

  /** Paso 1: elegir un bien pide confirmación antes de asociar. */
  onBienCatalogoSeleccionado(bien: Bien): void {
    this.bienAConfirmar.set(bien);
  }

  /** Volver del paso de confirmación a la lista de resultados. */
  volverABuscar(): void {
    this.bienAConfirmar.set(null);
  }

  /** Paso 2: confirmar la asociación línea FEL → bien elegido. */
  confirmarAsociacion(): void {
    const factura = this.factura();
    const descripcion = this.lineaPendienteActiva();
    const codigo = (this.bienAConfirmar()?.codigoSena ?? '').trim();
    if (!factura || !descripcion || !codigo) return;
    this.facade.resolverLineaPendiente(String(factura.id), descripcion, codigo);
    this.cerrarBuscadorBien();
  }

  irACrearBien(): void {
    this.router.navigate(['/app/inventario/bienes']);
  }

  onGilVincularChange(event: Event): void {
    this.gilParaVincular.set((event.target as HTMLSelectElement).value);
  }

  vincularGil(): void {
    const factura = this.factura();
    const gilId   = this.gilParaVincular();
    if (!factura || !gilId) return;
    this.facade.conciliarFacturaGil(String(factura.id), gilId);
    this.gilParaVincular.set('');
  }

  estaConciliada(diferencias: ConciliacionGilDiferencia[]): boolean {
    return diferencias.length === 0 || diferencias.every(d => d.resuelta);
  }

  countPendientes(diferencias: ConciliacionGilDiferencia[]): number {
    return diferencias.filter(d => !d.resuelta).length;
  }

  confirmarVerificar(): void {
    const factura = this.factura();
    if (!factura) return;
    this.showConfirmVerificar.set(false);
    this.facade.verificarFactura(String(factura.id));
  }

  confirmarPagada(): void {
    const factura = this.factura();
    if (!factura) return;
    this.showConfirmPagada.set(false);
    this.facade.marcarPagada(String(factura.id));
  }

  onCopiarCufe(cufe: string | undefined): void {
    if (cufe) navigator.clipboard.writeText(cufe);
  }

  descargarOImprimir(): void {
    window.print();
  }

  goBack(): void {
    this.router.navigate(['/app/inventario/facturas']);
  }
}
