import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { LucideIconComponent, KpiCardComponent } from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { ConciliacionFacade } from '../../../data-access/conciliacion.facade';
import { DiferenciaItem } from '../../../models/conciliacion.model';
import { I18nService } from '../../../i18n/i18n.service';

@Component({
  selector: 'restaurant-conciliacion-detalle',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    LucideIconComponent,
    KpiCardComponent,
    BackButtonComponent,
  ],
  templateUrl: './conciliacion-detalle.component.html',
  styleUrl: './conciliacion-detalle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConciliacionDetalleComponent implements OnInit {
  private location = inject(Location);
  protected readonly i18n = inject(I18nService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private facade = inject(ConciliacionFacade);

  // ── Estado reactivo desde facade ─────────────────────────────────────────
  detalle = this.facade.conciliacionSeleccionada;
  diferenciasList = this.facade.diferenciasList;
  loading = this.facade.loading;

  // ── Estado local del modal de resolución ─────────────────────────────────
  private conciliacionId = '';
  showResolverModal = signal(false);
  diferenciaSeleccionada = signal<DiferenciaItem | null>(null);
  justificacion = signal('');

  // ── Regla de negocio (RF-5.8): solo se puede cerrar cuando todas las
  //    diferencias están resueltas y la conciliación no está ya COMPLETADA.
  puedeCerrar = computed(() => {
    const det = this.detalle();
    if (!det || det.estado === 'COMPLETADA') return false;
    return this.diferenciasList().every(d => d.estado === 'RESUELTA');
  });

  diferenciasPendientes = computed(() =>
    this.diferenciasList().filter(d => d.estado !== 'RESUELTA').length
  );

  // El valor total de diferencias es una magnitud (≥ 0) que representa una pérdida:
  // se muestra como negativo. Antes se anteponía '-$' a un valor ya negado, lo que
  // producía el doble signo "-$-19200".
  valoracionMonetaria = computed(() => {
    const total = this.detalle()?.valorTotalDiferencias ?? 0;
    if (total === 0) return '$0';
    return '-$' + new Intl.NumberFormat('es-CO').format(total);
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['../historial'], { relativeTo: this.route });
      return;
    }
    this.conciliacionId = id;
    this.facade.cargarConciliacion(id);
  }

  goBack(): void {
    this.location.back();
  }

  // ── Cierre de la conciliación (RF-5.8) ───────────────────────────────────
  cerrar(): void {
    if (!this.puedeCerrar()) return;
    this.facade.cerrarConciliacion(this.conciliacionId);
  }

  // ── Resolución de diferencias (RF-5.8.4) ─────────────────────────────────
  abrirResolver(item: DiferenciaItem): void {
    this.diferenciaSeleccionada.set(item);
    this.justificacion.set(item.justificacion ?? '');
    this.showResolverModal.set(true);
  }

  cerrarResolver(): void {
    this.showResolverModal.set(false);
    this.diferenciaSeleccionada.set(null);
    this.justificacion.set('');
  }

  confirmarResolver(): void {
    const dif = this.diferenciaSeleccionada();
    const texto = this.justificacion().trim();
    if (!dif || texto.length === 0) return;
    this.facade.resolverDiferencia(this.conciliacionId, dif.id, texto);
    this.cerrarResolver();
  }
}
