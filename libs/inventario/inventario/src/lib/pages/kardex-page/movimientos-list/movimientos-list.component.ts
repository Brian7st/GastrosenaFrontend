import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { KpiCardComponent, DataTableComponent, LucideIconComponent, ButtonComponent, StatusBadgeComponent } from '@restaurant/shared/ui';
import { KardexFacade } from '../../../data-access/kardex.facade';

@Component({
  selector: 'restaurant-movimientos-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    KpiCardComponent,
    DataTableComponent,
    LucideIconComponent,
    ButtonComponent,
    StatusBadgeComponent
  ],
  templateUrl: './movimientos-list.component.html',
  styleUrl: './movimientos-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovimientosListComponent implements OnInit {
  private facade = inject(KardexFacade);

  // ── Estado reactivo desde facade ─────────────────────────────────────────
  movimientos = this.facade.movimientos;
  loading     = this.facade.loading;

  ngOnInit(): void {
    this.facade.loadAll();
  }

  getVariant(estado: string): 'success' | 'warning' | 'danger' | 'info' {
    switch (estado) {
      case 'Completado':  return 'success';
      case 'Pendiente':   return 'warning';
      case 'Cancelado':   return 'danger';
      default:            return 'info';
    }
  }

  getTipoLabel(tipo: string): string {
    const map: Record<string, string> = {
      ENTRADA:    'Entrada',
      SALIDA:     'Salida',
      RESERVA:    'Reserva',
      LIBERACION: 'Liberación',
      AJUSTE:     'Ajuste',
    };
    return map[tipo] ?? tipo;
  }
}
