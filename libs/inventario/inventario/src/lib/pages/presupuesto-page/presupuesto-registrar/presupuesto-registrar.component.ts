import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { LucideIconComponent, ButtonComponent } from '@restaurant/shared/ui';
import { PresupuestoFacade } from '../../../data-access/presupuesto.facade';
import { RegistrarPresupuestoData } from '../../../models/presupuesto.model';

@Component({
  selector: 'restaurant-presupuesto-registrar',
  standalone: true,
  imports: [ReactiveFormsModule, LucideIconComponent, ButtonComponent],
  templateUrl: './presupuesto-registrar.component.html',
  styleUrl: './presupuesto-registrar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresupuestoRegistrarComponent implements OnInit {
  private router = inject(Router);
  private fb     = inject(FormBuilder);
  private facade = inject(PresupuestoFacade);

  // Grupos de rubros agrupados por ficha (para el selector de programa)
  grupos = this.facade.grupos;

  readonly VIGENCIAS = [2024, 2025, 2026];

  /**
   * Formulario alineado con el payload real POST /budget/presupuestos.
   * Un presupuesto tiene múltiples rubros; este formulario crea uno con un solo rubro.
   */
  registroForm = this.fb.nonNullable.group({
    fichaId:           ['', Validators.required],
    programaFormacion: ['', Validators.required],
    vigencia:          [new Date().getFullYear(), Validators.required],
    fechaAprobacion:   ['', Validators.required],
    // Rubro único inline
    rubroCodigo:       ['', Validators.required],
    rubroDescripcion:  ['', Validators.required],
    montoAsignado:     [0, [Validators.required, Validators.min(1)]],
  });

  ngOnInit(): void {
    this.facade.loadAll();
  }

  onSubmit(): void {
    if (this.registroForm.valid) {
      const v = this.registroForm.getRawValue();
      const data: RegistrarPresupuestoData = {
        fichaId:           v.fichaId,
        programaFormacion: v.programaFormacion,
        vigencia:          v.vigencia,
        fechaAprobacion:   v.fechaAprobacion,
        rubros: [{
          codigo:        v.rubroCodigo,
          descripcion:   v.rubroDescripcion,
          montoAsignado: v.montoAsignado,
        }],
      };
      this.facade.registrarPresupuesto(data);
      this.closeModal();
    }
  }

  closeModal(): void {
    this.router.navigate(['/app/inventario/presupuesto']);
  }
}
