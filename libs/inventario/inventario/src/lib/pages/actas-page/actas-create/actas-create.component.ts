import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  StatusBadgeComponent,
  LucideIconComponent,
} from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { WizardStep } from '../../../models/acta.model';
import { ActasFacade } from '../../../data-access/actas.facade';
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
  styleUrl: './actas-create.component.scss',
})
export class ActasCreateComponent implements OnInit {
  private router    = inject(Router);
  private route     = inject(ActivatedRoute);
  private fb        = inject(FormBuilder);
  readonly actasFacade         = inject(ActasFacade);
  readonly requisicionesFacade = inject(RequisicionesFacade);

  // ── Stepper ────────────────────────────────────────────────────────────
  currentStep = signal(1);
  readonly totalSteps = 4;

  readonly steps: WizardStep[] = [
    { number: 1, label: 'Apertura' },
    { number: 2, label: 'Desarrollo' },
    { number: 3, label: 'Firmantes' },
    { number: 4, label: 'Cierre' },
  ];

  stepProgress = computed(() => `${((this.currentStep() - 1) / (this.totalSteps - 1)) * 100}%`);

  // ── Formulario ─────────────────────────────────────────────────────────
  requisicionId = '';
  form: FormGroup = this.fb.group({
    // Paso 1
    fecha:        ['', Validators.required],
    horaInicio:   ['', Validators.required],
    horaFin:      ['', Validators.required],
    fichaId:      ['', [Validators.required, Validators.pattern(/^\d{7}$/)]],
    instructorId: ['', Validators.required],
    // Paso 2
    resultadoAprendizaje:  ['', Validators.required],
    actividadesRealizadas: ['', Validators.required],
  });

  // Firmantes / asistentes (mínimo 2: instructor cuentadante + vocero)
  firmantes = signal<AsistenteRequest[]>([
    { nombre: '', dependenciaRol: 'Instructor Cuentadante', aprueba: true },
    { nombre: '', dependenciaRol: 'Vocero de Aprendices',   aprueba: true },
  ]);

  ngOnInit(): void {
    this.requisicionId = this.route.snapshot.queryParamMap.get('requisicionId') ?? '';
    if (this.requisicionId) {
      this.requisicionesFacade.cargarRequisicion(this.requisicionId);
      const req = this.requisicionesFacade.requisicionSeleccionada();
      if (req) {
        this.form.patchValue({
          fichaId:      req.fichaId,
          instructorId: req.instructorId,
          fecha:        req.fecha,
        });
        // Pre-llenar nombre del instructor en firmantes[0]
        this.firmantes.update(list => {
          const updated = [...list];
          updated[0] = { ...updated[0], nombre: req.instructorNombre || req.instructorId };
          return updated;
        });
      }
    }
  }

  // ── Firmantes helpers ──────────────────────────────────────────────────
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

  // ── Navegación del wizard ──────────────────────────────────────────────
  nextStep(): void {
    if (this.currentStep() < this.totalSteps) {
      this.currentStep.update(s => s + 1);
    }
  }

  prevStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => s - 1);
    }
  }

  goBack(): void {
    this.router.navigate(['/app/inventario/actas']);
  }

  generarActa(): void {
    if (this.form.invalid) return;
    const v = this.form.value as {
      fecha: string;
      horaInicio: string;
      horaFin: string;
      fichaId: string;
      instructorId: string;
      resultadoAprendizaje: string;
      actividadesRealizadas: string;
    };
    const payload: CrearActaRequest = {
      fecha:                 v.fecha,
      horaInicio:            v.horaInicio,
      horaFin:               v.horaFin,
      requisicionId:         this.requisicionId,
      instructorId:          v.instructorId,
      fichaId:               v.fichaId,
      resultadoAprendizaje:  v.resultadoAprendizaje,
      actividadesRealizadas: v.actividadesRealizadas,
      asistentes:            this.firmantes(),
      compromisos:           [],
    };
    this.actasFacade.crearActa(payload);
    this.router.navigate(['/app/inventario/actas']);
  }
}
