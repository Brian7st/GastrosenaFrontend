import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideIconComponent, ButtonComponent } from '@restaurant/shared/ui';
import { PresupuestoFacade } from '../../../data-access/presupuesto.facade';

@Component({
  selector: 'restaurant-presupuesto-traslado',
  standalone: true,
  imports: [ReactiveFormsModule, LucideIconComponent, ButtonComponent],
  templateUrl: './presupuesto-traslado.component.html',
  styleUrl: './presupuesto-traslado.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresupuestoTrasladoComponent {
  private router  = inject(Router);
  private facade  = inject(PresupuestoFacade);
  private fb      = inject(FormBuilder);

  loading = this.facade.loading;

  rubros = this.facade.rubros;

  form = this.fb.nonNullable.group({
    presupuestoId:  ['', Validators.required],
    rubroOrigenId:  ['', Validators.required],
    rubroDestinoId: ['', Validators.required],
    monto:          [0, [Validators.required, Validators.min(1)]],
  });

  /** Unique presupuesto ids derived from rubros for the dropdown */
  presupuestos = computed(() => {
    const seen = new Set<string>();
    return this.rubros()
      .filter(r => { const ok = !seen.has(r.fichaId); seen.add(r.fichaId); return ok; })
      .map(r => ({ id: r.fichaId, label: r.programaFormacion }));
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { presupuestoId, rubroOrigenId, rubroDestinoId, monto } = this.form.getRawValue();
    this.facade.trasladarRubro({ presupuestoId, rubroOrigenId, rubroDestinoId, monto });
    this.closeModal();
  }

  closeModal(): void {
    this.router.navigate(['/app/inventario/presupuesto']);
  }
}
