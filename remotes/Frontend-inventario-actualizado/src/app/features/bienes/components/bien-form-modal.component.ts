import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideIconComponent } from '../../../shared/components/lucide-icon.component';

@Component({
    selector: 'app-bien-form-modal',
    imports: [CommonModule, FormsModule, LucideIconComponent],
    templateUrl: './bien-form-modal.component.html',
    styleUrls: ['./bien-form-modal.component.scss']
})
export class BienFormModalComponent {
  @Output() cerrar = new EventEmitter<void>();

  form = {
    codigoSena: '',
    codigoProveedor: '',
    nombre: '',
    kilosUm: 0,
    factorConversion: 1,
    proveedor: '',
    valorNeto: 0,
    iva: 19
  };

  get valorConIva(): number {
    return this.form.valorNeto * (1 + this.form.iva / 100);
  }

  formatCurrency(value: number): string {
    return '$ ' + value.toLocaleString('es-CO', { minimumFractionDigits: 2 });
  }

  onSubmit(): void {
    // Conectar con backend
    console.log('Bien guardado:', this.form);
    this.cerrar.emit();
  }

  close(): void {
    this.cerrar.emit();
  }
}
