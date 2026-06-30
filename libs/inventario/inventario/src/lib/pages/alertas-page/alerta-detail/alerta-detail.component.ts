import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnInit,
  inject,
} from '@angular/core';

import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { StatusBadgeComponent, ButtonComponent, LucideIconComponent, HasPermissionDirective } from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { AlertasFacade } from '../../../data-access/alertas.facade';
import { I18nService } from '../../../i18n/i18n.service';

@Component({
  selector: 'restaurant-alerta-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, StatusBadgeComponent, ButtonComponent, LucideIconComponent, HasPermissionDirective, BackButtonComponent],
  templateUrl: './alerta-detail.component.html',
  styleUrl: './alerta-detail.component.scss',
})
export class AlertaDetailComponent implements OnInit {
  private router  = inject(Router);
  protected readonly i18n = inject(I18nService);
  private route   = inject(ActivatedRoute);
  private facade  = inject(AlertasFacade);

  alerta = this.facade.alertaSeleccionada;

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const alerta = await this.facade.cargarAlerta(id);
      if (!alerta) {
        this.router.navigate(['/app/inventario/alertas']);
        return;
      }
    } else {
      this.router.navigate(['/app/inventario/alertas']);
      return;
    }
  }

  // ── Computed ──────────────────────────────────────────────────────────────
  porcentajeStock = computed(() => {
    const a = this.alerta();
    if (!a || !a.stockActual || !a.stockMinimo || a.stockMinimo === 0) return 0;
    return Math.min(100, (a.stockActual / a.stockMinimo) * 100);
  });

  prioridadLabel = computed(() => {
    const p = this.alerta()?.prioridad;
    const map: Record<string, string> = {
      ALTA: 'Alta', MEDIA: 'Media', BAJA: 'Baja',
    };
    return p ? (map[p] ?? p) : '';
  });

  prioridadVariant = computed((): 'danger' | 'warning' | 'info' | 'success' => {
    const map: Record<string, 'danger' | 'warning' | 'info' | 'success'> = {
      ALTA: 'warning', MEDIA: 'info', BAJA: 'success',
    };
    return map[this.alerta()?.prioridad ?? 'MEDIA'] ?? 'info';
  });

  // ── Navegación ────────────────────────────────────────────────────────────
  volver(): void {
    this.router.navigate(['/app/inventario/alertas']);
  }

  abrirResolver(): void {
    this.router.navigate(['resolver'], { relativeTo: this.route });
  }

  irAUmbral(): void {
    this.router.navigate(['/app/inventario/alertas/configuracion']);
  }
}
