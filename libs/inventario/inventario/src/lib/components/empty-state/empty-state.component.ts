import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Estado vacío reutilizable para listas y tablas del dominio inventario.
 * Muestra un ícono representativo, un título y un mensaje opcional.
 *
 * Uso en tabla: envolver en `<tr><td [attr.colspan]="N"><inventario-empty-state .../></td></tr>`.
 */
@Component({
  selector: 'inventario-empty-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateComponent {
  /** Ícono de Material Symbols que referencia lo que almacena la tabla. */
  @Input() icon = 'inbox';
  /** Título corto del estado vacío. */
  @Input() title = 'Sin registros';
  /** Mensaje secundario opcional (ej. "Ajustá los filtros de búsqueda"). */
  @Input() message = '';
}
