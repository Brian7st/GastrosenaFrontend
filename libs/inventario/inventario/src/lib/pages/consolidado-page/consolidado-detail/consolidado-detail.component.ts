import { ChangeDetectionStrategy, Component, computed, inject, signal, OnInit } from '@angular/core';
// Note: subtotalesPorTipo removed — old fields (tipo/cantidad/referencia) no longer in backend response.
import { CurrencyPipe } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ButtonComponent, DataTableComponent, KpiCardComponent } from '@restaurant/shared/ui';
import { ExportarConsolidadoModalComponent } from '../components/exportar-consolidado-modal/exportar-consolidado-modal.component';
import { ReversarConsolidadoModalComponent } from '../components/reversar-consolidado-modal/reversar-consolidado-modal.component';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { ConsolidadoFacade } from '../../../data-access/consolidado.facade';

@Component({
  selector: 'restaurant-consolidado-detail',
  standalone: true,
  imports: [RouterModule, CurrencyPipe, ButtonComponent, DataTableComponent, KpiCardComponent, ExportarConsolidadoModalComponent, ReversarConsolidadoModalComponent, BackButtonComponent],
  templateUrl: './consolidado-detail.component.html',
  styleUrl: './consolidado-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsolidadoDetailComponent implements OnInit {
  private router = inject(Router);
  private route  = inject(ActivatedRoute);
  private facade = inject(ConsolidadoFacade);

  // ── Estado reactivo desde facade ─────────────────────────────────────────
  consolidado = this.facade.consolidadoSeleccionado;
  loading     = this.facade.loading;

  /** Totales derivados de las líneas reales (monto y retencionZese por GIL). */
  totalMonto = computed(() =>
    this.consolidado()?.lineas.reduce((acc, l) => acc + l.monto, 0) ?? 0,
  );
  totalRetencion = computed(() =>
    this.consolidado()?.lineas.reduce((acc, l) => acc + l.retencionZese, 0) ?? 0,
  );

  ngOnInit(): void {
    const numeroStr = this.route.snapshot.paramMap.get('id');
    if (!numeroStr) {
      this.router.navigate(['/app/inventario/consolidado']);
      return;
    }
    const numero = Number(numeroStr);
    if (isNaN(numero)) {
      this.router.navigate(['/app/inventario/consolidado']);
      return;
    }
    this.facade.cargarConsolidadoPorNumero(numero);
  }

  showExportModal   = signal(false);
  showReversarModal = signal(false);
  isReversarBlocked = signal(false);

  goBack(): void {
    this.router.navigate(['/app/inventario/consolidado']);
  }

  openExportModal(): void {
    this.showExportModal.set(true);
  }

  closeExportModal(): void {
    this.showExportModal.set(false);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onExport(_format: 'excel' | 'pdf'): void {
    // Exportación real pendiente de integración HTTP
    this.showExportModal.set(false);
  }

  openReversarModal(): void {
    this.isReversarBlocked.set(this.consolidado()?.estado === 'REVERSADO');
    this.showReversarModal.set(true);
  }

  closeReversarModal(): void {
    this.showReversarModal.set(false);
  }

  confirmReversar(): void {
    const numero = this.consolidado()?.numero;
    if (numero !== undefined) this.facade.reversarConsolidado(numero);
    this.closeReversarModal();
  }
}
