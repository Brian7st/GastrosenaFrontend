import { ChangeDetectionStrategy, Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Factura, FacturaFormDto } from '../../../models/facturas.model';

@Component({
  selector: 'restaurant-factura-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './factura-form.component.html',
  styleUrl: './factura-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacturaFormComponent {
  @Output() close = new EventEmitter<void>();
  @Output() save  = new EventEmitter<FacturaFormDto>();

  // Form model
  numeroFactura    = signal('');
  fechaEmision     = signal('');
  fechaVencimiento = signal('');
  proveedorNit     = signal('');
  nitReceptor      = signal('');
  gilVinculado     = signal('');
  instructorId     = signal('Carlos Ruiz (Autocompletado)');
  valorRetencionZese = signal(0.625);
  ordenCompra      = signal('');
  
  // Datos Bancarios
  banco = signal('');
  tipoCuenta = signal('');
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
      fechaEmision: this.fechaEmision(),
      fechaVencimiento: this.fechaVencimiento() || undefined,
      proveedorNit: this.proveedorNit(),
      nitReceptor: this.nitReceptor(),
      gilVinculado: this.gilVinculado() || undefined,
      instructorId: this.instructorId(),
      valorRetencionZese: this.valorRetencionZese(),
      ordenCompra: this.ordenCompra() || undefined,
    });
  }

  onOverlayClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close.emit();
    }
  }
}
