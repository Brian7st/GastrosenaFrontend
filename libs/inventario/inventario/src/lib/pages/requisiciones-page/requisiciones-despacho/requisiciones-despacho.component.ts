import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LucideIconComponent } from '@restaurant/shared/ui';
import { RequisicionesFacade } from '../../../data-access/requisiciones.facade';

@Component({
  selector: 'restaurant-requisiciones-despacho',
  standalone: true,
  imports: [LucideIconComponent],
  templateUrl: './requisiciones-despacho.component.html',
  styleUrl: './requisiciones-despacho.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequisicionesDespachoComponent implements OnInit {
  private router  = inject(Router);
  private route   = inject(ActivatedRoute);
  readonly facade = inject(RequisicionesFacade);

  requisicionId       = '';
  economoSeleccionado = signal('Carlos Rodríguez');
  requisicion         = this.facade.requisicionSeleccionada;
  loading             = this.facade.loading;

  readonly econoOpciones = ['Carlos Rodríguez', 'Marta Lucía Paz', 'Jorge Iván Tobón'];

  ngOnInit(): void {
    this.requisicionId = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.requisicionId) {
      this.facade.cargarRequisicion(this.requisicionId);
    } else {
      this.router.navigate(['/app/inventario/requisiciones']);
    }
  }

  onEconomo(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.economoSeleccionado.set(val);
  }

  finalizarEntrega(): void {
    if (!this.requisicionId || this.loading()) return;
    this.facade.despacharRequisicion(this.requisicionId, this.economoSeleccionado());
    this.router.navigate(['/app/inventario/requisiciones']);
  }

  close(): void {
    this.router.navigate(['/app/inventario/requisiciones']);
  }
}
