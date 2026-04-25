import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideIconComponent } from '../../../shared/components/lucide-icon.component';
import { Bien, MovimientoBien, EspecificacionTecnica, BIENES_MOCK, MOVIMIENTOS_MOCK } from '../models/bien.model';

@Component({
    selector: 'app-bienes-detail',
    imports: [CommonModule, RouterModule, LucideIconComponent],
    templateUrl: './bienes-detail.component.html',
    styleUrls: ['./bienes-detail.component.scss']
})
export class BienesDetailComponent {
  bien = signal<Bien>(BIENES_MOCK[0]);
  movimientos = signal<MovimientoBien[]>(MOVIMIENTOS_MOCK);

  specs: EspecificacionTecnica[] = [
    { etiqueta: 'Procesador', valor: 'Intel Core i7 11th Gen' },
    { etiqueta: 'Memoria RAM', valor: '16GB DDR4' },
    { etiqueta: 'Almacenamiento', valor: '512GB SSD NVMe' },
    { etiqueta: 'Sistema Operativo', valor: 'Windows 11 Pro' },
    { etiqueta: 'Código Activo', valor: 'EQU-2024-001' },
    { etiqueta: 'Fecha Compra', valor: '12 Ene 2024' }
  ];

  formatCurrency(value: number): string {
    return '$' + value.toLocaleString('es-CO');
  }
}
