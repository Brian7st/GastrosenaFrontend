import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
 // ¡Importante para los ngFor/ngIf!

@Component({
  selector: 'app-comandas-filtros',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './comandas-filtros.component.html',
  styleUrls: ['./comandas-filtros.component.scss']
})
export class ComandasFiltrosComponent {

  @Output() filtrar = new EventEmitter<{mesa: string, mesero: string, fechaDesde: string, fechaHasta: string}>();

  mesaBuscada: string = '';
  fechaDesde: string = '';
  fechaHasta: string = '';

  meseroSeleccionado: string = '';
  mostrarDropdownMesero: boolean = false;


  listaMeserosBase: string[] = ['María González', 'Instructor', 'Carlos Ruiz'];

  meserosSugeridos: string[] = [...this.listaMeserosBase];

  emitirFiltrosAutomaticos() {
    this.filtrar.emit({
      mesa: this.mesaBuscada,
      mesero: this.meseroSeleccionado,
      fechaDesde: this.fechaDesde,
      fechaHasta: this.fechaHasta
    });
  }

  filtrarMeseros() {
    this.meserosSugeridos = this.listaMeserosBase.filter(m =>
      m.toLowerCase().includes(this.meseroSeleccionado.toLowerCase())
    );
    this.emitirFiltrosAutomaticos();
  }

  abrirDropdown() {
    this.meserosSugeridos = this.listaMeserosBase;
    this.mostrarDropdownMesero = true;
  }

  cerrarDropdown() {
    setTimeout(() => this.mostrarDropdownMesero = false, 200);
  }

  seleccionarMesero(mesero: string) {
    this.meseroSeleccionado = mesero;
    this.mostrarDropdownMesero = false;
    this.emitirFiltrosAutomaticos();
  }

  limpiarCampos() {
    this.mesaBuscada = '';
    this.meseroSeleccionado = '';
    this.fechaDesde = '';
    this.fechaHasta = '';
    this.meserosSugeridos = [...this.listaMeserosBase];
  }
}
