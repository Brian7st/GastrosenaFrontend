import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideIconComponent, ButtonComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-movimiento-salida',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, LucideIconComponent, ButtonComponent],
  templateUrl: './movimiento-salida.component.html',
  styleUrls: ['./movimiento-salida.component.scss']
})
export class MovimientoSalidaComponent {
  salidaForm: FormGroup;
  stockDisponible = 24;

  constructor(private fb: FormBuilder, private router: Router) {
    this.salidaForm = this.fb.group({
      producto: ['', Validators.required],
      cantidad: [null, [Validators.required, Validators.min(1)]],
      fecha: ['', Validators.required],
      areaDestino: ['', Validators.required],
      instructor: [''],
      ficha: ['', [Validators.pattern('^[0-9]{7}$')]],
      categoria: ['', Validators.required],
      proposito: ['', Validators.required],
      observaciones: ['']
    });
  }

  onSubmit() {
    if (this.salidaForm.valid) {
      this.closeModal();
    }
  }

  closeModal() {
    this.router.navigate(['/app/inventario/movimientos']);
  }
}
