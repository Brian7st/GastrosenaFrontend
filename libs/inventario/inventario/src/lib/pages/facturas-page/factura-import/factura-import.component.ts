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

  constructor() {
    effect(() => {
      const bienes = this.gilBienes();
      const factura = this.facturaImportada();
      if (bienes.length > 0 && factura) {
        this.manualLinks.set(this.buildAutoLinks(bienes, factura.lineas));
      } else {
        this.manualLinks.set([]);
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
    this.facade.conciliarEnImportacion(String(factura.id), this.gilId());
  }

  resetImport(): void {
    this.fileName.set('');
    this.gilId.set('');
    this.localError.set(null);
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
