import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideIconComponent } from '@restaurant/shared/ui';
import { ButtonComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-conciliacion-detalle',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideIconComponent,
    ButtonComponent,
  ],
  templateUrl: './conciliacion-detalle.component.html',
  styleUrl: './conciliacion-detalle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConciliacionDetalleComponent {
  
  detalle = {
    id: 'CONC-2024-012',
    fecha: '24 Oct 2024',
    responsable: 'Carlos Ruiz',
    almacen: 'Almacén Seco',
    estado: 'Completada',
    totalItems: 120,
    itemsCorrectos: 112,
    diferencias: 8,
    precision: 93.3,
    valoracionMonetaria: -340000,
    perdidas: -320000,
    sobrantes: 20000,
  };

  diferenciasList = [
    {
      producto: 'Arroz Blanco Premium',
      codigo: 'COD-AB-001',
      categoria: 'Granos y Cereales',
      stockSis: '250 kg',
      fisico: '245 kg',
      dif: '-5 kg',
      valorUnit: 4000,
      impacto: -20000,
      isPositive: false,
    },
    {
      producto: 'Aceite de Oliva Extra Virgen',
      codigo: 'COD-AO-012',
      categoria: 'Aceites y Grasas',
      stockSis: '40 L',
      fisico: '35 L',
      dif: '-5 L',
      valorUnit: 60000,
      impacto: -300000,
      isPositive: false,
    },
    {
      producto: 'Sal Marina Fina',
      codigo: 'COD-SM-004',
      categoria: 'Especias y Condimentos',
      stockSis: '100 kg',
      fisico: '108 kg',
      dif: '+8 kg',
      valorUnit: 2500,
      impacto: 20000,
      isPositive: true,
    },
  ];

}
