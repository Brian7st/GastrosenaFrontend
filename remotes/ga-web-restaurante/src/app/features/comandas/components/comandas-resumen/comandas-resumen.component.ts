import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comanda } from '../../../../core/models/comanda.model';

@Component({
  selector: 'app-comandas-resumen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comandas-resumen.component.html',
  styleUrls: ['./comandas-resumen.component.scss']
})
export class ComandasResumenComponent {
  @Input() comandas: Comanda[] = [];

  get totalComandas(): number {
    return this.comandas.length;
  }

  get activas(): number {
    return this.comandas.filter(c => c.estado === 'En Preparación' || c.estado === 'Abierto').length;
  }

  get valorTotal(): number {
    return this.comandas.reduce((acumulador, comanda) => acumulador + comanda.total, 0);
  }

  get meserosActivos(): number {
    const meseros = this.comandas.map(c => c.mesero);
    return new Set(meseros).size; // Set elimina los duplicados
  }
}
