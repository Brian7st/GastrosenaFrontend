import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AuthService } from '@restaurant/shared/auth';
import { CommentsService, ComentarioResponse } from '../../data-access/comments.service';
import { AlertComponent, LucideIconComponent } from '@restaurant/shared/ui';@Component({
  selector: 'restaurant-comments-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AlertComponent,
    DatePipe,
    LucideIconComponent,
  ],
  templateUrl: './comments-form.component.html',
  styleUrl: './comments-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsFormComponent implements OnInit {
  private readonly fb              = inject(FormBuilder);
  private readonly commentsService = inject(CommentsService);
  private readonly authService     = inject(AuthService);

  isLoading      = signal(false);
  isLoadingForo  = signal(false);
  successMessage = signal('');
  errorMessage   = signal('');
  comentarios    = signal<ComentarioResponse[]>([]);

  form = this.fb.group({
    nombre:     ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
    titulo:     ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    comentario: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
  });

  get nombre()     { return this.form.get('nombre')!;     }
  get titulo()     { return this.form.get('titulo')!;     }
  get comentario() { return this.form.get('comentario')!; }

  ngOnInit(): void {
    this.cargarComentarios();
  }

  cargarComentarios(): void {
    this.isLoadingForo.set(true);
    this.commentsService.obtenerAprobados().subscribe({
      next: res => {
        this.comentarios.set(res.content);
        this.isLoadingForo.set(false);
      },
      error: () => this.isLoadingForo.set(false),
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.isLoading()) return;

    this.isLoading.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');

    const { nombre, titulo, comentario } = this.form.getRawValue();

    this.commentsService.crearComentario({
      nombre:     nombre!,
      titulo:     titulo!,
      comentario: comentario!,
      idUsuario:  this.authService.currentUser()?.id,
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('¡Comentario enviado! Será visible una vez aprobado.');
        this.form.reset();
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Ocurrió un error al enviar tu comentario. Intenta de nuevo.');
      },
    });
  }

  getInitials(nombre: string): string {
    return nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }
}
