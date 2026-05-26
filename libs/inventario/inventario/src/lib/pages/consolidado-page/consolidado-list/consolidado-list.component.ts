import { ChangeDetectionStrategy, Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonComponent, DataTableComponent, KpiCardComponent, StatusBadgeComponent } from '@restaurant/shared/ui';
import { ExportarConsolidadoModalComponent } from '../components/exportar-consolidado-modal/exportar-consolidado-modal.component';
import { ReversarConsolidadoModalComponent } from '../components/reversar-consolidado-modal/reversar-consolidado-modal.component';
import { Consolidado } from '../../../models/consolidado.model';
import { ConsolidadoFacade } from '../../../data-access/consolidado.facade';

@Component({
  selector: 'restaurant-consolidado-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent, DataTableComponent, KpiCardComponent, StatusBadgeComponent, ExportarConsolidadoModalComponent, ReversarConsolidadoModalComponent],
  templateUrl: './consolidado-list.component.html',
  styleUrl: './consolidado-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsolidadoListComponent implements OnInit {
  private router = inject(Router);
  private facade = inject(ConsolidadoFacade);

  // ── Estado reactivo desde facade ─────────────────────────────────────────
  consolidados = this.facade.consolidados;
  loading      = this.facade.loading;

  showExportModal      = signal(false);
  showReversarModal    = signal(false);
  selectedReversarItem = signal<Consolidado | null>(null);
  isReversarBlocked    = signal(false);

  // ── KPIs derivados de la lista real ─────────────────────────────────────
  kpiTotalEjecutado = computed(() =>
    this.consolidados().reduce((acc, c) => acc + c.totales.totalGeneral, 0)
  );
  kpiContabilizados = computed(() =>
    this.consolidados().filter(c => c.estado === 'CONTABILIZADO').length
  );
  kpiGenerados = computed(() =>
    this.consolidados().filter(c => c.estado === 'GENERADO').length
  );
  kpiReversados = computed(() =>
    this.consolidados().filter(c => c.estado === 'REVERSADO').length
  );

  ngOnInit(): void {
    this.facade.loadAll();
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

  goToDetail(id: string): void {
    this.router.navigate(['/app/inventario/consolidado', id]);
  }

  reversar(id: string): void {
    const item = this.consolidados().find(c => c.id === id);
    if (item) {
      this.selectedReversarItem.set(item);
      this.isReversarBlocked.set(item.estado === 'CONTABILIZADO');
      this.showReversarModal.set(true);
    }
  }

  getVariantFromEstado(estado: string): 'info' | 'success' | 'danger' | 'warning' {
    const map: Record<string, 'info' | 'success' | 'danger' | 'warning'> = {
      GENERADO:      'info',
      CONTABILIZADO: 'success',
      REVERSADO:     'danger',
    };
    return map[estado] ?? 'warning';
  }

  closeReversarModal(): void {
    this.showReversarModal.set(false);
    this.selectedReversarItem.set(null);
  }

  confirmReversar(): void {
    const id = this.selectedReversarItem()?.id;
    if (id) this.facade.reversarConsolidado(id);
    this.closeReversarModal();
  }
}
