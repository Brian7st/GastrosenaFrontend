import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { LucideIconComponent, ButtonComponent } from '@restaurant/shared/ui';
import { PresupuestoFacade } from '../../../data-access/presupuesto.facade';
import { GilesService } from '../../../data-access/services/giles.service';
import { FacturasService } from '../../../data-access/services/facturas.service';
import { GilResponse } from '../../../data-access/api/procurement.api';

/**
 * Comprometer presupuesto contra un GIL verificado (conciliación FEL↔GIL completa).
 * El backend (POST /budget/compromisos) exige que el GIL tenga conciliación
 * CONCILIADA; por eso sólo se ofrecen GILs en estado VERIFICADO.
 */
@Component({
  selector: 'restaurant-presupuesto-cargar-gil',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideIconComponent, ButtonComponent],
  templateUrl: './presupuesto-cargar-gil.component.html',
  styleUrl: './presupuesto-cargar-gil.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresupuestoCargarGilComponent implements OnInit {
  private router          = inject(Router);
  private facade          = inject(PresupuestoFacade);
  private giles           = inject(GilesService);
  private facturasService = inject(FacturasService);

  loading      = this.facade.loading;
  error        = this.facade.error;
  presupuestos = this.facade.presupuestos;
  gilesVerificados = signal<GilResponse[]>([]);

  // FEL vinculado al GIL seleccionado
  felNumero    = signal('');
  felCufe      = signal('');
  felId        = signal('');
  cargandoFel  = signal(false);

  // ── Campos del formulario ──────────────────────────────────────────────────
  presupuestoId      = signal('');
  rubroId            = signal('');
  gilId              = signal('');
  concepto           = signal('');
  monto              = signal<number>(0);
  aplicarZESE        = signal(false);
  autorizarSobregiro = signal(false);
  fecha              = signal(new Date().toISOString().split('T')[0]);
  submitAttempted    = signal(false);

  /** Presupuesto seleccionado (para derivar ficha, programa y sus rubros). */
  presupuestoSel = computed(() =>
    this.presupuestos().find(p => p.id === this.presupuestoId()),
  );

  /** Rubros del presupuesto elegido. */
  rubrosDelPresupuesto = computed(() => this.presupuestoSel()?.rubros ?? []);

  rubroSel = computed(() =>
    this.rubrosDelPresupuesto().find(r => r.id === this.rubroId()),
  );

  formularioValido = computed(() =>
    !!this.presupuestoId() && !!this.rubroId() && !!this.gilId() &&
    this.concepto().trim().length > 0 && this.monto() > 0,
  );

  /** Al elegir un GIL: auto-rellena monto, concepto y busca el FEL conciliado. */
  onGilChange(gilId: string): void {
    this.gilId.set(gilId);
    this.felNumero.set('');
    this.felCufe.set('');
    this.felId.set('');

    const gil = this.gilesVerificados().find(g => g.id === gilId);
    const total = (gil?.bienes ?? []).reduce(
      (acc, b) => acc + (b.subtotal ?? 0) + (b.iva ?? 0), 0,
    );
    if (total > 0) this.monto.set(total);
    if (gil?.numeroGil && !this.concepto().trim()) {
      this.concepto.set('Compromiso ' + gil.numeroGil);
    }

    // Traer el FEL vinculado por conciliación
    this.cargandoFel.set(true);
    this.facturasService.getConciliacionGil({ gilId })
      .pipe(
        switchMap(conciliacion =>
          this.facturasService.getFacturaById(conciliacion.facturaId),
        ),
      )
      .subscribe({
        next: factura => {
          if (factura) {
            this.felNumero.set(factura.numeroFactura);
            this.felCufe.set(factura.cufe);
            this.felId.set(String(factura.id));
          }
          this.cargandoFel.set(false);
        },
        error: () => this.cargandoFel.set(false),
      });
  }

  ngOnInit(): void {
    this.facade.cargarPresupuestos();
    // El gate de comprometer es la conciliación CONCILIADA, no el estado del GIL.
    // Los GILs VERIFICADO y CERRADO ya pasaron conciliación → ambos son elegibles.
    forkJoin({
      verificados: this.giles.getGiles({ estado: 'VERIFICADO', size: 100 }),
      cerrados:    this.giles.getGiles({ estado: 'CERRADO', size: 100 }),
    }).subscribe(({ verificados, cerrados }) =>
      this.gilesVerificados.set([...(verificados.content ?? []), ...(cerrados.content ?? [])]),
    );
  }

  onPresupuestoChange(id: string): void {
    this.presupuestoId.set(id);
    this.rubroId.set(''); // resetear rubro al cambiar de presupuesto
  }

  onComprometer(): void {
    this.submitAttempted.set(true);
    const presupuesto = this.presupuestoSel();
    if (!this.formularioValido() || !presupuesto) return;

    const data = {
      presupuestoId:      presupuesto.id,
      rubroId:            this.rubroId(),
      gilId:              this.gilId(),
      facturaId:          this.felId() || undefined,
      fichaId:            presupuesto.fichaId,
      programaId:         presupuesto.programaFormacion,
      concepto:           this.concepto().trim(),
      monto:              this.monto(),
      aplicarZESE:        this.aplicarZESE(),
      autorizarSobregiro: this.autorizarSobregiro(),
      fecha:              this.fecha(),
    };

    const cufe = this.felCufe();
    if (cufe) {
      // Flujo atómico: solo cerramos el panel si comprometer+pagar tuvo éxito.
      // Si falla, el backend hizo rollback y el error queda visible en el panel.
      this.facade.comprometerYPagar(data, cufe).subscribe(ok => {
        if (ok) this.closePanel();
      });
    } else {
      this.facade.comprometer(data);
      this.closePanel();
    }
  }

  closePanel(): void {
    this.router.navigate(['/app/inventario/presupuesto']);
  }
}
