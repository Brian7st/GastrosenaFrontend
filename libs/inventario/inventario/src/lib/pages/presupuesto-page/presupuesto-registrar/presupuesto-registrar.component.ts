import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';

import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { LucideIconComponent, ButtonComponent } from '@restaurant/shared/ui';
import { PresupuestoFacade } from '../../../data-access/presupuesto.facade';
import { ProgramasService, Programa } from '../../../data-access/services/programas.service';
import { FuenteFinanciacion, RegistrarPresupuestoData } from '../../../models/presupuesto.model';
import { I18nService } from '../../../i18n/i18n.service';

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
  protected readonly i18n = inject(I18nService);
  private fb     = inject(FormBuilder);
  private facade = inject(PresupuestoFacade);
  private programasService = inject(ProgramasService);

  /** Catálogo de los 5 programas para el selector. */
  programas = signal<Programa[]>([]);

  /** Vigencias seleccionables: año en curso y los próximos dos. Se calcula en runtime para no quedar desactualizado. */
  readonly VIGENCIAS = Array.from(
    { length: 3 },
    (_, offset) => new Date().getFullYear() + offset,
  );

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
    rubroCodigo:               ['', Validators.required],
    rubroDescripcion:          ['', Validators.required],
    rubroPosicionPresupuestal: ['', Validators.required],
    rubroDependencia:          ['', Validators.required],
    rubroFuente:               ['NACION' as FuenteFinanciacion, Validators.required],
    montoAsignado:             [0, [Validators.required, Validators.min(1)]],
  });

  readonly FUENTES: FuenteFinanciacion[] = ['NACION', 'PROPIOS'];

  ngOnInit(): void {
    this.facade.loadAll();
    this.programasService.getProgramas().subscribe(p => this.programas.set(p));
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
          codigo:               v.rubroCodigo,
          descripcion:          v.rubroDescripcion,
          posicionPresupuestal: v.rubroPosicionPresupuestal,
          dependencia:          v.rubroDependencia,
          fuente:               v.rubroFuente,
          montoAsignado:        v.montoAsignado,
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
