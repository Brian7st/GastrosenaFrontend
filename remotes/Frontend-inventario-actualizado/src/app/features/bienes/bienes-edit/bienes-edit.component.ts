import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideIconComponent } from '../../../shared/components/lucide-icon.component';
import { Bien, BIENES_MOCK } from '../models/bien.model';

@Component({
    selector: 'app-bienes-edit',
    imports: [CommonModule, RouterModule, FormsModule, LucideIconComponent],
    templateUrl: './bienes-edit.component.html',
    styleUrls: ['./bienes-edit.component.scss']
})
export class BienesEditComponent {
  bien = signal<Bien>({ ...BIENES_MOCK[0] });

  categorias = ['Equipos de Cómputo', 'Papelería', 'Mobiliario', 'Cocina', 'Herramientas'];
  estados = ['Activo', 'Bajo Stock', 'Inactivo'];

  incrementStock(): void {
    const b = this.bien();
    this.bien.set({ ...b, stock: b.stock + 1 });
  }

  decrementStock(): void {
    const b = this.bien();
    if (b.stock > 0) {
      this.bien.set({ ...b, stock: b.stock - 1 });
    }
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('es-CO');
  }

  guardar(): void {
    console.log('Bien actualizado:', this.bien());
  }
}
