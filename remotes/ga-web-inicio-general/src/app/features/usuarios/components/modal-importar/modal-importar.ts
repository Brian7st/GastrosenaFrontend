import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-importar',
  imports: [CommonModule],
  templateUrl: './modal-importar.html',
  styleUrl: './modal-importar.scss'
})
export class ModalImportar {
  @Output() cerrar   = new EventEmitter<void>();
  @Output() importado = new EventEmitter<void>();

  archivo:   File | null = null;
  loading    = false;
  errorMsg   = '';
  successMsg = '';

  onArchivoSeleccionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.archivo   = input.files[0];
      this.errorMsg  = '';
      this.successMsg = '';
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) { this.archivo = file; }
  }

  onDragOver(event: DragEvent): void { event.preventDefault(); }

  iniciarImportacion(): void {
    if (!this.archivo) { this.errorMsg = 'Selecciona un archivo primero.'; return; }
    this.loading = true;
    // Simulado — conectar al endpoint cuando esté disponible
    setTimeout(() => {
      this.loading    = false;
      this.successMsg = `✅ ${this.archivo?.name} importado correctamente.`;
      setTimeout(() => { this.importado.emit(); this.cerrar.emit(); }, 1500);
    }, 2000);
  }

  get nombreArchivo(): string { return this.archivo?.name ?? ''; }
}
