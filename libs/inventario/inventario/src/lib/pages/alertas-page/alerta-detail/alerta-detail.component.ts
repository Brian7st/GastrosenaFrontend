import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { StatusBadgeComponent, ButtonComponent, LucideIconComponent } from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { Alerta } from '../../../models/alerta.model';
import { AlertasFacade } from '../../../data-access/alertas.facade';

@Component({
  selector: 'restaurant-alerta-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, StatusBadgeComponent, ButtonComponent, LucideIconComponent, BackButtonComponent],
  templateUrl: './alerta-detail.component.html',
  styleUrl: './alerta-detail.component.scss',
})
export class AlertaDetailComponent implements OnInit {
  private router  = inject(Router);
  private route   = inject(ActivatedRoute);
  private facade  = inject(AlertasFacade);

  alerta = this.facade.alertaSeleccionada;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.facade.cargarAlerta(id);
    }
  }

  // ── Computed ──────────────────────────────────────────────────────────────
  porcentajeStock = computed(() => {
    const a = this.alerta();
    if (!a || a.stockObjetivo === 0) return 0;
    return Math.min(100, (a.stockActual / a.stockObjetivo) * 100);
  });

  prioridadLabel = computed(() => {
    const p = this.alerta()?.prioridad;
    const map: Record<string, string> = {
      critica: 'Crítica', alta: 'Alta', media: 'Media', baja: 'Baja',
    };
    return p ? map[p] : '';
  });

  prioridadVariant = computed((): 'danger' | 'warning' | 'info' | 'success' => {
    const map: Record<string, 'danger' | 'warning' | 'info' | 'success'> = {
      critica: 'danger', alta: 'warning', media: 'info', baja: 'success',
    };
    return map[this.alerta()?.prioridad ?? 'media'] ?? 'info';
  });

  // ── Navegación ────────────────────────────────────────────────────────────
  volver(): void {
    this.router.navigate(['/app/inventario/alertas']);
  }

  abrirResolver(): void {
    const id = this.alerta()?.id;
    this.router.navigate(['resolver'], { relativeTo: this.route });
  }

  irAUmbral(): void {
    this.router.navigate(['/app/inventario/alertas/configuracion']);
  }
}
