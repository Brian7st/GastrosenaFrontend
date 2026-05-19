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
import { Rol } from '@restaurant/shared/models';
import {
  AlertComponent,
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
  RolOpcion,
  UsuarioDetalle,
} from '../../models/usuarios.model';

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
    DatePipe,
    AlertComponent,
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

  readonly usuarios        = toSignal(this.facade.usuarios$,        { initialValue: [] as UsuarioDetalle[] });
  readonly totalElements   = toSignal(this.facade.totalElements$,   { initialValue: 0 });
  readonly totalActivos    = toSignal(this.facade.totalActivos$,    { initialValue: 0 });
  readonly totalInactivos  = toSignal(this.facade.totalInactivos$,  { initialValue: 0 });
  readonly loading         = toSignal(this.facade.loading$,         { initialValue: false });
  readonly importando      = toSignal(this.facade.importando$,      { initialValue: false });
  readonly resultadoImport = toSignal(this.facade.resultadoImport$, { initialValue: null });
  readonly mensajeExport   = toSignal(this.facade.mensajeExport$,   { initialValue: null });

  // Corrección 3 — opciones de rol dinámicas desde el store
  private readonly roles = toSignal(this.facade.roles$, { initialValue: [] as RolOpcion[] });
  readonly rolOpciones   = computed(() => [
    { value: '', label: 'Todos los roles' },
    ...this.roles().map(r => ({ value: r.idRol, label: r.nombreRol })),
  ]);

  readonly busqueda        = signal('');
  readonly rolFiltro       = signal('');
  readonly mostrarExportar = signal(false);
  readonly mostrarImportar = signal(false);

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
    this.facade.cargarRoles(); // Corrección 3
  }

  getIniciales(u: UsuarioDetalle): string {
    return (u.nombre.charAt(0) + u.apellidos.charAt(0)).toUpperCase();
  }

  getRolClass(rol: Rol): string {
    return ROL_CLASS_MAP[rol] ?? 'default';
  }

  // Corrección 1 — pasar config al facade
  onExportar(config: ExportarConfig): void {
    this.facade.exportarUsuarios(config);
    this.mostrarExportar.set(false);
  }

  // Corrección 6 — no cerrar modal; mostrar resultado adentro
  onImportar(req: ImportarUsuariosRequest): void {
    this.facade.importarMasivo(req);
  }

  onEliminar(id: string): void {
    this.facade.eliminarUsuario(id);
  }
}
