import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { LucideIconComponent, ButtonComponent } from '@restaurant/shared/ui';
import { PresupuestoFacade } from '../../../data-access/presupuesto.facade';
import { RegistrarPresupuestoData } from '../../../models/presupuesto.model';

@Component({
  selector: 'restaurant-presupuesto-registrar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideIconComponent, ButtonComponent],
  templateUrl: './presupuesto-registrar.component.html',
  styleUrl: './presupuesto-registrar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresupuestoRegistrarComponent implements OnInit {
  private router = inject(Router);
  private fb     = inject(FormBuilder);
  private facade = inject(PresupuestoFacade);

  registroForm = this.fb.group({
    programaId:          ['', Validators.required],
    vigenciaFiscal:      [2025, Validators.required],
    nombreRubro:         ['', Validators.required],
    codigoPresupuestal:  ['', Validators.required],
    bolsaInicial:        [null as number | null, [Validators.required, Validators.min(1)]],
  });

  // Programas cargados desde la facade
  programas = this.facade.programas;

  readonly VIGENCIAS = [2024, 2025, 2026];

  ngOnInit(): void {
    this.facade.loadAll();
  }

  onSubmit(): void {
    if (this.registroForm.valid) {
      this.facade.registrarPresupuesto(this.registroForm.getRawValue() as RegistrarPresupuestoData);
      this.closeModal();
    }
  }

  closeModal(): void {
    this.router.navigate(['/app/inventario/presupuesto']);
  }
}
