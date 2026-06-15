import { ChangeDetectionStrategy, Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  PageHeaderComponent,
  ButtonComponent,
  LucideIconComponent,
  ConfirmDialogComponent,
  DataTableComponent,
  EmptyStateComponent
} from '@restaurant/shared/ui';
import { RestauranteFacade } from '../../data-access/restaurante.facade';
import { RestauranteService } from '../../data-access/restaurante.service';

@Component({
  selector: 'restaurant-caja-movimientos-page',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    ButtonComponent,
    LucideIconComponent,
    ConfirmDialogComponent,
    DataTableComponent,
    EmptyStateComponent
  ],
  templateUrl: './caja-movimientos-page.component.html',
  styleUrl: './caja-movimientos-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CajaMovimientosPageComponent implements OnInit {
  private router = inject(Router);
  public facade = inject(RestauranteFacade);
  private restauranteService = inject(RestauranteService);

  totalEfectivo = signal<number>(0);
  totalTarjeta = signal<number>(0);
  totalTransferencia = signal<number>(0);

  facturas = signal<any[]>([]);
  filtroPago = signal<string>('TODOS');

  facturasFiltradas = computed(() => {
    const data = this.facturas();
    const filtro = this.filtroPago();
    
    if (filtro === 'TODOS') return data;
    
    return data.filter(f => {
      const metodo = f.metodoPago ? f.metodoPago.toUpperCase() : '';
      return metodo.includes(filtro);
    });
  });

  alertDialog = signal<{ open: boolean, title: string, message: string }>({
    open: false,
    title: '',
    message: ''
  });

  ngOnInit() {
    this.cargarMovimientosReales();
  }

  cargarMovimientosReales() {
    const sesion = this.facade.turnoCaja();

    if (sesion && sesion.id) {
      this.restauranteService.obtenerFacturasDeSesion(sesion.id).subscribe({
        next: (data) => {
          this.facturas.set(data);
          this.calcularKPIs(data);
        },
        error: (err) => {
          console.error('Error al cargar movimientos de la sesión', err);
        }
      });
    }
  }

  calcularKPIs(facturas: any[]) {
    let efectivo = 0;
    let tarjeta = 0;
    let transferencia = 0;

    facturas.forEach(f => {
      // Usamos un fallback seguro por si el backend envía total o subtotal
      const monto = f.total || f.subtotal || 0;
      const metodo = f.metodoPago ? f.metodoPago.toUpperCase() : '';

      // Usamos .includes() para que sea a prueba de balas
      if (metodo.includes('EFECTIVO')) {
        efectivo += monto;
      } else if (metodo.includes('TARJETA')) {
        tarjeta += monto;
      } else if (metodo.includes('TRANSFERENCIA')) {
        transferencia += monto;
      }
    });

    this.totalEfectivo.set(efectivo);
    this.totalTarjeta.set(tarjeta);
    this.totalTransferencia.set(transferencia);
  }

  volver() {
    this.router.navigate(['/app/restaurante/caja']);
  }

  imprimirFactura(idFactura: string, numeroFactura: string) {
    if (!idFactura) {
      this.alertDialog.set({
        open: true,
        title: 'Error de Impresión',
        message: 'No se encontró el identificador de la factura.'
      });
      return;
    }
    this.facade.descargarFacturaPdf(idFactura, numeroFactura);
  }


  cerrarAlertDialog() {
    this.alertDialog.set({ ...this.alertDialog(), open: false });
  }
}