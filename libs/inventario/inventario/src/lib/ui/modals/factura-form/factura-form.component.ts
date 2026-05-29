import { ChangeDetectionStrategy, Component, EventEmitter, Output, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { FacturaFormDto } from '../../../models/facturas.model';
import type { InfoBancariaTipo } from '../../../data-access/api/sourcing.api';

@Component({
  selector: 'restaurant-factura-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './factura-form.component.html',
  styleUrl: './factura-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacturaFormComponent {
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() close = new EventEmitter<void>();
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() save  = new EventEmitter<FacturaFormDto>();

  // Form model
  numeroFactura    = signal('');
  cufe             = signal('');
  fechaEmision     = signal('');
  fechaRecepcion   = signal('');
  proveedorNit     = signal('');
  proveedorNombre  = signal('');
  proveedorBeneficiarioZese = signal(false);
  ordenCompra      = signal('');
  productoId       = signal('');
  descripcionLinea = signal('');
  cantidadLinea    = signal(1);
  precioLinea      = signal(0);
  porcentajeIvaLinea = signal(19);
  
  // Datos Bancarios
  banco = signal('');
  tipoCuenta = signal<InfoBancariaTipo | ''>('');
  numeroCuenta = signal('');

  archivosNombres = signal<string[]>([]);

  isDragOver = signal(false);

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
    const files = Array.from(e.dataTransfer?.files ?? []);
    this.archivosNombres.update(prev => [...prev, ...files.map(f => f.name)]);
  }

  onFileInput(e: Event): void {
    const files = Array.from((e.target as HTMLInputElement).files ?? []);
    this.archivosNombres.update(prev => [...prev, ...files.map(f => f.name)]);
  }

  removeFile(name: string): void {
    this.archivosNombres.update(prev => prev.filter(n => n !== name));
  }

  onSubmit(): void {
    this.save.emit({
      numeroFactura: this.numeroFactura(),
      cufe: this.cufe().trim(),
      fechaEmision: this.fechaEmision(),
      fechaRecepcion: this.fechaRecepcion(),
      proveedorNit: this.proveedorNit(),
      proveedorNombre: this.proveedorNombre(),
      proveedorBeneficiarioZese: this.proveedorBeneficiarioZese(),
      ordenCompra: this.ordenCompra() || undefined,
      infoBancariaBanco: this.banco() || undefined,
      infoBancariaCuenta: this.numeroCuenta() || undefined,
      infoBancariaTipo: this.tipoCuenta() || undefined,
      lineas: [
        {
          productoId: this.productoId() || undefined,
          descripcion: this.descripcionLinea(),
          cantidad: this.cantidadLinea(),
          precioUnitario: this.precioLinea(),
          porcentajeIva: this.porcentajeIvaLinea(),
        },
      ],
    });
  }

  onOverlayClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close.emit();
    }
  }
}
