import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LucideIconComponent } from '@restaurant/shared/ui';
import { RequisicionesFacade } from '../../../data-access/requisiciones.facade';

@Component({
  selector: 'restaurant-requisiciones-despacho',
  standalone: true,
  imports: [LucideIconComponent],
  templateUrl: './requisiciones-despacho.component.html',
  styleUrl: './requisiciones-despacho.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequisicionesDespachoComponent implements OnInit {
  private router  = inject(Router);
  private route   = inject(ActivatedRoute);
  readonly facade = inject(RequisicionesFacade);

  requisicionId       = '';
  // Identificador del ecónomo que despacha (documento o ID). Texto libre,
  // como la firma del vocero — sin lista hardcodeada.
  economoId           = signal('');
  procesando          = signal(false);
  error               = signal<string | null>(null);
  requisicion         = this.facade.requisicionSeleccionada;
  loading             = this.facade.loading;

  puedeDespachar = computed(() =>
    this.economoId().trim().length > 0 && !this.procesando()
  );

  ngOnInit(): void {
    this.requisicionId = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.requisicionId) {
      this.facade.cargarRequisicion(this.requisicionId);
    } else {
      this.router.navigate(['/app/inventario/requisiciones']);
    }
  }

  onEconomo(event: Event): void {
    this.economoId.set((event.target as HTMLInputElement).value);
  }

  finalizarEntrega(): void {
    if (!this.requisicionId || !this.puedeDespachar()) return;
    this.procesando.set(true);
    this.error.set(null);

    this.facade.despacharRequisicion(this.requisicionId, this.economoId().trim()).subscribe({
      next: () => {
        this.router.navigate(['/app/inventario/requisiciones']);
      },
      error: (err) => {
        this.procesando.set(false);
        const detalle = (err?.error?.detail as string | undefined) ?? '';
        this.error.set(detalle || 'No se pudo registrar el despacho. Intentá nuevamente.');
      },
    });
  }

  close(): void {
    this.router.navigate(['/app/inventario/requisiciones']);
  }
}
