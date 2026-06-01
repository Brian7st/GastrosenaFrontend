import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { LucideIconComponent } from '@restaurant/shared/ui';
import { RequisicionesFacade } from '../../../data-access/requisiciones.facade';
import { RequisicionesService } from '../../../data-access/services/requisiciones.service';
import { RequisicionItem } from '../../../models/requisicion.model';

const CATEGORIA_LABELS: Record<string, string> = {
  'ABARROTES':              'Abarrotes y Secos',
  'FRUTAS_Y_VEGETALES':     'Fruver',
  'LACTEOS':                'Lácteos',
  'CARNES_PESCADOS_MARISCOS': 'Carnes y Proteínas',
  'BEBIDAS':                'Bebidas',
};

const ESTADO_LABELS: Record<string, string> = {
  'BORRADOR':   'Borrador',
  'ENVIADA':    'Enviada',
  'DESPACHADA': 'Despachada',
  'FIRMADA':    'Firmada',
  'LEGALIZADA': 'Legalizada',
};

const ESTADO_CLASS: Record<string, string> = {
  'BORRADOR':   'draft',
  'ENVIADA':    'sent',
  'DESPACHADA': 'info',
  'FIRMADA':    'success',
  'LEGALIZADA': 'success',
};

@Component({
  selector: 'restaurant-requisiciones-detalle',
  standalone: true,
  imports: [RouterModule, LucideIconComponent, DecimalPipe],
  templateUrl: './requisiciones-detalle.component.html',
  styleUrl: './requisiciones-detalle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequisicionesDetalleComponent implements OnInit {
  private router  = inject(Router);
  private route   = inject(ActivatedRoute);
  private facade  = inject(RequisicionesFacade);
  private service = inject(RequisicionesService);

  requisicion  = this.facade.requisicionSeleccionada;
  loading      = this.facade.loading;
  error        = this.facade.error;

  reqId        = computed(() => this.requisicion()?.id ?? '');
  estado       = computed(() => this.requisicion()?.estado ?? '');
  estadoLabel  = computed(() => ESTADO_LABELS[this.estado()] ?? this.estado());
  estadoClass  = computed(() => ESTADO_CLASS[this.estado()] ?? 'draft');

  itemsPorCategoria = computed(() => {
    const items = this.requisicion()?.items ?? [];
    const grupos = new Map<string, RequisicionItem[]>();
    for (const item of items) {
      const cat = item.categoria ?? 'ABARROTES';
      if (!grupos.has(cat)) grupos.set(cat, []);
      grupos.get(cat)!.push(item);
    }
    return Array.from(grupos.entries()).map(([cat, catItems]) => ({
      cat,
      label: CATEGORIA_LABELS[cat] ?? cat,
      items: catItems,
    }));
  });

  totalItems = computed(() => this.requisicion()?.items?.length ?? 0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.facade.cargarRequisicion(id);
    } else {
      this.router.navigate(['/app/inventario/requisiciones']);
    }
  }

  enviar(): void {
    const id = this.reqId();
    if (!id) return;
    this.facade.enviarRequisicion(id);
  }

  exportar(): void {
    const id = this.reqId();
    if (!id) return;
    this.service.exportarRequisicion(id).subscribe({
      error: (err) => console.error('[RequisicionesDetalle] Error al exportar:', err),
    });
  }

  close(): void {
    this.router.navigate(['/app/inventario/requisiciones']);
  }
}
