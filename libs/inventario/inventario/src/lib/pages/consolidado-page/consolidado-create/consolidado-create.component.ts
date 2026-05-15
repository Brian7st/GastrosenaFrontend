import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent, DataTableComponent, StatusBadgeComponent } from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';

interface GilItem {
  id: string;
  codigo: string;
  instructor: string;
  programa: string;
  ficha: string;
  fecha: string;
  valor: number;
  estado: 'Disponible' | 'En otro consolidado';
  consolidadoRef?: string;
  selected: boolean;
}

@Component({
  selector: 'restaurant-consolidado-create',
  standalone: true,
  imports: [CommonModule, ButtonComponent, DataTableComponent, StatusBadgeComponent, BackButtonComponent],
  templateUrl: './consolidado-create.component.html',
  styleUrl: './consolidado-create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsolidadoCreateComponent {
  private router = inject(Router);
  private location = inject(Location);

  gils: GilItem[] = [
    { id: '1', codigo: 'GIL-2024-012', instructor: 'Ricardo Martínez', programa: 'Cocina', ficha: '2541010', fecha: '15/04/2024', valor: 844900, estado: 'Disponible', selected: true },
    { id: '2', codigo: 'GIL-2024-015', instructor: 'Ana Lucia Gómez', programa: 'Repostería', ficha: '2541022', fecha: '16/04/2024', valor: 1200000, estado: 'Disponible', selected: true },
    { id: '3', codigo: 'GIL-2023-998', instructor: 'Julián Prada', programa: 'Sistemas', ficha: '2541030', fecha: '10/01/2024', valor: 540000, estado: 'En otro consolidado', consolidadoRef: '#CON-2024-001', selected: false },
  ];

  get subtotalNeto(): number {
    return this.gils.filter(g => g.selected && g.estado === 'Disponible').reduce((acc, curr) => acc + curr.valor, 0);
  }

  get ivaAcumulado(): number {
    return this.subtotalNeto * 0.19;
  }

  get retencionZese(): number {
    return this.subtotalNeto * 0.00625;
  }

  get totalConsolidado(): number {
    return this.subtotalNeto + this.ivaAcumulado - this.retencionZese;
  }

  get selectedCount(): number {
    return this.gils.filter(g => g.selected && g.estado === 'Disponible').length;
  }

  toggleSelection(gil: GilItem): void {
    if (gil.estado !== 'Disponible') return;
    gil.selected = !gil.selected;
  }

  toggleAll(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.gils.forEach(g => {
      if (g.estado === 'Disponible') {
        g.selected = isChecked;
      }
    });
  }

  get allSelected(): boolean {
    const disponibles = this.gils.filter(g => g.estado === 'Disponible');
    return disponibles.length > 0 && disponibles.every(g => g.selected);
  }

  goBack(): void {
    this.location.back();
  }

  confirmar(): void {
    console.log('Generando Consolidado con:', this.gils.filter(g => g.selected));
    this.router.navigate(['/app/inventario/consolidado']);
  }
}
