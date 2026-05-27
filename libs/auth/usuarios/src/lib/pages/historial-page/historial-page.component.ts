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
  private readonly facade = inject(UsuariosFacade);

  readonly historial = toSignal(this.facade.historial$,        { initialValue: [] as HistorialItem[] });
  readonly loading   = toSignal(this.facade.loadingHistorial$, { initialValue: false });

  readonly busqueda     = signal('');
  readonly filtroAccion = signal('');

  readonly accionOpciones: { value: string; label: string }[] = [
    { value: '',         label: 'Todas las acciones' },
    { value: 'LOGIN',    label: 'Inicio de sesión'   },
    { value: 'LOGOUT',   label: 'Cierre de sesión'   },
    { value: 'CREAR',    label: 'Creación'            },
    { value: 'EDITAR',   label: 'Edición'             },
    { value: 'ELIMINAR', label: 'Eliminación'         },
    { value: 'BLOQUEO',  label: 'Bloqueo'             },
  ];

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
