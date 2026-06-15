import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { FacturasFacade } from '../../../data-access/facturas.facade';
import { FacturaLinea } from '../../../models/facturas.model';
import { BienGilResponse } from '../../../data-access/api/procurement.api';

export type ImportStatus = 'idle' | 'loading' | 'success' | 'error';

@Component({
  selector: 'restaurant-factura-import',
  standalone: true,
  imports: [RouterModule, BackButtonComponent],
  templateUrl: './factura-import.component.html',
  styleUrl: './factura-import.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacturaImportPageComponent implements OnInit {
  private facade = inject(FacturasFacade);
  private router = inject(Router);

  isDragOver = signal(false);
  fileName = signal('');
  gilId = signal('');
  localError = signal<string | null>(null);

  facturaImportada        = this.facade.facturaImportada;
  gilesDisponibles        = this.facade.gilesDisponibles;
  conciliacionImportacion = this.facade.conciliacionImportacion;
  gilBienes               = this.facade.gilBienes;
  loading = this.facade.loading;
  error = computed(() => this.localError() ?? this.facade.error());
  importStatus = computed<ImportStatus>(() => {
    if (this.loading() && this.fileName()) return 'loading';
    if (this.facturaImportada()) return 'success';
    if (this.error() && this.fileName()) return 'error';
    return 'idle';
  });
  conciliacionError = computed(() => this.facturaImportada() ? this.facade.error() : null);
  fileLoaded = computed(() => this.facturaImportada() !== null);
  canConciliar = computed(() => !!this.facturaImportada() && !!this.gilId() && !this.conciliacionImportacion());
  totalItems = computed(() => this.facturaImportada()?.lineas.length ?? 0);
  totalIvaPorTarifa = computed(() => this.groupIva(this.facturaImportada()?.lineas ?? []));
  showManualMapping = computed(() => this.fileLoaded() && this.gilBienes().length > 0);

  manualLinks = signal<(number | null)[]>([]);
  cantidadesRecibidas = signal<(number | null)[]>([]);

  missingCounts = computed(() =>
    this.gilBienes().some((_, i) => this.cantidadesRecibidas()[i] === null)
  );

  // ── Wizard de pasos ─────────────────────────────────────────────────────────
  readonly pasos = [
    { n: 1, label: 'Subir XML' },
    { n: 2, label: 'Revisar datos' },
    { n: 3, label: 'Vincular y cruzar' },
    { n: 4, label: 'Resultado' },
  ];
  paso = signal(1);
  // Latches: el auto-avance ocurre UNA sola vez por hito, así "Atrás" no rebota.
  private latchImport = false;
  private latchConciliar = false;

  /** Un paso es alcanzable solo si su precondición de datos se cumple. */
  puedeAvanzar(n: number): boolean {
    if (n <= 1) return true;
    if (n === 2 || n === 3) return !!this.facturaImportada();
    if (n === 4) return !!this.conciliacionImportacion();
    return false;
  }

  irAPaso(n: number): void {
    if (n >= 1 && n <= this.pasos.length && this.puedeAvanzar(n)) this.paso.set(n);
  }
  siguiente(): void { this.irAPaso(this.paso() + 1); }
  atras(): void { this.paso.update(p => Math.max(1, p - 1)); }

  constructor() {
    // Auto-avance guiado: al importar → paso 2; al conciliar → paso 4.
    effect(() => {
      const factura = this.facturaImportada();
      const conciliacion = this.conciliacionImportacion();
      if (factura && !this.latchImport) {
        this.latchImport = true;
        this.paso.set(2);
      }
      if (conciliacion && !this.latchConciliar) {
        this.latchConciliar = true;
        this.paso.set(4);
      }
    });

    effect(() => {
      const bienes = this.gilBienes();
      const factura = this.facturaImportada();
      if (bienes.length > 0 && factura) {
        const links = this.buildAutoLinks(bienes, factura.lineas);
        this.manualLinks.set(links);
        // Pre-llenar el conteo con la cantidad de la línea FEL matcheada (caso común:
        // se recibió lo facturado). Editable si hubo faltante. Evita el dead-end de
        // conciliar con conteo nulo. Fallback: la cantidad del ítem GIL.
        this.cantidadesRecibidas.set(bienes.map((bien, i) => {
          const felIdx = links[i];
          const felLinea = (felIdx !== null && felIdx !== undefined) ? factura.lineas[felIdx] : undefined;
          return felLinea?.cantidad ?? bien.cantidad ?? null;
        }));
      } else {
        this.manualLinks.set([]);
        this.cantidadesRecibidas.set([]);
      }
    });
  }

  ngOnInit(): void {
    this.facade.cargarGilesDisponibles();
  }

  onDragOver(e: DragEvent): void {
    e.preventDefault();
    this.isDragOver.set(true);
  }

  onDragLeave(): void {
    this.isDragOver.set(false);
  }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.isDragOver.set(false);
    const file = e.dataTransfer?.files[0];
    if (file) this.processFile(file);
  }

  onFileInput(e: Event): void {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.processFile(file);
  }

  onGilSelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.gilId.set(select.value);
    this.facade.cargarGilBienes(select.value);
  }

  onCantidadRecibidaChange(i: number, event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    const num = raw === '' ? null : Number(raw);
    const val = num === null || Number.isNaN(num) || num < 0 ? null : num;
    this.cantidadesRecibidas.update(c => {
      const copy = [...c];
      copy[i] = val;
      return copy;
    });
  }

  onLinkChange(gilIdx: number, event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    const felIdx = val === '' ? null : Number(val);
    this.manualLinks.update(links => {
      const copy = [...links];
      copy[gilIdx] = felIdx;
      return copy;
    });
  }

  getLinea(felIdx: number): FacturaLinea | undefined {
    return this.facturaImportada()?.lineas[felIdx];
  }

  matchStatus(gilIdx: number): 'ok' | 'diferencia' | 'sin-asignar' {
    const felIdx = this.manualLinks()[gilIdx];
    if (felIdx === null || felIdx === undefined) return 'sin-asignar';
    const gil = this.gilBienes()[gilIdx];
    const fel = this.getLinea(felIdx);
    if (!fel) return 'sin-asignar';
    const cantOk = Math.abs(gil.cantidad - fel.cantidad) < 0.001;
    const precioOk = Math.abs(gil.valorUnitario - fel.precioUnitario) < 1;
    return cantOk && precioOk ? 'ok' : 'diferencia';
  }

  matchStatusLabel(gilIdx: number): string {
    const s = this.matchStatus(gilIdx);
    if (s === 'ok') return 'Coincide';
    if (s === 'diferencia') return 'Diferencia';
    return 'Sin asignar';
  }

  matchStatusClass(gilIdx: number): string {
    const s = this.matchStatus(gilIdx);
    if (s === 'ok') return 'badge badge--green';
    if (s === 'diferencia') return 'badge badge--orange';
    return 'badge badge--gray';
  }

  matchRowClass(gilIdx: number): string {
    const s = this.matchStatus(gilIdx);
    if (s === 'diferencia') return 'match-row--diferencia';
    if (s === 'sin-asignar') return 'match-row--sin-asignar';
    return '';
  }

  private buildAutoLinks(bienes: BienGilResponse[], lineas: FacturaLinea[]): (number | null)[] {
    return bienes.map(bien => {
      const gilDesc = this.normalizeDesc(bien.descripcion);
      const idx = lineas.findIndex(l => {
        const felDesc = this.normalizeDesc(l.descripcion);
        return felDesc.includes(gilDesc) || gilDesc.includes(felDesc);
      });
      return idx >= 0 ? idx : null;
    });
  }

  private normalizeDesc(s: string): string {
    return s.toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  goBack(): void {
    this.router.navigate(['/app/inventario/facturas']);
  }

  viewImportedFactura(): void {
    const factura = this.facturaImportada();
    if (!factura) return;
    this.router.navigate(['/app/inventario/facturas', factura.id]);
  }

  onConciliar(): void {
    const factura = this.facturaImportada();
    if (!factura || !this.gilId()) return;

    const cantidadesMap: Record<string, number> = {};
    let droppedCount = false;
    this.gilBienes().forEach((bien, i) => {
      const val = this.cantidadesRecibidas()[i];
      if (val === null) return;
      if (!bien.productoId) { droppedCount = true; return; }
      cantidadesMap[bien.productoId] = val;
    });

    if (droppedCount) {
      this.localError.set('Algunos conteos no se enviaron: ítems sin producto vinculado.');
    }

    this.facade.conciliarEnImportacion(String(factura.id), this.gilId(), cantidadesMap);
  }

  resetImport(): void {
    this.fileName.set('');
    this.gilId.set('');
    this.localError.set(null);
    this.latchImport = false;
    this.latchConciliar = false;
    this.paso.set(1);
    this.facade.limpiarImportacionFactura();
  }

  formatMoney(value: number | undefined): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 2,
    }).format(value ?? 0);
  }

  ivaBadgeClass(iva: number | undefined): string {
    if ((iva ?? 0) <= 0) return 'badge badge--gray';
    if ((iva ?? 0) <= 5) return 'badge badge--orange';
    return 'badge badge--dark';
  }

  private processFile(file: File): void {
    this.fileName.set(file.name);
    this.localError.set(null);
    this.facade.limpiarImportacionFactura();

    const isValidSize = file.size <= 10 * 1024 * 1024;
    if (!isValidSize) {
      this.localError.set('El archivo supera el límite de 10 MB.');
      return;
    }

    const normalizedGilId = this.gilId().trim();
    const ext = file.name.toLowerCase().split('.').pop();

    if (ext !== 'xml') {
      this.localError.set('Para importación XML seleccioná un archivo .xml');
      return;
    }
    this.facade.importarFacturaFelXml(file, normalizedGilId || undefined);
  }

  private groupIva(lineas: FacturaLinea[]): Array<{ porcentaje: number; valor: number }> {
    const grouped = new Map<number, number>();

    for (const linea of lineas) {
      const porcentaje = linea.porcentajeIva ?? linea.iva ?? 0;
      const current = grouped.get(porcentaje) ?? 0;
      grouped.set(porcentaje, current + (linea.valorIva ?? 0));
    }

    return Array.from(grouped.entries())
      .map(([porcentaje, valor]) => ({ porcentaje, valor }))
      .sort((a, b) => a.porcentaje - b.porcentaje);
  }
}
