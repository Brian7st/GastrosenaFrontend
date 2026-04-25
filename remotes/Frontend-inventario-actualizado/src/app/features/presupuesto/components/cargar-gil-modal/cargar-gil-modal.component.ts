import { Component, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideIconComponent } from '../../../../shared/components/lucide-icon.component';
import { GilDocumento, MOCK_GIL_DOCUMENTOS } from '../../models/presupuesto.model';

@Component({
    selector: 'app-cargar-gil-modal',
    imports: [CommonModule, FormsModule, LucideIconComponent],
    templateUrl: './cargar-gil-modal.component.html',
    styleUrl: './cargar-gil-modal.component.scss'
})
export class CargarGilModalComponent {
  @Output() close = new EventEmitter<void>();

  documentos = signal<GilDocumento[]>(MOCK_GIL_DOCUMENTOS);
  seleccionados = signal<string[]>([]);
  busqueda = signal<string>('');

  docsFiltrados = computed(() => {
    const term = this.busqueda().toLowerCase();
    return this.documentos().filter(d => d.codigo.toLowerCase().includes(term));
  });

  erroresCount = computed(() => {
    return this.documentos().filter(d => d.estado === 'error').length;
  });

  montoSeleccionado = computed(() => {
    return this.documentos()
      .filter(d => this.seleccionados().includes(d.id))
      .reduce((acc, curr) => acc + curr.monto, 0);
  });

  toggleSeleccion(id: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.seleccionados.update(prev => [...prev, id]);
    } else {
      this.seleccionados.update(prev => prev.filter(item => item !== id));
    }
  }

  isSeleccionado(id: string): boolean {
    return this.seleccionados().includes(id);
  }

  formatCurrency(value: number): string {
    return '$' + value.toLocaleString('es-CO');
  }

  cerrarModal() {
    this.close.emit();
  }

  comprometer() {
    console.log('Comprometiendo GILs:', this.seleccionados());
    this.close.emit();
  }
}
