import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { FacturasFacade } from '../../../data-access/facturas.facade';
import { FacturaLinea } from '../../../models/facturas.model';

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

    const isPdf = file.name.toLowerCase().endsWith('.pdf');
    const isValidSize = file.size <= 10 * 1024 * 1024;

    if (!isPdf) {
      this.localError.set('Solo se aceptan archivos en formato PDF.');
      return;
    }

    if (!isValidSize) {
      this.localError.set('El archivo supera el límite de 10 MB.');
      return;
    }

    const normalizedGilId = this.gilId().trim();
    this.facade.importarFacturaFel(file, normalizedGilId || undefined);
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
