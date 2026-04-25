import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comanda } from '../../../../core/models/comanda.model';

@Component({
  selector: 'app-estadisticas-historial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estadisticas-historial.component.html',
  styleUrls: ['./estadisticas-historial.component.scss']
})
export class EstadisticasHistorialComponent implements OnChanges {
  @Input({ required: true }) comandas: Comanda[] = [];

  terminoBusqueda: string = '';
  mesasDisponibles: string[] = [];
  mesasFiltradas: string[] = [];
  mostrarDropdown: boolean = false;

  mesaSeleccionada: string = '';
  comandasDeMesa: Comanda[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['comandas'] && this.comandas.length > 0) {
      const todasLasMesas = this.comandas.map(c => c.mesa);
      this.mesasDisponibles = [...new Set(todasLasMesas)];
      this.mesasFiltradas = this.mesasDisponibles;
    }
  }

  filtrarMesas(event: any): void {
    this.terminoBusqueda = event.target.value;

    // Novedad: Si el usuario borra todo el texto, limpiamos el filtro automáticamente
    if (this.terminoBusqueda.trim() === '') {
      this.limpiarFiltro();
      return;
    }

    this.mostrarDropdown = true;
    const termino = this.terminoBusqueda.toLowerCase();
    this.mesasFiltradas = this.mesasDisponibles.filter(mesa =>
      mesa.toLowerCase().includes(termino)
    );
  }

  seleccionarMesa(mesa: string): void {
    this.mesaSeleccionada = mesa;
    this.terminoBusqueda = mesa;
    this.mostrarDropdown = false;
    this.comandasDeMesa = this.comandas.filter(c => c.mesa === mesa);
  }

  // Novedad: Función para volver al estado inicial (sin mesa seleccionada)
  limpiarFiltro(): void {
    this.terminoBusqueda = '';
    this.mesaSeleccionada = '';
    this.comandasDeMesa = [];
    this.mostrarDropdown = false;
    this.mesasFiltradas = this.mesasDisponibles; // Restaurar lista completa
  }

  cerrarDropdown(): void {
    setTimeout(() => this.mostrarDropdown = false, 200);
  }
}
