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
} from '@restaurant/shared/ui';
import { ExportarUsuariosComponent } from '../../components/exportar-usuarios/exportar-usuarios.component';
import { ImportarUsuariosComponent } from '../../components/importar-usuarios/importar-usuarios.component';
import { UsuarioFormComponent } from '../../components/usuario-form/usuario-form.component';
import { UsuarioAvatarComponent } from '../../components/usuario-avatar/usuario-avatar.component';
import { UsuarioRolBadgeComponent } from '../../components/usuario-rol-badge/usuario-rol-badge.component';
import { UsuariosFacade } from '../../data-access/usuarios.facade';
import {
  ActualizarUsuarioRequest,
  CrearUsuarioRequest,
  ExportarConfig,
  ImportarUsuariosRequest,
  UsuarioDetalle,
} from '../../models/usuarios.model';

const MOCK_USUARIOS: UsuarioDetalle[] = [
  { id: '1', nombre: 'María',  apellidos: 'González', email: 'maria@gastrosena.edu.co',
    documento: '1234567890', telefono: '+57 301 234 5678', rol: Rol.ADMINISTRADOR,
    activo: true,  creadoEn: new Date('2024-01-15'), ultimoAcceso: '2024-01-15',
    cuentaBloqueada: false, intentosFallidos: 0 },
  { id: '2', nombre: 'Carlos', apellidos: 'Ramírez',  email: 'carlos@gastrosena.edu.co',
    documento: '0987654321', telefono: '+57 300 123 4567', rol: Rol.CHEF,
    activo: true,  creadoEn: new Date('2024-01-14'), ultimoAcceso: '2024-01-14',
    cuentaBloqueada: false, intentosFallidos: 0 },
  { id: '3', nombre: 'Ana',    apellidos: 'López',    email: 'ana@gastrosena.edu.co',
    documento: '1122334455', telefono: '+57 302 345 6789', rol: Rol.MESERO,
    activo: true,  creadoEn: new Date('2024-01-19'), ultimoAcceso: '2024-01-19',
    cuentaBloqueada: false, intentosFallidos: 0 },
  { id: '4', nombre: 'José',   apellidos: 'Martín',   email: 'jose@gastrosena.edu.co',
    documento: '5566778899', telefono: '+57 303 456 7890', rol: Rol.BARTENDER,
    activo: false, creadoEn: new Date('2024-01-14'), ultimoAcceso: '2024-01-14',
    cuentaBloqueada: true, intentosFallidos: 3 },
  { id: '5', nombre: 'Laura',  apellidos: 'Silva',    email: 'laura@gastrosena.edu.co',
    documento: '9988776655', telefono: '+57 304 567 8901', rol: Rol.CAJERO,
    activo: true,  creadoEn: new Date('2024-01-15'), ultimoAcceso: '2024-01-15',
    cuentaBloqueada: false, intentosFallidos: 0 },
];

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
    ExportarUsuariosComponent,
    ImportarUsuariosComponent,
    UsuarioFormComponent,
    UsuarioAvatarComponent,
    UsuarioRolBadgeComponent,
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

  readonly rolesDisponibles = Object.values(Rol);

  readonly busqueda     = signal('');
  readonly rolFiltro    = signal('');
  readonly estadoFiltro = signal<'todos' | 'activos' | 'inactivos'>('todos');
  readonly mostrarExportar   = signal(false);
  readonly mostrarImportar   = signal(false);
  readonly mostrarFormulario = signal(false);

  private readonly mockUsuarios    = signal<UsuarioDetalle[]>(MOCK_USUARIOS);
  readonly usuarioEditando         = signal<UsuarioDetalle | null>(null);
  private readonly usandoMock      = computed(() => this.usuarios().length === 0);

  readonly usuariosFiltrados = computed(() => {
    const q      = this.busqueda().toLowerCase();
    const rol    = this.rolFiltro();
    const estado = this.estadoFiltro();
    return this.usuarios().filter(u => {
      const matchBusq   = !q ||
        u.nombre.toLowerCase().includes(q) ||
        u.apellidos.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q);
      const matchRol    = !rol || u.rol === rol;
      const matchEstado = estado === 'todos' ||
        (estado === 'activos'   &&  u.activo) ||
        (estado === 'inactivos' && !u.activo);
      return matchBusq && matchRol && matchEstado;
    });
  });

  readonly usuariosMostrar = computed(() => {
    if (this.usandoMock()) {
      const q   = this.busqueda().toLowerCase();
      const rol = this.rolFiltro();
      return this.mockUsuarios().filter(u => {
        const matchBusq = !q ||
          u.nombre.toLowerCase().includes(q) ||
          u.apellidos.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q);
        const matchRol = !rol || u.rol === rol;
        return matchBusq && matchRol;
      });
    }
    return this.usuariosFiltrados();
  });

  readonly totalMostrar     = computed(() =>
    this.usandoMock() ? this.mockUsuarios().length : this.totalElements()
  );
  readonly activosMostrar   = computed(() =>
    this.usandoMock() ? this.mockUsuarios().filter(u => u.activo).length : this.totalActivos()
  );
  readonly inactivosMostrar = computed(() =>
    this.usandoMock() ? this.mockUsuarios().filter(u => !u.activo).length : this.totalInactivos()
  );

  ngOnInit(): void {
    this.facade.cargarUsuarios();
    this.facade.cargarRoles();
  }

  onCrearUsuario(): void {
    this.usuarioEditando.set(null);
    this.mostrarFormulario.set(true);
  }

  onEditarUsuario(u: UsuarioDetalle): void {
    this.usuarioEditando.set(u);
    this.mostrarFormulario.set(true);
  }

  onCerrarFormulario(): void {
    this.usuarioEditando.set(null);
    this.mostrarFormulario.set(false);
  }

  onGuardarUsuario(data: CrearUsuarioRequest): void {
    const editando = this.usuarioEditando();
    if (this.usandoMock()) {
      const { idRol, contrasena: _pw, ...rest } = data;
      if (editando) {
        this.mockUsuarios.update(list =>
          list.map(u => u.id === editando.id ? { ...u, ...rest, rol: idRol as Rol } : u)
        );
      } else {
        const nuevo: UsuarioDetalle = {
          id: Date.now().toString(),
          ...rest,
          rol: idRol as Rol,
          activo: true,
          creadoEn: new Date(),
          ultimoAcceso: null,
          cuentaBloqueada: false,
          intentosFallidos: 0,
        };
        this.mockUsuarios.update(list => [...list, nuevo]);
      }
    } else {
      if (editando) {
        const payload: ActualizarUsuarioRequest = {
          nombre:    data.nombre,
          apellidos: data.apellidos,
          telefono:  data.telefono,
          idRol:     data.idRol,
        };
        this.facade.actualizarUsuario(editando.id, payload);
      } else {
        this.facade.crearUsuario(data);
      }
    }
    this.onCerrarFormulario();
  }

  onExportar(config: ExportarConfig): void {
    this.facade.exportarUsuarios(config);
    this.mostrarExportar.set(false);
  }

  onImportar(req: ImportarUsuariosRequest): void {
    this.facade.importarMasivo(req);
  }

  onEliminar(id: string): void {
    if (this.usandoMock()) {
      this.mockUsuarios.update(list => list.filter(u => u.id !== id));
    } else {
      this.facade.eliminarUsuario(id);
    }
  }
}
