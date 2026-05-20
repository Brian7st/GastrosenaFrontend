import {
  ChangeDetectionStrategy,
  Component,
  signal,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Alerta, AccionResolver } from '../../../../models/alerta.model';
import { AlertasFacade } from '../../../../data-access/alertas.facade';

@Component({
  selector: 'restaurant-alerta-resolver',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './alerta-resolver.component.html',
  styleUrl: './alerta-resolver.component.scss',
})
export class AlertaResolverComponent implements OnInit {
  private router  = inject(Router);
  private route   = inject(ActivatedRoute);
  private fb      = inject(FormBuilder);
  private facade  = inject(AlertasFacade);

  alerta = this.facade.alertaSeleccionada;
  accionSeleccionada = signal<AccionResolver | ''>('');

  resolverForm: FormGroup = this.fb.group({
    accion:      ['', Validators.required],
    referencia:  [''],
    descripcion: ['', Validators.required],
    responsable: [{ value: 'Administrador Centro de Formación', disabled: true }],
  });

  ngOnInit(): void {
    // El id está en el padre (alertas/:id/resolver)
    const id = this.route.parent?.snapshot.paramMap.get('id');
    if (id && this.facade.alertaSeleccionada()?.id !== id) {
       this.facade.cargarAlerta(id);
    }
  }

  get prioridadLabel(): string {
    const map: Record<string, string> = {
      critica: 'Crítica', alta: 'Alta', media: 'Media', baja: 'Baja',
    };
    return map[this.alerta()?.prioridad ?? 'critica'] ?? 'Crítica';
  }

  selectAccion(accion: AccionResolver): void {
    this.accionSeleccionada.set(accion);
    this.resolverForm.patchValue({ accion });
  }

  onConfirmar(): void {
    if (this.resolverForm.valid) {
      const id = this.alerta()?.id;
      if (id) {
         this.facade.resolverAlerta(id, this.resolverForm.getRawValue());
      }
      this.cerrar();
    }
  }

  cerrar(): void {
    const id = this.alerta()?.id;
    this.router.navigate(['/app/inventario/alertas', id]);
  }
}
