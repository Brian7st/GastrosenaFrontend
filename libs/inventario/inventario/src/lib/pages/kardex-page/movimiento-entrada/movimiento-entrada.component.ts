import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LucideIconComponent, ButtonComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-movimiento-entrada',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LucideIconComponent, ButtonComponent],
  templateUrl: './movimiento-entrada.component.html',
  styleUrls: ['./movimiento-entrada.component.scss']
})
export class MovimientoEntradaComponent {
  entradaForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.entradaForm = this.fb.group({
      producto: ['', Validators.required],
      cantidad: [null, [Validators.required, Validators.min(1)]],
      fecha: ['', Validators.required],
      proveedor: ['', Validators.required],
      factura: [''],
      ubicacion: ['', Validators.required],
      valorUnitario: [null, [Validators.required, Validators.min(0)]],
      observaciones: ['']
    });
  }

  onSubmit() {
    if (this.entradaForm.valid) {
      console.log('Entrada guardada:', this.entradaForm.value);
      this.closeModal();
    }
  }

  closeModal() {
    this.router.navigate(['/app/inventario/movimientos']);
  }
}
