import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonComponent, DataTableComponent, KpiCardComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-consolidado-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent, DataTableComponent, KpiCardComponent],
  templateUrl: './consolidado-detail.component.html',
  styleUrl: './consolidado-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsolidadoDetailComponent {
  private router = inject(Router);

  // Mocks para la tabla de subtotales
  subtotales = [
    { cc: 'CC-001', area: 'Mantenimiento y Planta', categoria: 'Suministros de Oficina', subtotal: '$45,230,000' },
    { cc: 'CC-045', area: 'Formación Técnica', categoria: 'Material Didáctico', subtotal: '$82,100,500' },
    { cc: 'CC-012', area: 'Gestión Humana', categoria: 'Elementos de Seguridad', subtotal: '$15,169,500' }
  ];

  // Mocks para la tabla de ejecución detallada
  ejecucion = [
    { fecha: '12 Oct, 2023', factura: 'FAC-8902', cufe: 'A1B2C3...', cufeFull: 'A1B2C3D4E5F6', programa: 'Cocina', ficha: '2541010', codigo: 'CS-091', desc: 'Insumos Cárnicos', cant: 15, valorUnit: '$450,000', iva: '19%', subtotal: '$6,750,000', zese: '$0' },
    { fecha: '14 Oct, 2023', factura: 'FAC-8915', cufe: '9F8E7D...', cufeFull: '9F8E7D6C5B4A', programa: 'Sistemas', ficha: '2541022', codigo: 'IT-105', desc: 'Equipos de Cómputo', cant: 3, valorUnit: '$2,100,000', iva: '19%', subtotal: '$6,300,000', zese: '$0' }
  ];

  // Mocks para la tabla de formatos GIL
  gils = [
    { codigo: 'GIL-2023-F014-001', iniciales: 'RM', solicitante: 'Ricardo Martínez', programa: 'Cocina', cufe: 'A1B2C3...', cufeFull: 'A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6', fecha: '12 Oct, 2023', valor: '$12,450,000' },
    { codigo: 'GIL-2023-F014-002', iniciales: 'AL', solicitante: 'Ana Lucia Gómez', programa: 'Repostería', cufe: 'Z9Y8X7...', cufeFull: 'Z9Y8X7W6V5U4T3S2R1Q0P9O8N7M6L5K4', fecha: '14 Oct, 2023', valor: '$8,900,000' },
    { codigo: 'GIL-2023-F014-003', iniciales: 'JP', solicitante: 'Julián Prada', programa: 'Sistemas', cufe: '1A2B3C...', cufeFull: '1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P', fecha: '18 Oct, 2023', valor: '$23,750,000' },
    { codigo: 'GIL-2023-F014-004', iniciales: 'SC', solicitante: 'Sofía Cárdenas', programa: 'Mantenimiento', cufe: '9F8E7D...', cufeFull: '9F8E7D6C5B4A39281706A5B4C3D2E1F0', fecha: '20 Oct, 2023', valor: '$11,200,000' }
  ];

  goBack(): void {
    this.router.navigate(['/app/inventario/bienes']);
  }
}
