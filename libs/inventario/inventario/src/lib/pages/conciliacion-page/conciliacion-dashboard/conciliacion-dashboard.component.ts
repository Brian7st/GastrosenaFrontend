import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideIconComponent } from '@restaurant/shared/ui';
import { ButtonComponent } from '@restaurant/shared/ui';
import { KpiCardComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-conciliacion-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideIconComponent,
    ButtonComponent,
    KpiCardComponent,
  ],
  templateUrl: './conciliacion-dashboard.component.html',
  styleUrl: './conciliacion-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConciliacionDashboardComponent {
  // Mock data based on the prototype
  tendencias = [
    { mes: 'Ene', valor: 60, isCurrent: false },
    { mes: 'Feb', valor: 50, isCurrent: false },
    { mes: 'Mar', valor: 55, isCurrent: false },
    { mes: 'Abr', valor: 40, isCurrent: false },
    { mes: 'May', valor: 30, isCurrent: false },
    { mes: 'Jun', valor: 25, isCurrent: true },
  ];

  actividades = [
    {
      id: 1,
      ubicacion: 'Cocina Principal',
      detalle: 'Conciliación cerrada por Ana M.',
      tiempo: 'Hace 10 min',
      estado: 'ok',
    },
    {
      id: 2,
      ubicacion: 'Almacén de Insumos',
      detalle: 'Ajuste de inventario (#AJ-102)',
      tiempo: 'Hace 45 min',
      estado: 'neutral',
    },
    {
      id: 3,
      ubicacion: 'Bodega Refrigerados',
      detalle: 'Toma física iniciada',
      tiempo: 'Hace 2 horas',
      estado: 'neutral',
    },
    {
      id: 4,
      ubicacion: 'Área de Carnes',
      detalle: 'Discrepancia detectada > 5%',
      tiempo: 'Ayer, 16:30',
      estado: 'alert',
    },
  ];

  categorias = [
    {
      nombre: 'Abarrotes',
      icono: 'box', // valid lucide icon
      estado: 'Última toma: Hace 2 días',
      tipo: 'normal',
    },
    {
      nombre: 'Lácteos',
      icono: 'coffee',
      estado: 'Última toma: Hoy, 08:30 AM',
      tipo: 'normal',
    },
    {
      nombre: 'Carnes',
      icono: 'utensils',
      estado: 'Revisión requerida',
      tipo: 'alert',
    },
    {
      nombre: 'Frutas-Vegetales',
      icono: 'package-open',
      estado: 'Última toma: Ayer',
      tipo: 'normal',
    },
  ];
}
