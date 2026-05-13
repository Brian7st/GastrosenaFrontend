import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideIconComponent } from '@restaurant/shared/ui';
import { ButtonComponent } from '@restaurant/shared/ui';

interface TomaFisicaItem {
  id: string;
  codigoSena: string;
  categoria: string;
  producto: string;
  stockSistema: number;
  conteoFisico: number | null;
  valorUnitario: number;
}

@Component({
  selector: 'restaurant-conciliacion-toma-fisica',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    LucideIconComponent,
    ButtonComponent,
  ],
  templateUrl: './conciliacion-toma-fisica.component.html',
  styleUrl: './conciliacion-toma-fisica.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConciliacionTomaFisicaComponent {
  fecha = '24 Oct 2023';
  responsable = 'Chef Instructor';

  items = signal<TomaFisicaItem[]>([
    {
      id: '1',
      codigoSena: 'HRN-001',
      categoria: 'Abarrotes',
      producto: 'Harina de Trigo (Kg)',
      stockSistema: 150,
      conteoFisico: 150,
      valorUnitario: 3500,
    },
    {
      id: '2',
      codigoSena: 'LCH-042',
      categoria: 'Lácteos',
      producto: 'Leche Entera (L)',
      stockSistema: 85,
      conteoFisico: 80,
      valorUnitario: 4200,
    },
    {
      id: '3',
      codigoSena: 'CRN-112',
      categoria: 'Cárnicos',
      producto: 'Solomillo de Res (Kg)',
      stockSistema: 12,
      conteoFisico: 14,
      valorUnitario: 45000,
    },
    {
      id: '4',
      codigoSena: 'ESP-008',
      categoria: 'Especias',
      producto: 'Pimienta Negra (g)',
      stockSistema: 500,
      conteoFisico: null,
      valorUnitario: 150,
    },
  ]);

  // Computed signals
  itemsTotales = computed(() => this.items().length);
  
  itemsContados = computed(() => 
    this.items().filter(item => item.conteoFisico !== null).length
  );
  
  pendientesCount = computed(() => 
    this.itemsTotales() - this.itemsContados()
  );

  diferenciasCount = computed(() => 
    this.items().filter(item => item.conteoFisico !== null && item.conteoFisico !== item.stockSistema).length
  );

  precision = computed(() => {
    if (this.itemsContados() === 0) return 100;
    const itemsExactos = this.itemsContados() - this.diferenciasCount();
    return Math.round((itemsExactos / this.itemsContados()) * 100);
  });

  impactoFinanciero = computed(() => {
    return this.items().reduce((acc, item) => {
      if (item.conteoFisico === null) return acc;
      const dif = item.conteoFisico - item.stockSistema;
      return acc + (dif * item.valorUnitario);
    }, 0);
  });

  // Helpers
  getDiferencia(item: TomaFisicaItem): number | null {
    if (item.conteoFisico === null) return null;
    return item.conteoFisico - item.stockSistema;
  }

  getImpactoTotal(item: TomaFisicaItem): number | null {
    const dif = this.getDiferencia(item);
    if (dif === null) return null;
    return dif * item.valorUnitario;
  }

  // Update handler for reactivity
  updateConteoFisico(id: string, value: number | null) {
    this.items.update(items => 
      items.map(item => item.id === id ? { ...item, conteoFisico: value } : item)
    );
  }

  // UI Formatters
  formatCurrency(value: number | null): string {
    if (value === null) return '-';
    const isNegative = value < 0;
    const absValue = Math.abs(value);
    const formatted = new Intl.NumberFormat('es-CO').format(absValue);
    return isNegative ? `-$${formatted}` : `+$${formatted}`.replace('+$-', '-$').replace('+$0', '$0');
  }
}
