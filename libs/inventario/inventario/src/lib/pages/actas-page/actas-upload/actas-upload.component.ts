import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  inject,
} from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { LucideIconComponent } from '@restaurant/shared/ui';
import { ActasFacade } from '../../../data-access/actas.facade';
import { ActasService } from '../../../data-access/services/actas.service';

@Component({
  selector: 'restaurant-actas-upload',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideIconComponent],
  templateUrl: './actas-upload.component.html',
  styleUrl: './actas-upload.component.scss',
})
export class ActasUploadComponent {
  private router       = inject(Router);
  private route        = inject(ActivatedRoute);
  private actasFacade  = inject(ActasFacade);
  private actasService = inject(ActasService);

  isDragging          = signal(false);
  archivoSeleccionado = signal<File | null>(null);
  errorArchivo        = signal<string | null>(null);
  procesando          = signal(false);
  error               = signal<string | null>(null);

  puedeConfirmar = computed(() => this.archivoSeleccionado() !== null && !this.procesando());

  get actaId(): string {
    return this.route.parent?.snapshot.paramMap.get('id') ?? '';
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
  }
  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) this.validarYSetearArchivo(file);
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.validarYSetearArchivo(file);
  }
  private validarYSetearArchivo(file: File): void {
    const tiposPermitidos = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!tiposPermitidos.includes(file.type)) {
      this.errorArchivo.set('Solo se permiten archivos PDF, JPG o PNG.');
      return;
    }
    this.errorArchivo.set(null);
    this.archivoSeleccionado.set(file);
  }

  /**
   * El backend no almacena el archivo; confirmar carga avanza el acta a FIRMADA.
   * El descuento de stock se activa automáticamente en el backend (ActaFirmadaListener).
   * Se suscribe al resultado: solo navega en éxito; si falla (ej. firmas faltantes
   * o stock insuficiente) muestra el error y NO cierra el modal.
   */
  confirmarCarga(): void {
    if (!this.puedeConfirmar() || !this.actaId) return;
    this.procesando.set(true);
    this.error.set(null);

    this.actasService.cambiarEstado(this.actaId, 'FIRMADA').subscribe({
      next: () => {
        this.actasFacade.cargarActa(this.actaId);
        this.procesando.set(false);
        this.cerrar();
      },
      error: (err) => {
        this.procesando.set(false);
        const detalle = (err?.error?.detail as string | undefined) ?? '';
        this.error.set(
          detalle ||
          'No se pudo firmar el acta. Verificá que ambas firmas estén registradas y que haya stock suficiente.'
        );
      },
    });
  }

  cerrar(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
