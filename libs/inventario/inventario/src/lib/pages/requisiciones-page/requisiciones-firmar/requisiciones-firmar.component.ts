import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LucideIconComponent } from '@restaurant/shared/ui';
import { RequisicionesFacade } from '../../../data-access/requisiciones.facade';

@Component({
  selector: 'restaurant-requisiciones-firmar',
  standalone: true,
  imports: [LucideIconComponent],
  templateUrl: './requisiciones-firmar.component.html',
  styleUrl: './requisiciones-firmar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequisicionesFirmarComponent {
  private router  = inject(Router);
  private route   = inject(ActivatedRoute);
  readonly facade = inject(RequisicionesFacade);

  readonly requisicionId: string;

  // ── Estado del formulario ────────────────────────────────────────────────
  readonly voceroNombre    = signal('');
  readonly voceroDocumento = signal('');
  readonly verificado      = signal(false);
  readonly firmando        = signal(false);
  readonly error           = signal<string | null>(null);

  // ── Datos de la requisición ──────────────────────────────────────────────
  readonly requisicion = this.facade.requisicionSeleccionada;
  readonly items       = computed(() => this.requisicion()?.items ?? []);
  readonly instructor  = computed(() => {
    const r = this.requisicion();
    return r?.instructorNombre || r?.instructorId || '—';
  });
  readonly numeroReq   = computed(() => this.requisicion()?.numero ?? '');

  readonly hoy = new Date().toLocaleDateString('es-CO', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  // ── Validación ────────────────────────────────────────────────────────────
  readonly puedeConfirmar = computed(() =>
    this.voceroNombre().trim().length > 0 &&
    this.voceroDocumento().trim().length > 0 &&
    this.verificado()
  );

  constructor() {
    this.requisicionId = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.requisicionId) {
      this.facade.cargarRequisicion(this.requisicionId);
    }
  }

  // ── Handlers de inputs ────────────────────────────────────────────────────
  setVoceroNombre(e: Event): void {
    this.voceroNombre.set((e.target as HTMLInputElement).value);
  }

  setVoceroDocumento(e: Event): void {
    this.voceroDocumento.set((e.target as HTMLInputElement).value);
  }

  setVerificado(e: Event): void {
    this.verificado.set((e.target as HTMLInputElement).checked);
  }

  // ── Acción principal ──────────────────────────────────────────────────────
  firmar(): void {
    if (!this.puedeConfirmar() || this.firmando()) return;

    // El backend espera voceroId (@NotBlank string) — usamos el documento como identificador
    const voceroId = this.voceroDocumento().trim();

    this.firmando.set(true);
    this.error.set(null);

    this.facade.firmarRequisicion(this.requisicionId, voceroId).subscribe({
      next: () => {
        this.router.navigate(['/app/inventario/requisiciones']);
      },
      error: (err) => {
        this.firmando.set(false);
        const detalle = (err?.error?.detail as string | undefined) ?? '';
        this.error.set(detalle || 'Error al firmar la requisición. Intentá nuevamente.');
      },
    });
  }

  close(): void {
    this.router.navigate(['/app/inventario/requisiciones']);
  }
}
