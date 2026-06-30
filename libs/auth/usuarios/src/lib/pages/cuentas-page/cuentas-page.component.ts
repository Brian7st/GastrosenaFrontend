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
  AlertComponent,
  DataTableComponent,
  EmptyStateComponent,
  KpiCardComponent,
  LoadingSkeletonComponent,
  LucideIconComponent,
  PageHeaderComponent,
} from '@restaurant/shared/ui';
import { UsuarioAvatarComponent } from '../../components/usuario-avatar/usuario-avatar.component';
import { UsuarioRolBadgeComponent } from '../../components/usuario-rol-badge/usuario-rol-badge.component';
import { UsuariosFacade } from '../../data-access/usuarios.facade';
import { I18nService } from '../../i18n/i18n.service';
import { UsuarioDetalle } from '../../models/usuarios.model';

@Component({
  selector: 'restaurant-cuentas-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    AlertComponent,
    DataTableComponent,
    EmptyStateComponent,
    KpiCardComponent,
    LoadingSkeletonComponent,
    LucideIconComponent,
    PageHeaderComponent,
    UsuarioAvatarComponent,
    UsuarioRolBadgeComponent,
  ],
  templateUrl: './cuentas-page.component.html',
  styleUrl:    './cuentas-page.component.scss',
})
export class CuentasPageComponent implements OnInit {
  protected readonly i18n = inject(I18nService);
  private readonly facade = inject(UsuariosFacade);
  private pollingInterval: ReturnType<typeof setInterval> | null = null;

  readonly usuarios = toSignal(this.facade.usuarios$, { initialValue: [] as UsuarioDetalle[] });
  readonly loading  = toSignal(this.facade.loading$,  { initialValue: false });
  readonly error    = toSignal(this.facade.error$,    { initialValue: null });

  readonly filtroEstado = signal<'todos' | 'bloqueados' | 'activos'>('todos');
  readonly busqueda     = signal('');

  readonly usuariosFiltrados = computed(() => {
    const filtro = this.filtroEstado();
    const q      = this.busqueda().toLowerCase();
    return this.usuarios().filter(u => {
      const matchBusq = !q ||
        u.nombre.toLowerCase().includes(q) ||
        u.apellidos.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q);
      const matchEstado =
        filtro === 'todos'       ||
        (filtro === 'bloqueados' &&  u.cuentaBloqueada) ||
        (filtro === 'activos'    && !u.cuentaBloqueada);
      return matchBusq && matchEstado;
    });
  });

  readonly totalBloqueadas = computed(() =>
    this.usuarios().filter(u =>  u.cuentaBloqueada).length
  );

  readonly totalActivas = computed(() =>
    this.usuarios().filter(u => !u.cuentaBloqueada).length
  );

  ngOnInit(): void {
    this.facade.cargarUsuarios();

        this.pollingInterval = setInterval(() => {
      this.facade.cargarUsuarios();
    }, 60000);
  }

  onDesbloquear(id: string): void {
    this.facade.desbloquearCuenta(id);
  }

onBloquear(id: string): void {
  this.facade.bloquearCuenta(id); // antes decía desactivarUsuario
}

  ngOnDestroy(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }
  
}
