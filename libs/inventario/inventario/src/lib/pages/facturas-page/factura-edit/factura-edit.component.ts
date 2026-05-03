import { ChangeDetectionStrategy, Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FacturasFacade } from '../../../data-access/facturas.facade';
import { Factura, FacturaItem, ConciliacionItem, MonedaFEL } from '../../../models/facturas.model';

@Component({
  selector: 'restaurant-factura-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './factura-edit.component.html',
  styleUrl: './factura-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacturaEditPageComponent implements OnInit {
  private facade = inject(FacturasFacade);
  private route  = inject(ActivatedRoute);
  private router = inject(Router);

  factura = this.facade.facturaSeleccionada;
  loading = this.facade.loading;

  // Editable fields (local state)
  nitCliente   = signal('');
  razonSocial  = signal('');
  tipoDoc      = signal('Factura Electrónica');
  fechaEmision = signal('');
  moneda       = signal<MonedaFEL>('COP');
  notasInternas = signal('');

  isBlocked = computed(() => {
    const f = this.factura();
    return f?.estado === 'Verificada' || f?.estado === 'Pagada' || f?.estado === 'Anulada';
  });

  hasConciliacion = computed(() => (this.factura()?.conciliacion?.length ?? 0) > 0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.facade.cargarFactura(id);
      // Populate local signals once loaded
      const intervalId = setInterval(() => {
        const f = this.factura();
        if (f) {
          clearInterval(intervalId);
          this.nitCliente.set(f.nitEmisor);
          this.razonSocial.set(f.razonSocial);
          this.fechaEmision.set(f.fechaEmision);
          this.moneda.set(f.moneda);
          this.notasInternas.set(f.notasInternas ?? '');
        }
      }, 100);
    }
  }

  onVolver(): void {
    this.router.navigate(['/app/inventario/facturas']);
  }

  onExportar(): void {
    console.log('Exportando factura...');
  }

  onAnular(): void {
    const id = this.factura()?.id;
    if (id) this.facade.anularFactura(id);
  }

  onGuardar(): void {
    const f = this.factura();
    if (!f) return;
    this.facade.actualizarFactura(f.id, {
      nitEmisor: this.nitCliente(),
      razonSocial: this.razonSocial(),
      fechaEmision: this.fechaEmision(),
      moneda: this.moneda(),
      notasInternas: this.notasInternas(),
    });
  }

  getCurrencySymbol(moneda: MonedaFEL): string {
    return moneda === 'GTQ' ? 'Q' : moneda === 'USD' ? '$' : '$';
  }

  formatMoney(value: number, moneda: MonedaFEL): string {
    const sym = this.getCurrencySymbol(moneda);
    return `${sym} ${value.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  getDiffClass(diff: number): string {
    if (diff < 0) return 'diff--negative';
    if (diff > 0) return 'diff--positive';
    return '';
  }
}
