import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LucideIconComponent } from '../../../shared/components/lucide-icon.component';
import { RubroPresupuestal, VencimientoProximo, MOCK_RUBROS, MOCK_VENCIMIENTOS } from '../models/presupuesto.model';

import { RegistrarModalComponent } from '../components/registrar-modal/registrar-modal.component';
import { ExportarReporteModalComponent } from '../components/exportar-reporte-modal/exportar-reporte-modal.component';

@Component({
    selector: 'app-presupuesto-dashboard',
    imports: [CommonModule, RouterModule, LucideIconComponent, RegistrarModalComponent, ExportarReporteModalComponent],
    templateUrl: './presupuesto-dashboard.component.html',
    styleUrl: './presupuesto-dashboard.component.scss'
})
export class PresupuestoDashboardComponent {
  rubros = signal<RubroPresupuestal[]>(MOCK_RUBROS);
  vencimientos = signal<VencimientoProximo[]>(MOCK_VENCIMIENTOS);

  // Modales
  showRegistrarModal = signal(false);
  showExportarModal = signal(false);

  // Group rubros by programa
  rubrosPorPrograma = computed(() => {
    const agrupados = new Map<string, RubroPresupuestal[]>();
    this.rubros().forEach(r => {
      if (!agrupados.has(r.programa)) {
        agrupados.set(r.programa, []);
      }
      agrupados.get(r.programa)!.push(r);
    });
    return Array.from(agrupados.entries()).map(([programa, items]) => ({
      programa,
      items
    }));
  });

  // Totales generales
  totales = computed(() => {
    return this.rubros().reduce((acc, curr) => ({
      apropiacion: acc.apropiacion + curr.apropiacionInicial,
      disponible: acc.disponible + curr.disponible,
      comprometido: acc.comprometido + curr.comprometido,
      pagado: acc.pagado + curr.pagado,
      retencionZese: acc.retencionZese + curr.retencionZese
    }), { apropiacion: 0, disponible: 0, comprometido: 0, pagado: 0, retencionZese: 0 });
  });

  constructor(private router: Router) {}

  formatCurrency(value: number): string {
    return '$' + value.toLocaleString('es-CO');
  }

  abrirRegistrar() {
    this.showRegistrarModal.set(true);
  }

  cerrarRegistrar() {
    this.showRegistrarModal.set(false);
  }

  abrirExportar() {
    this.showExportarModal.set(true);
  }

  cerrarExportar() {
    this.showExportarModal.set(false);
  }

  verDetalle(id: string) {
    this.router.navigate(['/presupuesto', id]);
  }
}
