import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopMesa } from '../../../../core/models/estadisticas.model';

@Component({
  selector: 'app-estadisticas-top-mesas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estadisticas-top-mesas.component.html',
  styleUrls: ['./estadisticas-top-mesas.component.scss']
})
export class EstadisticasTopMesasComponent {
  @Input({ required: true }) mesas: TopMesa[] = [];
}
