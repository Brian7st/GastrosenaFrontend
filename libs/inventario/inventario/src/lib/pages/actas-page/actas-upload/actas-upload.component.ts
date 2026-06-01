import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { LucideIconComponent } from '@restaurant/shared/ui';
import { ActasService } from '../../../data-access/services/actas.service';
import { ActasFacade } from '../../../data-access/actas.facade';
import { RequisicionesService } from '../../../data-access/services/requisiciones.service';
import { MovimientosService } from '../../../data-access/services/movimientos.service';
import { SalidaMovimientoData } from '../../../models/movimiento.model';

@Component({
  selector: 'restaurant-actas-upload',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideIconComponent],
  templateUrl: './actas-upload.component.html',
  styleUrl: './actas-upload.component.scss',
})
export class ActasUploadComponent {
  private router              = inject(Router);
  private route               = inject(ActivatedRoute);
  private actasService        = inject(ActasService);
  private actasFacade         = inject(ActasFacade);
  private requisicionesService = inject(RequisicionesService);
  private movimientosService  = inject(MovimientosService);

  isDragging          = signal(false);
  archivoSeleccionado = signal<File | null>(null);
  errorArchivo        = signal<string | null>(null);
  procesando          = signal(false);
  error               = signal<string | null>(null);

  puedeConfirmar = computed(() => this.archivoSeleccionado() !== null && !this.procesando());

  get actaId(): string {
    return this.route.parent?.snapshot.paramMap.get('id') ?? '';
  }

  // ── Drag & Drop ──────────────────────────────────────────────────────────
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
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.validarYSetearArchivo(file);
  }

  private validarYSetearArchivo(file: File): void {
    const permitidos = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!permitidos.includes(file.type)) {
      this.errorArchivo.set('Solo se permiten archivos PDF, JPG o PNG.');
      return;
    }
    this.errorArchivo.set(null);
    this.archivoSeleccionado.set(file);
  }

  // ── Confirmar: FIRMADA + descuento automático de stock ───────────────────
  /**
   * RF-5.5.3 / RF-5.5.5 / RF-5.10.7
   * Paso 1: transición PENDIENTE_FIRMAS → FIRMADA (POST /actas/{id}/firmar)
   * Paso 2: descuento automático de cada ítem de la requisición vinculada
   *         (POST /inventory/movimientos/salida × N ítems en paralelo)
   * Si el descuento falla, la acta ya quedó FIRMADA — se loguea el error
   * pero no se bloquea la navegación.
   */
  confirmarCarga(): void {
    if (!this.puedeConfirmar() || !this.actaId) return;

    this.procesando.set(true);
    this.error.set(null);

    this.actasService.cambiarEstado(this.actaId, 'FIRMADA')
      .pipe(
        switchMap(() => {
          // Recargar el acta para tener el requisicionId e instructorId actualizados
          const acta = this.actasFacade.actaSeleccionada();
          const requisicionId = acta?.requisicionId;
          const instructorId  = acta?.instructorId ?? '';

          if (!requisicionId) {
            console.warn('[ActasUpload] Acta sin requisicionId — salida de stock omitida');
            return of(true);
          }

          // Cargar la requisición para obtener los ítems
          return this.requisicionesService.getRequisicionById(requisicionId).pipe(
            switchMap(req => {
              const items = req?.items ?? [];
              if (items.length === 0) return of(true);

              const salidas: SalidaMovimientoData[] = items.map(item => ({
                productoId:    item.productoId,
                cantidad:      item.cantidad,
                requisicionId: req!.id,
                instructorId,
                categoria:     item.categoria,
              }));

              // Paralelo: un POST por ítem
              return forkJoin(
                salidas.map(s => this.movimientosService.registrarSalida(s))
              ).pipe(map(() => true));
            }),
            catchError(err => {
              // Salida falló pero acta ya está FIRMADA — no bloquear
              console.error('[ActasUpload] Error al registrar salidas de stock:', err);
              return of(true);
            })
          );
        }),
        catchError(err => {
          this.procesando.set(false);
          const detalle = (err?.error?.detail as string | undefined) ?? '';
          this.error.set(detalle || 'Error al firmar el acta. Intentá nuevamente.');
          return of(false);
        })
      )
      .subscribe(ok => {
        if (ok) {
          this.actasFacade.cargarActa(this.actaId); // refresca el estado en la vista
          this.cerrar();
        }
      });
  }

  cerrar(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
