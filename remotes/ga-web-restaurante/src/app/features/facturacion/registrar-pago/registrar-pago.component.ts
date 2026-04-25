import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar-pago',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './registrar-pago.component.html',
  styleUrls: ['./registrar-pago.component.scss']
})
export class RegistrarPagoComponent {
  mostrarModalDetalle = false;
  mostrarModalCobro = false;
  mostrarModalExito = false; // Nueva variable para el modal de éxito
  
  metodoSeleccionado: string = 'Efectivo';

  mesaSeleccionada: any = {
    id: 'INV-2024-002',
    nombre: 'Mesa 5',
    cliente: 'Juan Pérez',
    mesero: 'María González',
    hora: '20:48:00',
    productos: [
      { nombre: 'Hamburguesa Doble', cantidad: 1, precio: 25000 },
      { nombre: 'Jugo de Mora', cantidad: 1, precio: 7000 }
    ],
    subtotal: 32000,
    iva: 6080,
    total: 38080
  };

  constructor(private router: Router) {}

  volver() {
    this.router.navigate(['/facturacion']);
  }

  verDetalle() {
    this.mostrarModalDetalle = true;
  }

  abrirCobro() {
    this.mostrarModalDetalle = false;
    this.mostrarModalCobro = true;
  }

  seleccionarMetodo(metodo: string) {
    this.metodoSeleccionado = metodo;
  }

  cerrarModales() {
    this.mostrarModalDetalle = false;
    this.mostrarModalCobro = false;
    this.mostrarModalExito = false;
  }

  confirmarPago() {
    console.log(`Pago registrado con ${this.metodoSeleccionado} para ${this.mesaSeleccionada.id}`);
    this.mostrarModalCobro = false; // Cerramos el de cobro
    this.mostrarModalExito = true;  // Abrimos el de éxito
  }

  finalizarTodo() {
    this.cerrarModales();
    this.volver(); // Opcional: Redirigir al terminar
  }
}