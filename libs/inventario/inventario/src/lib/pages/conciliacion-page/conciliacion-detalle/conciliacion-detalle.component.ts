import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { LucideIconComponent, KpiCardComponent } from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { ConciliacionFacade } from '../../../data-access/conciliacion.facade';
import { DiferenciaItem } from '../../../models/conciliacion.model';

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
