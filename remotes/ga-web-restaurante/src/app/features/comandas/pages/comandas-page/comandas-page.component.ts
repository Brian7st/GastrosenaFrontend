import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comanda } from '../../../../core/models/comanda.model';
import { ComandasTablaComponent } from '../../components/comandas-tabla/comandas-tabla.component';
import { ComandasFiltrosComponent } from '../../components/comandas-filtros/comandas-filtros.component';
import { ComandasResumenComponent } from '../../components/comandas-resumen/comandas-resumen.component';

@Component({
  selector: 'app-comandas-page',
  standalone: true,
  imports: [CommonModule, ComandasTablaComponent, ComandasFiltrosComponent, ComandasResumenComponent],
  templateUrl: './comandas-page.component.html',
  styleUrls: ['./comandas-page.component.scss']
})
export class ComandasPageComponent implements OnInit {
  @ViewChild(ComandasFiltrosComponent) filtrosComponent!: ComandasFiltrosComponent;

  comandasMock: Comanda[] = [
    {
      idComanda: 'ORD001', mesa: 'Mesa 2', mesero: 'María González', estado: 'En Preparación',
      total: 45000, fechaHora: '2025-09-23T16:27:19', items: 3,
      detalles: [
        { nombre: 'Hamburguesa Triple', cantidad: 1, precio: 25000 },
        { nombre: 'Papas Francesas', cantidad: 1, precio: 12000 },
        { nombre: 'Jugo Natural', cantidad: 1, precio: 8000 }
      ]
    },
    {
      idComanda: 'ORD002', mesa: 'Mesa 5', mesero: 'María González', estado: 'Abierto',
      total: 32000, fechaHora: '2025-09-23T16:27:19', items: 4,
      detalles: [
        { nombre: 'Pizza Personal', cantidad: 2, precio: 24000 },
        { nombre: 'Cerveza Club Col', cantidad: 2, precio: 8000 }
      ]
    },
    {
      idComanda: 'ORD1758664191444', mesa: 'Mesa 1', mesero: 'Instructor', estado: 'Pagado',
      total: 20000, fechaHora: '2025-09-23T16:49:51', items: 2,
      detalles: [
        { nombre: 'Picada Pequeña', cantidad: 1, precio: 15000 },
        { nombre: 'Gaseosa 350ml', cantidad: 1, precio: 5000 }
      ]
    },
    {
      idComanda: 'ORD003', mesa: 'Mesa 12', mesero: 'Carlos Ruiz', estado: 'En Preparación',
      total: 54500, fechaHora: '2025-09-23T18:10:45', items: 3,
      detalles: [
        { nombre: 'Hamburguesa Especial', cantidad: 1, precio: 28500 },
        { nombre: 'Papas Caseras', cantidad: 1, precio: 12000 },
        { nombre: 'Malteada de Vainilla', cantidad: 1, precio: 14000 }
      ]
    }
  ];

  modalAbierto: boolean = false;
  comandaSeleccionada: Comanda | null = null;

  comandasFiltradas: Comanda[] = [];

  ngOnInit() {
    this.comandasFiltradas = [...this.comandasMock];
  }

  aplicarFiltro(filtros: { mesa: string, mesero: string, fechaDesde: string, fechaHasta: string }) {
    this.comandasFiltradas = this.comandasMock.filter(comanda => {
      const cumpleMesa = filtros.mesa === '' || comanda.mesa.toLowerCase().includes(filtros.mesa.toLowerCase());
      const cumpleMesero = filtros.mesero === '' || comanda.mesero.toLowerCase().includes(filtros.mesero.toLowerCase());

      let cumpleFecha = true;
      const fechaComanda = new Date(comanda.fechaHora).getTime();

      if (filtros.fechaDesde !== '') {
        const desde = new Date(filtros.fechaDesde + 'T00:00:00').getTime();
        if (fechaComanda < desde) cumpleFecha = false;
      }

      if (filtros.fechaHasta !== '') {
        const hasta = new Date(filtros.fechaHasta + 'T23:59:59').getTime();
        if (fechaComanda > hasta) cumpleFecha = false;
      }

      return cumpleMesa && cumpleMesero && cumpleFecha;
    });
  }

  limpiarFiltros() {
    this.comandasFiltradas = [...this.comandasMock];
    this.filtrosComponent.limpiarCampos();
  }

  abrirModalDetalle(comanda: Comanda) {
    this.comandaSeleccionada = comanda;
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.comandaSeleccionada = null;
  }
}
