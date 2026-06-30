import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ButtonComponent, DataTableComponent, HasPermissionDirective } from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { RegistrarNotaCreditoModalComponent } from '../../../components/registrar-nota-credito-modal/registrar-nota-credito-modal.component';
import { FacturasFacade } from '../../../data-access/facturas.facade';
import { InventarioFacade } from '../../../data-access/inventario.facade';
import { ConciliacionGilDiferencia, FacturaLinea, RegistrarNotaCreditoRequest } from '../../../models/facturas.model';
import { Bien } from '../../../models/inventario.model';

/** Sentinel del backend para líneas de factura sin bien de catálogo asignado. */
const PRODUCTO_PENDIENTE = 'PENDIENTE-CATALOGO';

@Component({
  selector: 'restaurant-factura-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ButtonComponent, DataTableComponent, HasPermissionDirective, BackButtonComponent, RegistrarNotaCreditoModalComponent],
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
  gilBienes            = this.facade.gilBienes;

  observaciones   = signal<Record<string, string>>({});
  gilParaVincular = signal('');

  // ── Editor de conteo físico (rehacer conciliación con cantidades reales) ──
  mostrarConteo  = signal(false);
  /** Conteo recibido editable, keyed por productoId. Pre-cargado con lo facturado. */
  conteoRecibido = signal<Record<string, number | null>>({});

  constructor() {
    // Cargar los ítems del GIL conciliado para poder re-conciliar con conteo físico.
    effect(() => {
      const c = this.conciliacionGil();
      if (c?.gilId) this.facade.cargarGilBienes(c.gilId);
    });
  }

  /** Conteo físico por defecto = lo facturado (editable en un flujo posterior). */
  private buildConteoMap(): Record<string, number> {
    const map: Record<string, number> = {};
    this.gilBienes().forEach(b => {
      if (b.productoId) map[b.productoId] = b.cantidad;
    });
    return map;
  }

  showConfirmVerificar  = signal(false);
  showConfirmPagada     = signal(false);

  // ── Nota crédito modal ────────────────────────────────────────────────────
  notaCreditoModalAbierto  = signal(false);
  diferenciaNotaCredito    = signal<ConciliacionGilDiferencia | null>(null);

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
    const gilId = (event.target as HTMLSelectElement).value;
    this.gilParaVincular.set(gilId);
    if (gilId) this.facade.cargarGilBienes(gilId); // pre-carga ítems para el conteo
  }

  vincularGil(): void {
    const factura = this.factura();
    const gilId   = this.gilParaVincular();
    if (!factura || !gilId) return;
    this.facade.conciliarFacturaGil(String(factura.id), gilId, this.buildConteoMap());
    this.gilParaVincular.set('');
  }

  /** Abre el editor de conteo físico, precargando cada ítem con lo facturado (editable). */
  abrirConteo(): void {
    const init: Record<string, number | null> = {};
    this.gilBienes().forEach(b => { if (b.productoId) init[b.productoId] = b.cantidad; });
    this.conteoRecibido.set(init);
    this.mostrarConteo.set(true);
  }

  cerrarConteo(): void {
    this.mostrarConteo.set(false);
  }

  setConteo(productoId: string, event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    const num = raw === '' ? null : Number(raw);
    const val = num === null || Number.isNaN(num) || num < 0 ? null : num;
    this.conteoRecibido.update(c => ({ ...c, [productoId]: val }));
  }

  /** Re-concilia la factura con su GIL actual usando el conteo físico editado. */
  confirmarConteoYConciliar(): void {
    const factura = this.factura();
    const c = this.conciliacionGil();
    if (!factura || !c?.gilId) return;
    const map: Record<string, number> = {};
    for (const [productoId, val] of Object.entries(this.conteoRecibido())) {
      if (val !== null) map[productoId] = val;
    }
    this.facade.conciliarFacturaGil(String(factura.id), c.gilId, map);
    this.mostrarConteo.set(false);
  }

  estaConciliada(diferencias: ConciliacionGilDiferencia[]): boolean {
    return diferencias.length === 0 || diferencias.every(d => d.resuelta);
  }

  /**
   * Clasifica el tipo de diferencia para mostrarlo como badge.
   * Espeja el orden de ramas del backend (DetalleConciliacion.comparar).
   */
  tipoDiferencia(dif: ConciliacionGilDiferencia): { label: string; clase: string } {
    if (dif.cantidadRecibida === null)              return { label: 'Falta conteo',      clase: 'badge--surface' };
    if (dif.cantidadGil === 0 && dif.cantidadRecibida > 0) return { label: 'No solicitado', clase: 'badge--tertiary' };
    if (dif.cantidadRecibida > dif.cantidadFactura) return { label: 'Exceso recepción',  clase: 'badge--orange' };
    if (dif.cantidadRecibida < dif.cantidadFactura) return { label: 'Sobre-facturación', clase: 'badge--tertiary' };
    if (dif.cantidadRecibida < dif.cantidadGil)     return { label: 'Entrega corta',     clase: 'badge--orange' };
    return { label: 'Dif. precio/IVA', clase: 'badge--surface' };
  }

  countPendientes(diferencias: ConciliacionGilDiferencia[]): number {
    return diferencias.filter(d => !d.resuelta).length;
  }

  esSobrefacturacion(dif: ConciliacionGilDiferencia): boolean {
    return (
      dif.cantidadRecibida !== null &&
      dif.cantidadRecibida < dif.cantidadFactura
    );
  }

  abrirNotaCreditoModal(dif: ConciliacionGilDiferencia): void {
    this.diferenciaNotaCredito.set(dif);
    this.notaCreditoModalAbierto.set(true);
  }

  cerrarNotaCreditoModal(): void {
    this.notaCreditoModalAbierto.set(false);
    this.diferenciaNotaCredito.set(null);
  }

  onConfirmarNotaCredito(req: RegistrarNotaCreditoRequest): void {
    const c = this.conciliacionGil();
    const dif = this.diferenciaNotaCredito();
    if (!c || !dif) return;

    this.cerrarNotaCreditoModal();
    this.facade.registrarNotaCredito(req).subscribe(nc => {
      if (nc?.id) {
        this.facade.resolverConNotaCredito(c.id, dif.gilItemId, [nc.id]);
      }
    });
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
