import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';
import { LucideIconComponent } from '@restaurant/shared/ui';
import { ExportarConfig } from '../../models/usuarios.model';

const ROL_OPCIONES = [
  { value: '',              label: 'Todos los roles'  },
  { value: 'ADMINISTRADOR', label: 'Administrador'    },
  { value: 'CHEF',          label: 'Chef'             },
  { value: 'MESERO',        label: 'Mesero'           },
  { value: 'BARTENDER',     label: 'Bartender'        },
  { value: 'CAJERO',        label: 'Cajero'           },
  { value: 'CONTADORA',     label: 'Contadora'        },
  { value: 'INSTRUCTOR',    label: 'Instructor'       },
];

@Component({
  selector: 'restaurant-exportar-usuarios',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideIconComponent],
  templateUrl: './exportar-usuarios.component.html',
  styleUrl:    './exportar-usuarios.component.scss',
})
export class ExportarUsuariosComponent {
  @Input({ required: true }) totalUsuarios!: number;
  @Output() cerrar   = new EventEmitter<void>();
  @Output() exportar = new EventEmitter<ExportarConfig>();

  readonly formato          = signal<'excel' | 'csv'>('excel');
  readonly incluirInactivos = signal(false);
  readonly filtroRol        = signal('');
  readonly rolOpciones      = ROL_OPCIONES;

  onFormatoChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.formato.set(value as 'excel' | 'csv');
  }

  onRolChange(event: Event): void {
    this.filtroRol.set((event.target as HTMLSelectElement).value);
  }

  onInactivosChange(event: Event): void {
    this.incluirInactivos.set((event.target as HTMLInputElement).checked);
  }

  onExportar(): void {
    this.exportar.emit({
      formato:          this.formato(),
      incluirInactivos: this.incluirInactivos(),
      rol:              this.filtroRol(),
    });
  }
}
