import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ButtonComponent, DataTableComponent } from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { FacturasFacade } from '../../../data-access/facturas.facade';
import { ConciliacionGilDiferencia } from '../../../models/facturas.model';

@Component({
  selector: 'restaurant-factura-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent, DataTableComponent, BackButtonComponent],
  templateUrl: './factura-detail.component.html',
  styleUrl: './factura-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacturaDetailPageComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private facade = inject(FacturasFacade);

  factura              = this.facade.facturaSeleccionada;
  loading              = this.facade.loading;
  conciliacionGil      = this.facade.conciliacionGil;
  conciliacionCargada  = this.facade.conciliacionCargada;
  gilesDisponibles     = this.facade.gilesDisponibles;

  observaciones   = signal<Record<string, string>>({});
  gilParaVincular = signal('');

  showConfirmVerificar  = signal(false);
  showConfirmPagada     = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.facade.cargarFactura(id);
      this.facade.intentarCargarConciliacion(id);
      this.facade.cargarGilesDisponibles();
    }
  }

  setObservacion(gilItemId: string, event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.observaciones.update(o => ({ ...o, [gilItemId]: val }));
  }

  resolverDiferencia(gilItemId: string): void {
    const c = this.conciliacionGil();
    if (!c) return;
    const obs = this.observaciones()[gilItemId] ?? '';
    if (!obs.trim()) return; // observation required — don't send empty string to backend
    this.facade.resolverDiferenciaGil(c.id, gilItemId, obs);
    this.observaciones.update(o => { const next = { ...o }; delete next[gilItemId]; return next; });
  }

  onGilVincularChange(event: Event): void {
    this.gilParaVincular.set((event.target as HTMLSelectElement).value);
  }

  vincularGil(): void {
    const factura = this.factura();
    const gilId   = this.gilParaVincular();
    if (!factura || !gilId) return;
    this.facade.conciliarFacturaGil(String(factura.id), gilId);
    this.gilParaVincular.set('');
  }

  estaConciliada(diferencias: ConciliacionGilDiferencia[]): boolean {
    return diferencias.length === 0 || diferencias.every(d => d.resuelta);
  }

  countPendientes(diferencias: ConciliacionGilDiferencia[]): number {
    return diferencias.filter(d => !d.resuelta).length;
  }

  confirmarVerificar(): void {
    const factura = this.factura();
    if (!factura) return;
    this.showConfirmVerificar.set(false);
    this.facade.verificarFactura(String(factura.id));
  }

  confirmarPagada(): void {
    const factura = this.factura();
    if (!factura) return;
    this.showConfirmPagada.set(false);
    this.facade.marcarPagada(String(factura.id));
  }

  onCopiarCufe(cufe: string | undefined): void {
    if (cufe) navigator.clipboard.writeText(cufe);
  }

  descargarOImprimir(): void {
    window.print();
  }

  goBack(): void {
    this.router.navigate(['/app/inventario/facturas']);
  }
}
