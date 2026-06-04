import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  signal,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  StatusBadgeComponent,
  LucideIconComponent,
} from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { WizardStep } from '../../../models/acta.model';
import { ActasService } from '../../../data-access/services/actas.service';
import { RequisicionesFacade } from '../../../data-access/requisiciones.facade';
import { CrearActaRequest, AsistenteRequest } from '../../../data-access/api/legalization.api';

@Component({
  selector: 'restaurant-actas-create',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    StatusBadgeComponent,
    LucideIconComponent,
    BackButtonComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './actas-create.component.html',
  styleUrl:    './actas-create.component.scss',
})
export class ActasCreateComponent {
  private router               = inject(Router);
  private route                = inject(ActivatedRoute);
  private fb                   = inject(FormBuilder);
  private actasService         = inject(ActasService);
  readonly requisicionesFacade = inject(RequisicionesFacade);

  readonly enviando = signal(false);
  readonly error    = signal<string | null>(null);

  // ── Stepper ─────────────────────────────────────────────────────────────
  currentStep = signal(1);
  readonly totalSteps = 4;

  readonly steps: WizardStep[] = [
    { number: 1, label: 'Apertura' },
    { number: 2, label: 'Desarrollo' },
    { number: 3, label: 'Firmantes' },
    { number: 4, label: 'Cierre' },
  ];

  stepProgress = computed(() => `${((this.currentStep() - 1) / (this.totalSteps - 1)) * 100}%`);

  // ── Formulario ───────────────────────────────────────────────────────────
  readonly requisicionId: string;

  form: FormGroup = this.fb.group({
    fecha:                 ['', Validators.required],
    horaInicio:            ['', Validators.required],
    horaFin:               ['', Validators.required],
    fichaId:               ['', [Validators.required, Validators.pattern(/^\d{7}$/)]],
    instructorId:          ['', Validators.required],
    resultadoAprendizaje:  ['', Validators.required],
    actividadesRealizadas: ['', Validators.required],
  });

  firmantes = signal<AsistenteRequest[]>([
    { nombre: '', dependenciaRol: 'Instructor Cuentadante', aprueba: true },
    { nombre: '', dependenciaRol: 'Vocero de Aprendices',   aprueba: true },
  ]);

  constructor() {
    // Leer requisicionId ANTES de registrar el effect (injection context activo)
    this.requisicionId = this.route.snapshot.queryParamMap.get('requisicionId') ?? '';

    if (this.requisicionId) {
      this.requisicionesFacade.cargarRequisicion(this.requisicionId);

      // Pre-llenado reactivo: se ejecuta cuando el signal se actualiza con el HTTP response
      effect(() => {
        const req = this.requisicionesFacade.requisicionSeleccionada();
        if (req?.id === this.requisicionId) {
          this.form.patchValue({
            fichaId:      req.fichaId      ?? '',
            instructorId: req.instructorId ?? '',
            fecha:        req.fecha        ?? '',
          });
          this.firmantes.update(list => {
            const updated = [...list];
            updated[0] = { ...updated[0], nombre: req.instructorNombre || req.instructorId || '' };
            return updated;
          });
        }
      }, { allowSignalWrites: true });
    }
  }

  // ── Firmantes helpers ────────────────────────────────────────────────────
  updateFirmante(index: number, field: keyof AsistenteRequest, event: Event): void {
    const value = field === 'aprueba'
      ? (event.target as HTMLInputElement).checked
      : (event.target as HTMLInputElement).value;
    this.firmantes.update(list => {
      const updated = [...list];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }

  addFirmante(): void {
    this.firmantes.update(list => [...list, { nombre: '', dependenciaRol: '', aprueba: true }]);
  }

  /** Quita un firmante adicional. Los dos primeros (Instructor Cuentadante y
   *  Vocero de Aprendices) son obligatorios y no se pueden eliminar (RF-5.10.7). */
  removeFirmante(index: number): void {
    if (index < 2) return;
    this.firmantes.update(list => list.filter((_, i) => i !== index));
  }

  /** true para los dos firmantes obligatorios (instructor y vocero). */
  esFirmanteObligatorio(index: number): boolean {
    return index < 2;
  }

  // ── Navegación del wizard ────────────────────────────────────────────────
  nextStep(): void {
    if (this.currentStep() < this.totalSteps) this.currentStep.update(s => s + 1);
  }

  prevStep(): void {
    if (this.currentStep() > 1) this.currentStep.update(s => s - 1);
  }

  goBack(): void {
    this.router.navigate(['/app/inventario/actas']);
  }

  // ── Submit ───────────────────────────────────────────────────────────────
  generarActa(): void {
    if (this.form.invalid || this.enviando()) return;

    if (!this.requisicionId) {
      this.error.set('Se requiere una requisición para generar el acta.');
      return;
    }

    const v = this.form.value as {
      fecha: string; horaInicio: string; horaFin: string;
      fichaId: string; instructorId: string;
      resultadoAprendizaje: string; actividadesRealizadas: string;
    };

    const payload: CrearActaRequest = {
      fecha:                 v.fecha,
      horaInicio:            this.toTimeString(v.horaInicio),
      horaFin:               this.toTimeString(v.horaFin),
      requisicionId:         this.requisicionId,
      instructorId:          v.instructorId,
      fichaId:               v.fichaId,
      resultadoAprendizaje:  v.resultadoAprendizaje,
      actividadesRealizadas: v.actividadesRealizadas,
      asistentes:            this.firmantes(),
      compromisos:           [],
    };

    this.enviando.set(true);
    this.error.set(null);

    this.actasService.crearActa(payload).subscribe({
      next: (id) => {
        if (id) {
          this.router.navigate(['/app/inventario/actas', id]);
        } else {
          this.router.navigate(['/app/inventario/actas']);
        }
      },
      error: () => {
        this.enviando.set(false);
        this.error.set('Error al generar el acta. Verificá los datos e intentá nuevamente.');
      },
    });
  }

  // ── Helpers ──────────────────────────────────────────────────────────────
  /** Convierte "HH:mm" a "HH:mm:ss" que espera Spring LocalTime en ISO mode. */
  private toTimeString(hora: string): string {
    if (!hora) return '00:00:00';
    return hora.length === 5 ? `${hora}:00` : hora;
  }
}
