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
import { MOCK_ALERTAS, Alerta, AccionResolver } from '../../../../models/alerta.model';

@Component({
  selector: 'restaurant-alerta-resolver',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './alerta-resolver.component.html',
  styleUrls: ['./alerta-resolver.component.scss'],
})
export class AlertaResolverComponent implements OnInit {
  private router  = inject(Router);
  private route   = inject(ActivatedRoute);
  private fb      = inject(FormBuilder);

  alerta = signal<Alerta | undefined>(undefined);
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
    const found = MOCK_ALERTAS.find(a => a.id === id);
    this.alerta.set(found ?? MOCK_ALERTAS[0]);
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
      console.log('Resolución confirmada:', this.resolverForm.getRawValue());
      this.cerrar();
    }
  }

  cerrar(): void {
    const id = this.alerta()?.id;
    this.router.navigate(['/app/inventario/alertas', id]);
  }
}
