import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import {
  PageHeaderComponent,
  ButtonComponent,
  LucideIconComponent,
  ConfirmDialogComponent
} from '@restaurant/shared/ui';
import { RestauranteFacade } from '../../data-access/restaurante.facade';
import { RestauranteService } from '../../data-access/restaurante.service';

@Component({
  selector: 'restaurant-caja-cierre-page',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    ButtonComponent,
    LucideIconComponent,
    ConfirmDialogComponent,
    CurrencyPipe
  ],
  templateUrl: './caja-cierre-page.component.html',
  styleUrl: './caja-cierre-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CajaCierrePageComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  public facade = inject(RestauranteFacade);
  private restauranteService = inject(RestauranteService);

  montoInicial = signal<number>(0);
  totalEfectivo = signal<number>(0);
  totalTarjeta = signal<number>(0);
  totalTransferencia = signal<number>(0); // NUEVO
  totalVentas = signal<number>(0);
  totalEsperado = signal<number>(0);

  alertDialog = signal<{open: boolean, title: string, message: string}>({
    open: false,
    title: '',
    message: ''
  });

  ngOnInit() {
    this.cargarDatosCierre();
  }

  cargarDatosCierre() {
    const sesion = this.facade.turnoCaja();

    if (sesion) {
      this.montoInicial.set(sesion.baseEfectivo || 0);

      this.restauranteService.obtenerFacturasDeSesion(sesion.id).subscribe({
        next: (facturas) => {
          let efectivo = 0;
          let tarjeta = 0;
          let transferencia = 0;

          facturas.forEach(f => {
            if (f.metodoPago === 'EFECTIVO') {
              efectivo += f.total;
            } else if (f.metodoPago === 'TRANSFERENCIA') {
              transferencia += f.total;
            } else {
              // Asumimos que los demás son TARJETA_CREDITO o TARJETA_DEBITO
              tarjeta += f.total;
            }
          });

          this.totalEfectivo.set(efectivo);
          this.totalTarjeta.set(tarjeta);
          this.totalTransferencia.set(transferencia);

          const totalVendido = efectivo + tarjeta + transferencia;
          this.totalVentas.set(totalVendido);

          // El total esperado físico es la Base + lo que entró en Efectivo
          this.totalEsperado.set(this.montoInicial() + efectivo);
        },
        error: (err) => console.error('Error al cargar facturas para cierre', err)
      });
    }
  }

  volver() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  generarCierre() {
    this.facade.cerrarCaja(this.totalEsperado());

    this.alertDialog.set({
      open: true,
      title: 'Caja Cerrada Exitosamente',
      message: 'El cierre de turno ha sido registrado correctamente con los saldos calculados.'
    });
  }

  confirmarCierreExitoso() {
    this.alertDialog.set({ ...this.alertDialog(), open: false });
    this.volver();
  }
}