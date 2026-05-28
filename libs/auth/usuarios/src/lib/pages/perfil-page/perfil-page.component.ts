import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  inject,
  signal,
  computed,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import {
  PageHeaderComponent,
  InputComponent,
  ButtonComponent,
  LucideIconComponent,
  StatusBadgeComponent,
} from '@restaurant/shared/ui';
import { AuthService } from '@restaurant/shared/auth';

interface ActividadReciente {
  accion: string;
  fecha: string;
  modulo: string;
}

@Component({
  selector: 'restaurant-perfil-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PageHeaderComponent,
    InputComponent,
    ButtonComponent,
    LucideIconComponent,
    StatusBadgeComponent,
  ],
  templateUrl: './perfil-page.component.html',
  styleUrl: './perfil-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerfilPageComponent {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  readonly usuario = this.authService.currentUser();
  readonly fotoUrl = signal<string | null>(null);

  readonly iniciales = computed(() => {
    const nombre = this.usuario?.nombre ?? '';
    const partes = nombre.split(' ');
    return partes.length >= 2
      ? partes[0][0] + partes[1][0]
      : nombre.slice(0, 2);
  });

  readonly infoForm = this.fb.group({
    nombre:    [this.usuario?.nombre ?? '',  [Validators.required]],
    apellidos: ['',                           [Validators.required]],
    email:     [this.usuario?.email ?? '',   [Validators.required, Validators.email]],
    documento: ['',                           [Validators.required]],
    telefono:  ['',                           [Validators.required]],
  });

  readonly seguridadForm = this.fb.group({
    contrasenaActual: ['', [Validators.required]],
    nuevaContrasena:  ['', [Validators.required, Validators.minLength(6)]],
    confirmar:        ['', [Validators.required]],
  });

  readonly guardando = signal(false);
  readonly exito     = signal(false);

  readonly actividadReciente: ActividadReciente[] = [
    { accion: 'Inició sesión',    fecha: '2026-05-24 14:32', modulo: 'Auth'    },
    { accion: 'Creó nueva orden', fecha: '2026-05-24 14:32', modulo: 'Órdenes' },
    { accion: 'Actualizó menú',   fecha: '2026-05-24 12:15', modulo: 'Menú'    },
    { accion: 'Cerró turno',      fecha: '2026-05-23 18:45', modulo: 'Sistema' },
    { accion: 'Modificó receta',  fecha: '2026-05-23 16:20', modulo: 'Recetas' },
  ];

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFotoChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.fotoUrl.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  onGuardar(): void {
    if (this.infoForm.invalid) {
      this.infoForm.markAllAsTouched();
      return;
    }
    this.guardando.set(true);
    setTimeout(() => {
      this.guardando.set(false);
      this.exito.set(true);
      setTimeout(() => this.exito.set(false), 3000);
    }, 1000);
  }

  onCancelar(): void {
    this.infoForm.reset();
    this.seguridadForm.reset();
  }
}