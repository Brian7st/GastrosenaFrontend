import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { LucideIconComponent } from '@restaurant/shared/ui';
import { PaqueteFacade } from '../../../data-access/paquete.facade';
import { RequisicionesFacade } from '../../../data-access/requisiciones.facade';
import { I18nService } from '../../../i18n/i18n.service';

@Component({
  selector: 'restaurant-paquete-req-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideIconComponent],
  templateUrl: './paquete-req-detail.component.html',
  styleUrl: './paquete-req-detail.component.scss',
})
export class PaqueteReqDetailComponent implements OnInit {
  private router               = inject(Router);
  protected readonly i18n = inject(I18nService);
  private route                = inject(ActivatedRoute);
  private facade               = inject(PaqueteFacade);
  private requisicionesFacade  = inject(RequisicionesFacade);

  // ── Estado reactivo desde facades ────────────────────────────────────────
  loading      = this.facade.loading;
  requisicion  = this.requisicionesFacade.requisicionSeleccionada;

  ngOnInit(): void {
    const reqId = this.route.snapshot.queryParamMap.get('reqId')
      ?? this.facade.paqueteSeleccionado()?.requisicionId
      ?? '';
    if (reqId) {
      this.requisicionesFacade.cargarRequisicion(reqId);
    }
  }

  cerrarPanel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  /** La requisición ya está vinculada desde la creación del paquete — solo cierra el panel. */
  incluirEnPaquete(): void {
    this.cerrarPanel();
  }
}
