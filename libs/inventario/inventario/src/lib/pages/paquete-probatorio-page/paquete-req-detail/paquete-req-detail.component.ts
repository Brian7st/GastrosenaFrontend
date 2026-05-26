import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { LucideIconComponent } from '@restaurant/shared/ui';
import { PaqueteFacade } from '../../../data-access/paquete.facade';

@Component({
  selector: 'restaurant-paquete-req-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideIconComponent],
  templateUrl: './paquete-req-detail.component.html',
  styleUrl: './paquete-req-detail.component.scss',
})
export class PaqueteReqDetailComponent {
  private router = inject(Router);
  private route  = inject(ActivatedRoute);
  private facade = inject(PaqueteFacade);

  // ── Estado reactivo desde facade ─────────────────────────────────────────
  loading = this.facade.loading;

  cerrarPanel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  incluirEnPaquete(): void {
    const paqueteId = this.route.parent?.snapshot.paramMap.get('id') ?? '';
    const reqId     = this.route.snapshot.queryParamMap.get('reqId') ?? '';
    if (paqueteId) {
      this.facade.incluirRequisicion(paqueteId, reqId);
    }
    this.cerrarPanel();
  }
}
