import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RendimientoMesero } from '../../../../core/models/estadisticas.model';

@Component({
  selector: 'app-estadisticas-rendimiento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estadisticas-rendimiento.component.html',
  styleUrls: ['./estadisticas-rendimiento.component.scss']
})
export class EstadisticasRendimientoComponent {
  // Recibimos los datos de los meseros
  @Input({ required: true }) rendimiento: RendimientoMesero[] = [];
}
