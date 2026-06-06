import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideIconComponent, ButtonComponent } from '@restaurant/shared/ui';
import { KardexFacade } from '../../../data-access/kardex.facade';
import { BienesService } from '../../../data-access/services/bienes.service';
import { AjusteMovimientoData } from '../../../models/movimiento.model';
import { Bien } from '../../../models/inventario.model';

/**
 * Canal controlado para correcciones de stock que no provienen de una factura FEL.
 * Casos de uso: mermas, devoluciones, ajustes por conteo físico, carga inicial.
 * Las entradas de compra DEBEN ingresar mediante el flujo de conciliación FEL.
 *
 * productoId en el payload = codigoSena del catálogo (no un UUID interno).
 */
@Component({
  selector: 'restaurant-movimiento-ajuste',
  standalone: true,
  imports: [ReactiveFormsModule, LucideIconComponent, ButtonComponent],
  templateUrl: './movimiento-ajuste.component.html',
  styleUrl: './movimiento-ajuste.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovimientoAjusteComponent {
  private fb            = inject(FormBuilder);
  private router        = inject(Router);
  private bienesService = inject(BienesService);
  readonly facade       = inject(KardexFacade);

  // ── Estado del selector de producto ─────────────────────────────────────────

  readonly busqueda        = signal('');
  readonly resultados      = signal<Bien[]>([]);
  readonly buscando        = signal(false);
  readonly selectorAbierto = signal(false);
  readonly productoSeleccionado = signal<Bien | null>(null);

  // ── Formulario ───────────────────────────────────────────────────────────────

  readonly ajusteForm: FormGroup = this.fb.group({
    productoId:    ['', Validators.required],
    cantidadNueva: [null, [Validators.required, Validators.min(0)]],
    motivo:        ['', [Validators.required, Validators.minLength(1)]],
    autorizado:    [true],
  });

  // ── Estado de UI ─────────────────────────────────────────────────────────────

  readonly successMessage = signal<string | null>(null);

  readonly etiquetaProducto = computed(() => {
    const p = this.productoSeleccionado();
    if (!p) return '';
    return `${p.descripcion} — ${p.codigoSena}`;
  });

  // ── Búsqueda de productos ────────────────────────────────────────────────────

  onBusquedaChange(event: Event): void {
    const valor = (event.target as HTMLInputElement).value;
    this.busqueda.set(valor);
    this.selectorAbierto.set(true);

    if (valor.trim().length < 2) {
      this.resultados.set([]);
      return;
    }

    this.buscando.set(true);
    this.bienesService
      .getBienes({ busqueda: valor.trim(), estado: 'Activo', size: 10, page: 0 })
      .subscribe({
        next: ({ bienes }) => {
          this.resultados.set(bienes);
          this.buscando.set(false);
        },
        error: () => {
          this.resultados.set([]);
          this.buscando.set(false);
        },
      });
  }

  seleccionarProducto(bien: Bien): void {
    this.productoSeleccionado.set(bien);
    // codigoSena es el identificador que el backend llama "productoId"
    this.ajusteForm.patchValue({ productoId: bien.codigoSena });
    this.busqueda.set('');
    this.resultados.set([]);
    this.selectorAbierto.set(false);
  }

  limpiarProducto(): void {
    this.productoSeleccionado.set(null);
    this.ajusteForm.patchValue({ productoId: '' });
    this.busqueda.set('');
    this.resultados.set([]);
  }

  cerrarSelector(): void {
    this.selectorAbierto.set(false);
  }

  // ── Submit ───────────────────────────────────────────────────────────────────

  onSubmit(): void {
    if (this.ajusteForm.invalid) {
      this.ajusteForm.markAllAsTouched();
      return;
    }

    const raw = this.ajusteForm.getRawValue() as {
      productoId:    string;
      cantidadNueva: number;
      motivo:        string;
      autorizado:    boolean;
    };

    const payload: AjusteMovimientoData = {
      producto:      raw.productoId,
      cantidadNueva: raw.cantidadNueva,
      motivo:        raw.motivo,
      autorizado:    raw.autorizado,
      referenciaId:  null,
    };

    this.facade.registrarAjuste(payload);
    this.successMessage.set('Ajuste registrado correctamente.');
    setTimeout(() => this.successMessage.set(null), 4000);
    this.ajusteForm.reset({ autorizado: true });
    this.limpiarProducto();
  }

  closeModal(): void {
    this.router.navigate(['/app/inventario/movimientos']);
  }
}
