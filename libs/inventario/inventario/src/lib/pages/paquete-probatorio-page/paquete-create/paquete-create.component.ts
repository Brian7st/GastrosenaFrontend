import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideIconComponent, ButtonComponent } from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { PaqueteService } from '../../../data-access/services/paquete.service';
import { ActasFacade } from '../../../data-access/actas.facade';
import { I18nService } from '../../../i18n/i18n.service';

@Component({
  selector: 'restaurant-paquete-create',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, LucideIconComponent, ButtonComponent, BackButtonComponent],
  templateUrl: './paquete-create.component.html',
  styleUrl: './paquete-create.component.scss',
})
export class PaqueteCreateComponent {
  private router         = inject(Router);
  protected readonly i18n = inject(I18nService);
  private route          = inject(ActivatedRoute);
  private fb             = inject(FormBuilder);
  private paqueteService = inject(PaqueteService);
  private actasFacade    = inject(ActasFacade);

  // ── Query params (vienen del botón "Crear Paquete" en actas-detail) ──────
  readonly actaId        = this.route.snapshot.queryParamMap.get('actaId')        ?? '';
  readonly requisicionId = this.route.snapshot.queryParamMap.get('requisicionId') ?? '';

  // ── Estado ───────────────────────────────────────────────────────────────
  readonly currentStep = signal(1);
  readonly enviando    = signal(false);
  readonly error       = signal<string | null>(null);

  // ── Formulario — solo fichaId e instructorId (backend no acepta titulo) ──
  readonly form = this.fb.nonNullable.group({
    fichaId:      ['', Validators.required],
    instructorId: ['', Validators.required],
  });

  // ── Derived del acta cargada ──────────────────────────────────────────────
  readonly acta        = this.actasFacade.actaSeleccionada;
  readonly actaLoading = this.actasFacade.loading;

  /** Muestra un resumen del vínculo en el paso 2 */
  readonly resumen = computed(() => {
    const a = this.acta();
    return {
      numeroActa:    a?.numeroActa   ?? '—',
      fichaId:       this.form.value.fichaId      ?? '—',
      instructorId:  this.form.value.instructorId ?? '—',
      requisicionId: this.requisicionId             || '—',
    };
  });

  constructor() {
    // Cargar acta para obtener fichaId e instructorId
    if (this.actaId) {
      this.actasFacade.cargarActa(this.actaId);

      // Pre-llenar cuando el acta cargue (reactivo al signal)
      effect(() => {
        const a = this.actasFacade.actaSeleccionada();
        if (a?.id === this.actaId) {
          this.form.patchValue({
            fichaId:      a.fichaId      ?? '',
            instructorId: a.instructorId ?? '',
          });
        }
      }, { allowSignalWrites: true });
    }
  }

  // ── Navegación del stepper ────────────────────────────────────────────────
  siguientePaso(): void {
    if (this.form.valid) {
      this.currentStep.set(2);
    } else {
      this.form.markAllAsTouched();
    }
  }

  pasoAnterior(): void {
    if (this.currentStep() > 1) this.currentStep.update(s => s - 1);
  }

  volver(): void {
    this.router.navigate(['/app/inventario/paquete-probatorio']);
  }

  cancelar(): void {
    this.volver();
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  guardarPaquete(): void {
    if (this.form.invalid || this.enviando()) return;

    if (!this.actaId || !this.requisicionId) {
      this.error.set('Faltan datos del acta o la requisición. Volvé al detalle del acta e intentá nuevamente.');
      return;
    }

    this.enviando.set(true);
    this.error.set(null);

    const { fichaId, instructorId } = this.form.getRawValue();

    this.paqueteService.crearPaquete({
      actaId:        this.actaId,
      requisicionId: this.requisicionId,
      fichaId,
      instructorId,
    }).subscribe({
      next: (paquete) => {
        // Navegar al detalle del paquete recién creado
        if (paquete.id) {
          this.router.navigate(['/app/inventario/paquete-probatorio', paquete.id]);
        } else {
          this.volver();
        }
      },
      error: (err) => {
        this.enviando.set(false);
        const detalle = (err?.error?.detail as string | undefined) ?? '';
        this.error.set(detalle || 'Error al crear el paquete. Verificá los datos e intentá nuevamente.');
      },
    });
  }
}
