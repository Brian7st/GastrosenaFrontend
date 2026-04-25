import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpiEstadisticas } from '../../../../core/models/estadisticas.model';
import { Comanda } from '../../../../core/models/comanda.model';

@Component({
  selector: 'app-estadisticas-exportar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estadisticas-exportar.component.html',
  styleUrls: ['./estadisticas-exportar.component.scss']
})
export class EstadisticasExportarComponent {
  @Input({ required: true }) kpis!: KpiEstadisticas;
  @Input({ required: true }) comandas: Comanda[] = [];

  // Pequeños "getters" para calcular los totales al vuelo
  get totalOrdenes(): number {
    return this.comandas.length;
  }

  get ordenesCompletadas(): number {
    // Asumimos que "Pagado" significa completado
    return this.comandas.filter(c => c.estado === 'Pagado').length;
  }
}
