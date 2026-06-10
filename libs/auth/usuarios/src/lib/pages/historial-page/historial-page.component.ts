import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import {
  DataTableComponent,
  EmptyStateComponent,
  LoadingSkeletonComponent,
  LucideIconComponent,
  PageHeaderComponent,
  SearchFilterComponent,
  SelectFilterComponent,
} from '@restaurant/shared/ui';
import { UsuariosFacade } from '../../data-access/usuarios.facade';
import { I18nService } from '../../i18n/i18n.service';
import { HistorialItem } from '../../models/usuarios.model';

@Component({
  selector: 'restaurant-historial-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    DataTableComponent,
    EmptyStateComponent,
    LoadingSkeletonComponent,
    LucideIconComponent,
    PageHeaderComponent,
    SearchFilterComponent,
    SelectFilterComponent,
  ],
  templateUrl: './historial-page.component.html',
  styleUrl:    './historial-page.component.scss',
})
export class HistorialPageComponent implements OnInit {
  protected readonly i18n = inject(I18nService);
  private readonly facade = inject(UsuariosFacade);

  readonly historial = toSignal(this.facade.historial$,        { initialValue: [] as HistorialItem[] });
  readonly loading   = toSignal(this.facade.loadingHistorial$, { initialValue: false });

  readonly busqueda     = signal('');
  readonly filtroAccion = signal('');

  readonly accionOpciones: { value: string; label: string; tKey: string }[] = [
    { value: '',         label: 'Todas las acciones', tKey: 'historial.accion_todas' },
    { value: 'LOGIN',    label: 'Inicio de sesión',   tKey: 'historial.accion_login'  },
    { value: 'LOGOUT',   label: 'Cierre de sesión',   tKey: 'historial.accion_logout' },
    { value: 'CREAR',    label: 'Creación',            tKey: 'historial.accion_crear'  },
    { value: 'EDITAR',   label: 'Edición',             tKey: 'historial.accion_editar' },
    { value: 'ELIMINAR', label: 'Eliminación',         tKey: 'historial.accion_eliminar' },
    { value: 'BLOQUEO',  label: 'Bloqueo',             tKey: 'historial.accion_bloqueo' },
  ];

  readonly accionOpcionesTranslated = computed(() =>
    this.accionOpciones.map(o => ({ value: o.value, label: this.i18n.t(o.tKey) })),
  );

  readonly historialFiltrado = computed(() => {
    const q      = this.busqueda().toLowerCase();
    const accion = this.filtroAccion();
    return this.historial().filter(item => {
      const matchBusq   = !q || item.usuarioNombre.toLowerCase().includes(q) ||
                                item.usuarioEmail.toLowerCase().includes(q);
      const matchAccion = !accion || item.accion === accion;
      return matchBusq && matchAccion;
    });
  });

  ngOnInit(): void {
    this.facade.cargarHistorial();
  }

  getAccionClass(accion: string): string {
    return accion.toLowerCase();
  }
}
