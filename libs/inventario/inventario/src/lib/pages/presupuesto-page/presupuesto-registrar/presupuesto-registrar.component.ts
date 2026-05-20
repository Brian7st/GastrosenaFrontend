import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { LucideIconComponent, ButtonComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-presupuesto-registrar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideIconComponent, ButtonComponent],
  templateUrl: './presupuesto-registrar.component.html',
  styleUrl: './presupuesto-registrar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresupuestoRegistrarComponent {
  private router = inject(Router);
  private fb = inject(FormBuilder);

  registroForm = this.fb.group({
    programaId: ['', Validators.required],
    vigenciaFiscal: [2025, Validators.required],
    nombreRubro: ['', Validators.required],
    codigoPresupuestal: ['', Validators.required],
    bolsaInicial: [null as number | null, [Validators.required, Validators.min(1)]],
  });

  programas = [
    { id: 'PRG-001', nombre: 'Formación Profesional Integral' },
    { id: 'PRG-002', nombre: 'Gestión Administrativa Regional' },
    { id: 'PRG-003', nombre: 'Mantenimiento de Infraestructura' },
    { id: 'PRG-004', nombre: 'Bienestar al Aprendiz' },
    { id: 'PRG-005', nombre: 'Investigación y Desarrollo (SENNOVA)' },
  ];

  vigencias = [2024, 2025, 2026];

  onSubmit(): void {
    if (this.registroForm.valid) {
      console.log('Guardando presupuesto:', this.registroForm.value);
      this.closeModal();
    }
  }

  closeModal(): void {
    this.router.navigate(['/app/inventario/presupuesto']);
  }
}
