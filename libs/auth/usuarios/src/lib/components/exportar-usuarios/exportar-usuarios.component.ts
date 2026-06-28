import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  computed,
  inject,
  signal,
} from '@angular/core';
import { LucideIconComponent } from '@restaurant/shared/ui';
import { I18nService } from '../../i18n/i18n.service';
import { ExportarConfig } from '../../models/usuarios.model';

const ROL_OPCIONES: { value: string; label: string; tKey: string }[] = [
  { value: '',              label: 'Todos los roles',  tKey: 'exportar.todos_roles' },
  { value: 'ADMINISTRADOR', label: 'Administrador',    tKey: 'exportar.admin' },
  { value: 'CHEF',          label: 'Chef',             tKey: 'exportar.chef' },
  { value: 'MESERO',        label: 'Mesero',           tKey: 'exportar.mesero' },
  { value: 'BARTENDER',     label: 'Bartender',        tKey: 'exportar.bartender' },
  { value: 'CAJERO',        label: 'Cajero',           tKey: 'exportar.cajero' },
  { value: 'CONTADORA',     label: 'Contadora',        tKey: 'exportar.contadora' },
  { value: 'INSTRUCTOR',    label: 'Instructor',       tKey: 'exportar.instructor' },
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
  protected readonly i18n = inject(I18nService);
  @Input({ required: true }) totalUsuarios!: number;
  @Output() cerrar   = new EventEmitter<void>();
  @Output() exportar = new EventEmitter<ExportarConfig>();

  readonly formato          = signal<'excel' | 'csv'>('excel');
  readonly incluirInactivos = signal(false);
  readonly filtroRol        = signal('');
  readonly rolOpciones      = computed(() =>
    ROL_OPCIONES.map(o => ({ value: o.value, label: this.i18n.t(o.tKey) })),
  );

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
