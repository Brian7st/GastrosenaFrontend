import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideIconComponent } from '@restaurant/shared/ui';
import { ButtonComponent } from '@restaurant/shared/ui';
import { DataTableComponent } from '@restaurant/shared/ui';
import { KpiCardComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-conciliacion-historial',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideIconComponent,
    ButtonComponent,
    DataTableComponent,
    KpiCardComponent,
  ],
  templateUrl: './conciliacion-historial.component.html',
  styleUrl: './conciliacion-historial.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConciliacionHistorialComponent {
  
  registros = [
    {
      id: 'CONC-001',
      fecha: '12 Oct, 08:30',
      ubicacion: 'Cocina Principal',
      itemsTotal: 145,
      itemsDif: 12,
      precision: 92,
      estado: 'Completada',
      estadoColor: 'success',
    },
    {
      id: 'CONC-002',
      fecha: '11 Oct, 14:15',
      ubicacion: 'Bodega Refrigerados',
      itemsTotal: 89,
      itemsDif: 3,
      precision: 97,
      estado: 'En Proceso',
      estadoColor: 'info',
    },
    {
      id: 'CONC-003',
      fecha: '10 Oct, 09:00',
      ubicacion: 'Almacén Seco',
      itemsTotal: 320,
      itemsDif: 45,
      precision: 86,
      estado: 'Pendiente Ajustes',
      estadoColor: 'warning',
    },
  ];

  topDiferencias = [
    { producto: 'Aceite Vegetal', dif: '-15 L', icon: 'droplet' },
    { producto: 'Azúcar Refinada', dif: '-8 Kg', icon: 'package' },
    { producto: 'Carne de Res', dif: '-5 Kg', icon: 'beef' },
  ];

}
