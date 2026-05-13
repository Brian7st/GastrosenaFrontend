import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Rol } from '@restaurant/shared/models';
import {
  DataTableComponent,
  KpiCardComponent,
  LucideIconComponent,
  SearchFilterComponent,
  SelectFilterComponent,
} from '@restaurant/shared/ui';
import { ExportarUsuariosComponent } from '../../components/exportar-usuarios/exportar-usuarios.component';
import { ImportarUsuariosComponent } from '../../components/importar-usuarios/importar-usuarios.component';
import { UsuariosFacade } from '../../data-access/usuarios.facade';
import {
  ExportarConfig,
  ImportarUsuariosRequest,
  UsuarioDetalle,
} from '../../models/usuarios.model';

const ROL_OPCIONES_FILTRO = [
  { value: '',                    label: 'Todos los roles'  },
  { value: Rol.ADMINISTRADOR,     label: 'Administrador'    },
  { value: Rol.CHEF,              label: 'Chef'             },
  { value: Rol.MESERO,            label: 'Mesero'           },
  { value: Rol.BARTENDER,         label: 'Bartender'        },
  { value: Rol.CAJERO,            label: 'Cajero'           },
  { value: Rol.CONTADORA,         label: 'Contadora'        },
  { value: Rol.INSTRUCTOR,        label: 'Instructor'       },
  { value: Rol.LIDER_BAR,         label: 'Líder Bar'        },
  { value: Rol.AUXILIAR_COCINA,   label: 'Aux. Cocina'      },
  { value: Rol.ADMIN_COCINA,      label: 'Admin Cocina'     },
  { value: Rol.ADMIN_BAR,         label: 'Admin Bar'        },
];

const ROL_CLASS_MAP: Record<Rol, string> = {
  [Rol.ADMINISTRADOR]:   'admin',
  [Rol.CONTADORA]:       'contadora',
  [Rol.INSTRUCTOR]:      'instructor',
  [Rol.CHEF]:            'chef',
  [Rol.LIDER_BAR]:       'lider-bar',
  [Rol.MESERO]:          'mesero',
  [Rol.BARTENDER]:       'bartender',
  [Rol.AUXILIAR_COCINA]: 'aux-cocina',
  [Rol.CAJERO]:          'cajero',
  [Rol.ADMIN_COCINA]:    'admin-cocina',
  [Rol.ADMIN_BAR]:       'admin-bar',
};

@Component({
  selector: 'restaurant-lista-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DataTableComponent,
    KpiCardComponent,
    LucideIconComponent,
    SearchFilterComponent,
    SelectFilterComponent,
    ExportarUsuariosComponent,
    ImportarUsuariosComponent,
  ],
  templateUrl: './lista-page.component.html',
  styleUrl:    './lista-page.component.scss',
})
export class ListaPageComponent implements OnInit {
  private readonly facade = inject(UsuariosFacade);

  readonly usuarios       = toSignal(this.facade.usuarios$,       { initialValue: [] as UsuarioDetalle[] });
  readonly totalElements  = toSignal(this.facade.totalElements$,  { initialValue: 0 });
  readonly totalActivos   = toSignal(this.facade.totalActivos$,   { initialValue: 0 });
  readonly totalInactivos = toSignal(this.facade.totalInactivos$, { initialValue: 0 });
  readonly loading        = toSignal(this.facade.loading$,        { initialValue: false });

  readonly busqueda        = signal('');
  readonly rolFiltro       = signal('');
  readonly mostrarExportar = signal(false);
  readonly mostrarImportar = signal(false);

  readonly rolOpciones = ROL_OPCIONES_FILTRO;

  readonly usuariosFiltrados = computed(() => {
    const q   = this.busqueda().toLowerCase();
    const rol = this.rolFiltro();
    return this.usuarios().filter(u => {
      const matchBusq = !q ||
        u.nombre.toLowerCase().includes(q) ||
        u.apellidos.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q);
      const matchRol = !rol || u.rol === rol;
      return matchBusq && matchRol;
    });
  });

  ngOnInit(): void {
    this.facade.cargarUsuarios();
  }

  getIniciales(u: UsuarioDetalle): string {
    return (u.nombre.charAt(0) + u.apellidos.charAt(0)).toUpperCase();
  }

  getRolClass(rol: Rol): string {
    return ROL_CLASS_MAP[rol] ?? 'default';
  }

  formatUltimoAcceso(fecha: string | null): string {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleDateString('es-AR', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  }

  onExportar(config: ExportarConfig): void {
    void config;
    this.facade.exportarUsuarios();
    this.mostrarExportar.set(false);
  }

  onImportar(req: ImportarUsuariosRequest): void {
    this.facade.importarMasivo(req);
    this.mostrarImportar.set(false);
  }

  onEliminar(id: string): void {
    this.facade.eliminarUsuario(id);
  }
}
