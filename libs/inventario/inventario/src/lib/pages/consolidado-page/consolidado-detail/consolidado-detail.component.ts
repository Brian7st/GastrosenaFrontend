import { ChangeDetectionStrategy, Component, computed, inject, signal, OnInit } from '@angular/core';
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

  // ── Subtotales agrupados por tipo de línea ────────────────────────────────
  subtotalesPorTipo = computed(() => {
    const lineas = this.consolidado()?.lineas ?? [];
    const grupos: Record<string, { tipo: string; cantidad: number; valor: number }> = {};
    for (const l of lineas) {
      if (!grupos[l.tipo]) grupos[l.tipo] = { tipo: l.tipo, cantidad: 0, valor: 0 };
      grupos[l.tipo].cantidad += l.cantidad;
      grupos[l.tipo].valor    += l.valor;
    }
    return Object.values(grupos);
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/app/inventario/consolidado']);
      return;
    }
    this.facade.cargarConsolidado(id);
  }

  showExportModal   = signal(false);
  showReversarModal = signal(false);
  isReversarBlocked = signal(false);

  goBack(): void {
    this.router.navigate(['/app/inventario/consolidado']);
  }

  goToGilDetail(codigo: string): void {
    this.router.navigate(['/app/inventario/solicitudes-gil', codigo]);
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
    this.isReversarBlocked.set(false);
    this.showReversarModal.set(true);
  }

  closeReversarModal(): void {
    this.showReversarModal.set(false);
  }

  confirmReversar(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.facade.reversarConsolidado(id);
    this.closeReversarModal();
  }
}
