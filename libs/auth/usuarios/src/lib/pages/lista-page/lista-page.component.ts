import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { map } from 'rxjs';
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
import { I18nService } from '../../i18n/i18n.service';
import {
  ActualizarUsuarioRequest,
  CrearUsuarioRequest,
  ExportarConfig,
  ImportarUsuariosRequest,
  UsuarioDetalle,
} from '../../models/usuarios.model';
// 👇 AGREGAR ESTA IMPORTACIÓN
import { AuthService } from '@restaurant/shared/auth';

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
  styleUrl: './lista-page.component.scss',
})
export class ListaPageComponent implements OnInit {
  private readonly facade = inject(UsuariosFacade);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly i18n = inject(I18nService);
  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  // 👇 AGREGAR ESTO
  private readonly authService = inject(AuthService);

  // ── Signals del Facade ──────────────────────────────────────────────────

  readonly usuarios = toSignal(
    this.facade.usuarios$.pipe(map((u): UsuarioDetalle[] => u ?? [])),
    { initialValue: [] as UsuarioDetalle[] }
  );

  readonly totalElements = toSignal(this.facade.totalElements$, { initialValue: 0 });
  readonly totalActivos = toSignal(this.facade.totalActivos$, { initialValue: 0 });
  readonly totalInactivos = toSignal(this.facade.totalInactivos$, { initialValue: 0 });
  readonly loading = toSignal(this.facade.loading$, { initialValue: false });
  readonly importando = toSignal(this.facade.importando$, { initialValue: false });
  readonly resultadoImport = toSignal(this.facade.resultadoImport$, { initialValue: null });
  readonly mensajeExport = toSignal(this.facade.mensajeExport$, { initialValue: null });
  readonly error = toSignal(this.facade.error$, { initialValue: null as string | null });

  // ── Signals locales ─────────────────────────────────────────────────────

  readonly mensajeExito = signal<string | null>(null);
  readonly rolesDisponibles = Object.values(Rol);

  readonly busqueda = signal('');
  readonly rolFiltro = signal('');
  readonly estadoFiltro = signal<'todos' | 'activos' | 'inactivos'>('todos');
  readonly mostrarExportar = signal(false);
  readonly mostrarImportar = signal(false);
  readonly mostrarFormulario = signal(false);
  readonly usuarioEditando = signal<UsuarioDetalle | null>(null);

  // 👇 AGREGAR ESTE COMPUTED
  readonly esAdmin = computed(() => {
    const user = this.authService.currentUser();
    return user?.rol === 'ADMINISTRADOR';
  });

  // ── Computed ─────────────────────────────────────────────────────────────

  readonly usuariosFiltrados = computed(() => {
    const lista = this.usuarios() ?? [];
    const q = this.busqueda().toLowerCase();
    const rol = this.rolFiltro();
    const estado = this.estadoFiltro();

    return lista.filter((u) => {
      const matchBusq =
        !q ||
        u.nombre.toLowerCase().includes(q) ||
        u.apellidos.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q);
      const matchRol = !rol || u.rol === rol;
      const matchEstado =
        estado === 'todos' ||
        (estado === 'activos' && u.activo) ||
        (estado === 'inactivos' && !u.activo);
      return matchBusq && matchRol && matchEstado;
    });
  });

  readonly usuariosMostrar = computed(() => this.usuariosFiltrados());
  readonly totalMostrar = computed(() => this.totalElements());
  readonly activosMostrar = computed(() => this.totalActivos());
  readonly inactivosMostrar = computed(() => this.totalInactivos());

  // ── Lifecycle ────────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.facade.cargarUsuarios();
    this.facade.cargarRoles();

    this.destroyRef.onDestroy(() => {
      if (this.toastTimer !== null) {
        clearTimeout(this.toastTimer);
      }
    });
  }

  // ── Toast ────────────────────────────────────────────────────────────────

  private mostrarToast(mensaje: string): void {
    if (this.toastTimer !== null) {
      clearTimeout(this.toastTimer);
    }
    this.mensajeExito.set(mensaje);
    this.toastTimer = setTimeout(() => {
      this.mensajeExito.set(null);
      this.toastTimer = null;
    }, 4000);
  }

  // ── Acciones ─────────────────────────────────────────────────────────────

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
  if (editando) {
    const payload: ActualizarUsuarioRequest = {
      nombre:    data.nombre,
      apellidos: data.apellidos,
      telefono:  data.telefono,
      idRol:     data.nombreRol,
      documento: data.documento,
      email:     data.email,
    };
    this.facade.actualizarUsuario(editando.id, payload);
    
    // ← AGREGAR ESTO
    const rolCambio = editando.rol !== data.nombreRol;
    if (rolCambio) {
      this.mostrarToast(
        'Usuario actualizado. Si se cambió el rol, el usuario deberá cerrar sesión para ver los cambios.'
      );
    } else {
      this.mostrarToast('Usuario actualizado correctamente.');
    }

  } else {
    this.facade.crearUsuario(data);
    this.mostrarToast(this.i18n.t('lista.toast_creado'));
  }

  onExportar(config: ExportarConfig): void {
    this.facade.exportarUsuarios(config);
    this.mostrarExportar.set(false);
  }

  onImportar(req: ImportarUsuariosRequest): void {
    this.facade.importarMasivo(req);
  }

  onCambiarEstado(u: UsuarioDetalle): void {
    if (u.activo) {
      this.facade.desactivarUsuario(u.id);
    } else {
      this.facade.activarUsuario(u.id);
    }

    setTimeout(() => {
      this.facade.cargarUsuarios();
    }, 500);
  }

  onEliminar(id: string): void {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) {
      return;
    }
    this.facade.eliminarUsuario(id);

    setTimeout(() => {
      this.facade.cargarUsuarios();
    }, 500);
  }
}