import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpiEstadisticas } from '../../../../core/models/estadisticas.model';

@Component({
  selector: 'app-estadisticas-kpis',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estadisticas-kpis.component.html',
  styleUrls: ['./estadisticas-kpis.component.scss']
})
export class EstadisticasKpisComponent {
  // Exigimos que quien use este componente le pase los datos sí o sí
  @Input({ required: true }) datos!: KpiEstadisticas;
}
