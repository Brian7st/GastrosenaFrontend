import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideIconComponent, ButtonComponent, DataTableComponent, KpiCardComponent } from '@restaurant/shared/ui';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';
import { ConciliacionFacade } from '../../../data-access/conciliacion.facade';

@Component({
  selector: 'restaurant-conciliacion-historial',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideIconComponent,
    ButtonComponent,
    DataTableComponent,
    KpiCardComponent,
    BackButtonComponent,
  ],
  templateUrl: './conciliacion-historial.component.html',
  styleUrl: './conciliacion-historial.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConciliacionHistorialComponent implements OnInit {
  private location = inject(Location);
  protected facade = inject(ConciliacionFacade);

  // Signals desde la facade (reemplazan el array plano anterior)
  registros = this.facade.conciliaciones;
  loading = this.facade.loading;
  error = this.facade.error;

  // Datos de UI locales sin gestión de servidor
  topDiferencias = [
    { producto: 'Aceite Vegetal', dif: '-15 L', icon: 'droplet' },
    { producto: 'Azúcar Refinada', dif: '-8 Kg', icon: 'package' },
    { producto: 'Carne de Res', dif: '-5 Kg', icon: 'beef' },
  ];

  ngOnInit(): void {
    this.facade.loadAll();
  }

  goBack() {
    this.location.back();
  }
}
