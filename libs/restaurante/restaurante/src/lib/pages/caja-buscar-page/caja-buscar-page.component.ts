import { ChangeDetectionStrategy, Component, inject, signal, OnInit, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  PageHeaderComponent,
  CardComponent,
  ButtonComponent,
  LucideIconComponent,
  StatusBadgeComponent,
  DataTableComponent,
  EmptyStateComponent
} from '@restaurant/shared/ui';
import { RestauranteFacade } from '../../data-access/restaurante.facade';
import { RestauranteService } from '../../data-access/restaurante.service';

@Component({
  selector: 'restaurant-caja-buscar-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageHeaderComponent,
    CardComponent,
    ButtonComponent,
    LucideIconComponent,
    StatusBadgeComponent,
    DataTableComponent,
    EmptyStateComponent
  ],
  templateUrl: './caja-buscar-page.component.html',
  styleUrl: './caja-buscar-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CajaBuscarPageComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  public facade = inject(RestauranteFacade);
  private restauranteService = inject(RestauranteService);

  mostrarModalDetalle = signal(false);
  facturaSeleccionada = signal<any | null>(null); // Ahora usa FacturaResponse

  // Lista de facturas reales obtenidas del backend
  facturasReales = signal<any[]>([]);

  // Filtros
  filtroMesa = signal<string>('');
  filtroCajero = signal<string>(''); // Cambiado a Cajero (La factura guarda cajeroId)
  fechaInicio = signal<string>('');
  fechaFin = signal<string>('');

  dropdownMesaAbierto = signal<boolean>(false);
  dropdownCajeroAbierto = signal<boolean>(false);

  ngOnInit() {
    this.cargarFacturasReales();
  }

  cargarFacturasReales() {
    const sesion = this.facade.turnoCaja();
    if (sesion && sesion.id) {
      // Traemos las facturas verdaderas de la base de datos
      this.restauranteService.obtenerFacturasDeSesion(sesion.id).subscribe({
        next: (data) => this.facturasReales.set(data),
        error: (err) => console.error('Error al cargar las facturas reales', err)
      });
    }
  }

  mesasDisponibles = computed(() => {
    const facturas = this.facturasReales();
    const mesas = new Set(facturas.map(f => f.nombreMesa).filter(m => !!m));
    return Array.from(mesas);
  });

  cajerosDisponibles = computed(() => {
    const facturas = this.facturasReales();
    const cajeros = new Set(facturas.map(f => f.cajeroId).filter(id => !!id));
    return Array.from(cajeros);
  });

  mesasFiltradas = computed(() => {
    const query = this.filtroMesa().toLowerCase();
    return this.mesasDisponibles().filter(m => m.toLowerCase().includes(query));
  });

  cajerosFiltrados = computed(() => {
    const query = this.filtroCajero().toLowerCase();
    return this.cajerosDisponibles().filter(c => c.toLowerCase().includes(query));
  });

  facturasFiltradas = computed(() => {
    let result = this.facturasReales();

    // Filtro por Mesa
    const mesaQ = this.filtroMesa().toLowerCase();
    if (mesaQ) {
      result = result.filter(f => f.nombreMesa?.toLowerCase().includes(mesaQ));
    }

    // Filtro por Cajero
    const cajeroQ = this.filtroCajero().toLowerCase();
    if (cajeroQ) {
      result = result.filter(f => f.cajeroId?.toLowerCase().includes(cajeroQ));
    }

    // Filtro por Rango (Usando fechaEmision)
    const fInicio = this.fechaInicio();
    if (fInicio) {
      const [year, month, day] = fInicio.split('-');
      const dInicio = new Date(Number(year), Number(month) - 1, Number(day)).getTime();
      result = result.filter(f => {
        const fechaFac = new Date(f.fechaEmision || '').getTime();
        return fechaFac >= dInicio;
      });
    }

    const fFin = this.fechaFin();
    if (fFin) {
      const [year, month, day] = fFin.split('-');
      const dFin = new Date(Number(year), Number(month) - 1, Number(day));
      dFin.setHours(23, 59, 59, 999);
      result = result.filter(f => {
        const fechaFac = new Date(f.fechaEmision || '').getTime();
        return fechaFac <= dFin.getTime();
      });
    }

    return result;
  });

  @HostListener('document:click', ['$event'])
  cerrarDropdowns() {
    this.dropdownMesaAbierto.set(false);
    this.dropdownCajeroAbierto.set(false);
  }

  seleccionarMesa(mesa: string) {
    this.filtroMesa.set(mesa);
    this.dropdownMesaAbierto.set(false);
  }

  seleccionarCajero(cajero: string) {
    this.filtroCajero.set(cajero);
    this.dropdownCajeroAbierto.set(false);
  }

  limpiarFiltros() {
    this.filtroMesa.set('');
    this.filtroCajero.set('');
    this.fechaInicio.set('');
    this.fechaFin.set('');
  }

  exportarResultados() {
    const facturas = this.facturasFiltradas();
    if (facturas.length === 0) return;

    const encabezados = ['N° Factura', 'Mesa', 'Cajero ID', 'Fecha Emision', 'Metodo Pago', 'Total', 'Estado'];
    const lineas = facturas.map(f => {
      const fecha = new Date(f.fechaEmision).toLocaleString('es-CO');
      return [
        f.numeroFactura,
        f.nombreMesa || 'Para Llevar',
        f.cajeroId,
        fecha,
        f.metodoPago,
        f.total,
        f.estado
      ].join(',');
    });

    const csvContent = "data:text/csv;charset=utf-8," + [encabezados.join(','), ...lineas].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "exportacion_facturas.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  volver() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  verDetalle(factura: any) {
    this.facturaSeleccionada.set(factura);
    this.mostrarModalDetalle.set(true);
  }

  cerrarModal() {
    this.mostrarModalDetalle.set(false);
    this.facturaSeleccionada.set(null);
  }

  imprimirFactura() {
    const factura = this.facturaSeleccionada();
    if (factura && factura.id) {
      this.facade.descargarFacturaPdf(factura.id, factura.numeroFactura);
    }
  }
}