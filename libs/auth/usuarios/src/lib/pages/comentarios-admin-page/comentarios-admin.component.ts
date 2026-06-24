import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
  computed,
} from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { KpiCardComponent } from '@restaurant/shared/ui';
import { I18nService } from '../../i18n/i18n.service';
import { CommentsService, ComentarioResponse } from '../../../../../../shell/home/src/lib/data-access/comments.service';

@Component({
  selector: 'restaurant-comentarios-admin',
  standalone: true,
  imports: [DatePipe, TitleCasePipe, KpiCardComponent],
  templateUrl: './comentarios-admin.component.html',
  styleUrl: './comentarios-admin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComentariosAdminComponent implements OnInit {
  protected readonly i18n = inject(I18nService);
  private readonly commentsService = inject(CommentsService);

  comentarios    = signal<ComentarioResponse[]>([]);
  isLoading      = signal(false);
  procesando     = signal<string | null>(null); // id del comentario en proceso
  filtroEstado   = signal<'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'TODOS'>('PENDIENTE');

  readonly comentariosFiltrados = computed(() => {
    const filtro = this.filtroEstado();
    if (filtro === 'TODOS') return this.comentarios();
    return this.comentarios().filter(c => c.estado === filtro);
  });

  readonly totalPendientes = computed(() =>
    this.comentarios().filter(c => c.estado === 'PENDIENTE').length
  );

  readonly totalAprobados = computed(() =>
    this.comentarios().filter(c => c.estado === 'APROBADO').length
  );

  readonly totalRechazados = computed(() =>
    this.comentarios().filter(c => c.estado === 'RECHAZADO').length
  );

  ngOnInit(): void {
    this.cargarComentarios();
  }

  cargarComentarios(): void {
    this.isLoading.set(true);
    this.commentsService.listarAdmin().subscribe({
      next: res => {
        this.comentarios.set(res.content);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  aprobar(id: string): void {
    this.procesando.set(id);
    this.commentsService.cambiarEstado(id, 'APROBADO').subscribe({
      next: updated => {
        this.comentarios.update(list =>
          list.map(c => c.idComentario === id ? updated : c)
        );
        this.procesando.set(null);
      },
      error: () => this.procesando.set(null),
    });
  }

  rechazar(id: string): void {
    this.procesando.set(id);
    this.commentsService.cambiarEstado(id, 'RECHAZADO').subscribe({
      next: updated => {
        this.comentarios.update(list =>
          list.map(c => c.idComentario === id ? updated : c)
        );
        this.procesando.set(null);
      },
      error: () => this.procesando.set(null),
    });
  }

  getInitials(nombre: string): string {
    return nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  setFiltro(filtro: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'TODOS'): void {
    this.filtroEstado.set(filtro);
  }
}
