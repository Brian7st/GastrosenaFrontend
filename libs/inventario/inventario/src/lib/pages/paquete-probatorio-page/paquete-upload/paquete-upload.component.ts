import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideIconComponent } from '@restaurant/shared/ui';
import { PaqueteService } from '../../../data-access/services/paquete.service';
import { PaqueteFacade } from '../../../data-access/paquete.facade';

@Component({
  selector: 'restaurant-paquete-upload',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideIconComponent],
  templateUrl: './paquete-upload.component.html',
  styleUrl: './paquete-upload.component.scss',
})
export class PaqueteUploadComponent {
  private router         = inject(Router);
  private route          = inject(ActivatedRoute);
  private paqueteService = inject(PaqueteService);
  private facade         = inject(PaqueteFacade);

  isDragging   = signal(false);
  selectedFile = signal<File | null>(null);
  errorArchivo = signal<string | null>(null);
  procesando   = signal(false);
  error        = signal<string | null>(null);

  puedeAdjuntar = computed(() => this.selectedFile() !== null && !this.procesando());

  get paqueteId(): string {
    return this.route.parent?.snapshot.paramMap.get('id') ?? '';
  }

  // ── Drag & Drop ──────────────────────────────────────────────────────────
  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) this.handleFile(file);
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.handleFile(file);
  }

  private handleFile(file: File): void {
    if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
      this.errorArchivo.set(null);
      this.selectedFile.set(file);
    } else {
      this.errorArchivo.set('Solo se permiten archivos PDF o imágenes (JPG, PNG).');
    }
  }

  removeFile(): void {
    this.selectedFile.set(null);
  }

  // ── Acción principal ─────────────────────────────────────────────────────
  /**
   * RF-5.11.3 — PATCH /legalization/paquetes/{id}/adjuntar-asistencia
   * El backend solo necesita el PATCH (no requiere el archivo en multipart).
   * Al recibir el PATCH con 204, el backend marca registroAsistenciaAdjunto=true
   * y auto-transiciona el paquete a COMPLETO.
   */
  subirDocumento(): void {
    if (!this.puedeAdjuntar() || !this.paqueteId) return;

    this.procesando.set(true);
    this.error.set(null);

    this.paqueteService.adjuntarAsistencia(this.paqueteId).subscribe({
      next: () => {
        this.facade.cargarPaquete(this.paqueteId); // refresca estado COMPLETO
        this.cerrarModal();
      },
      error: (err) => {
        this.procesando.set(false);
        const detalle = (err?.error?.detail as string | undefined) ?? '';
        this.error.set(detalle || 'Error al adjuntar la asistencia. Intentá nuevamente.');
      },
    });
  }

  cerrarModal(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
