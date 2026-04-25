import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-restaurante',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './restaurante.component.html',
  styleUrl: './restaurante.component.scss'
})
export class RestauranteComponent implements OnInit {
  mesas: any[] = []; 
  ordenesHistorial: any[] = []; 
  
  modalActivo: string | null = null;
  mesaSeleccionada: any = null;
  ordenSeleccionada: any = null; 

  nuevoAsientos: number | null = null;
  nuevoComensal: string = '';

  menuProductos = [
    { id: 1, nombre: 'Bandeja Paisa', precio: 25000, icono: '🍲' },
    { id: 2, nombre: 'Pollo Asado 1/4', precio: 18000, icono: '🍗' },
    { id: 3, nombre: 'Ensalada César', precio: 12000, icono: '🥗' },
    { id: 4, nombre: 'Ajiaco Santafereño', precio: 28000, icono: '🍲' },
    { id: 5, nombre: 'Limonada de Coco', precio: 8000, icono: '🥤' },
    { id: 6, nombre: 'Cerveza Águila', precio: 6000, icono: '🍺' },
  ];

  // CUANDO LA PÁGINA CARGA, RECUPERAMOS LOS DATOS GUARDADOS
  ngOnInit() {
    this.cargarDatos();
  }

  // --- FUNCIONES DE MEMORIA LOCAL ---
  guardarDatos() {
    localStorage.setItem('gastro_mesas', JSON.stringify(this.mesas));
    localStorage.setItem('gastro_ordenes', JSON.stringify(this.ordenesHistorial));
  }

  cargarDatos() {
    const mesasGuardadas = localStorage.getItem('gastro_mesas');
    const ordenesGuardadas = localStorage.getItem('gastro_ordenes');
    if (mesasGuardadas) {
      this.mesas = JSON.parse(mesasGuardadas);
    }
    if (ordenesGuardadas) {
      this.ordenesHistorial = JSON.parse(ordenesGuardadas);
    }
  }
  // ----------------------------------

  abrirModal(nombre: string, mesa: any = null) {
    this.modalActivo = nombre;
    this.mesaSeleccionada = mesa;
    if (nombre === 'agregar' || nombre === 'asignar') {
      this.nuevoAsientos = mesa ? mesa.asientos : null;
      this.nuevoComensal = '';
    }
  }

  cerrarModales() {
    this.modalActivo = null;
  }

  crearNuevaMesa() {
    if (!this.validarFormulario()) return;

    const nuevoNumero = this.mesas.length > 0 ? Math.max(...this.mesas.map(m => m.numero)) + 1 : 1;
    const nuevaMesa = {
      id: nuevoNumero,
      numero: nuevoNumero,
      asientos: this.nuevoAsientos,
      estado: 'espera', 
      comensal: this.nuevoComensal,
      ordenActual: null 
    };
    
    this.mesas.push(nuevaMesa);
    this.crearOrdenParaMesa(nuevaMesa);
    this.guardarDatos(); // Guardamos cambio
    this.cerrarModales();
  }

  asignarMesaLibre() {
    if (!this.validarFormulario()) return;

    this.mesaSeleccionada.asientos = this.nuevoAsientos;
    this.mesaSeleccionada.comensal = this.nuevoComensal;
    this.mesaSeleccionada.estado = 'espera';
    this.crearOrdenParaMesa(this.mesaSeleccionada);
    this.guardarDatos(); // Guardamos cambio
    this.cerrarModales();
  }

  validarFormulario() {
    if (!this.nuevoAsientos || this.nuevoAsientos < 1) {
      alert("Debes escribir la cantidad de asientos.");
      return false;
    }
    if (!this.nuevoComensal || this.nuevoComensal.trim() === '') {
      alert("El nombre del comensal es obligatorio.");
      return false;
    }
    return true;
  }

  crearOrdenParaMesa(mesa: any) {
    const nuevaOrden = {
      id: this.ordenesHistorial.length > 0 ? Math.max(...this.ordenesHistorial.map(o => o.id)) + 1 : 1,
      mesaNumero: mesa.numero,
      comensal: mesa.comensal,
      horaCreacion: new Date(),
      productos: [],
      estado: 'Activa'
    };
    mesa.ordenActual = nuevaOrden;
    this.ordenesHistorial.unshift(nuevaOrden); 
  }

  agregarProductoAMesa(prodId: number) {
    const orden = this.mesaSeleccionada.ordenActual;
    if (!orden) return;

    const existeIdx = orden.productos.findIndex((p:any) => p.id === prodId);
    if (existeIdx !== -1) {
      orden.productos[existeIdx].cant += 1;
    } else {
      const prodOriginal = this.menuProductos.find(p => p.id === prodId);
      if (prodOriginal) {
        orden.productos.push({ id: prodId, cant: 1, precio: prodOriginal.precio, nombre: prodOriginal.nombre, icono: prodOriginal.icono });
      }
    }
    this.mesaSeleccionada.estado = 'ocupado';
    this.guardarDatos(); // Guardamos cambio
  }

  calcularTotalDe(elemento: any) {
    if (!elemento) return 0;
    const productos = elemento.productos || elemento.ordenActual?.productos || [];
    return productos.reduce((acc: number, p: any) => acc + (p.cant * p.precio), 0);
  }

  procesarPagoCompleto() {
    if (this.mesaSeleccionada.ordenActual) {
      this.mesaSeleccionada.ordenActual.estado = 'Pagada';
      // Como guardamos la hora, actualizamos a la de pago (opcional, pero útil)
      this.mesaSeleccionada.ordenActual.horaPago = new Date();
    }
    this.limpiarMesa();
  }

  liberarMesaDefinitivamente() {
    if (this.mesaSeleccionada.ordenActual) {
      this.mesaSeleccionada.ordenActual.estado = 'Liberada/Cancelada';
    }
    this.limpiarMesa();
  }

  limpiarMesa() {
    this.mesaSeleccionada.comensal = '';
    this.mesaSeleccionada.ordenActual = null;
    this.mesaSeleccionada.estado = 'libre';
    this.guardarDatos(); // Guardamos cambio
    this.cerrarModales();
  }

  eliminarMesaDelSistema() {
    this.mesas = this.mesas.filter(m => m.id !== this.mesaSeleccionada.id);
    this.guardarDatos(); // Guardamos cambio
    this.cerrarModales();
  }

  verReporteOrden(orden: any) {
    this.ordenSeleccionada = orden;
    this.modalActivo = 'reporte-orden';
  }

  imprimirElemento() {
    window.print(); 
  }
}