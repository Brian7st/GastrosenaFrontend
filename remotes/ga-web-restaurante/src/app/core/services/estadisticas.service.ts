import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Comanda } from '../models/comanda.model';
import { KpiEstadisticas, TopMesa, RendimientoMesero } from '../models/estadisticas.model';

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {

  // Tus datos mockeados
  private comandasMock: Comanda[] = [
    { idComanda: 'ORD001', mesa: 'Mesa 2', mesero: 'María González', estado: 'En Preparación', total: 45000, fechaHora: '2025-09-23T16:27:19', items: 3, detalles: [] },
    { idComanda: 'ORD002', mesa: 'Mesa 5', mesero: 'María González', estado: 'Abierto', total: 32000, fechaHora: '2025-09-23T16:27:19', items: 4, detalles: [] },
    { idComanda: 'ORD1758664191444', mesa: 'Mesa 1', mesero: 'Instructor', estado: 'Pagado', total: 20000, fechaHora: '2025-09-23T16:49:51', items: 2, detalles: [] },
    { idComanda: 'ORD003', mesa: 'Mesa 12', mesero: 'Carlos Ruiz', estado: 'En Preparación', total: 54500, fechaHora: '2025-09-23T18:10:45', items: 3, detalles: [] }
  ];

  obtenerKpis(): Observable<KpiEstadisticas> {
    const ingresosTotales = this.comandasMock.reduce((acc, curr) => acc + curr.total, 0);
    const pedidosActivos = this.comandasMock.filter(c => c.estado !== 'Pagado').length;

    return of({
      pedidosActivos,
      tiempoPromedio: 17, // Mockeado estático por ahora
      ingresosTotales,
      mesasAtendidas: this.comandasMock.length
    });
  }

  obtenerTopMesas(): Observable<TopMesa[]> {
    // Aquí iría la lógica de agrupación real, te devuelvo el mock formateado
    return of([
      { mesa: 'Mesa 12', cantidadOrdenes: 1, totalConsumo: 54500 },
      { mesa: 'Mesa 2', cantidadOrdenes: 1, totalConsumo: 45000 },
      { mesa: 'Mesa 5', cantidadOrdenes: 1, totalConsumo: 32000 }
    ]);
  }

  obtenerRendimientoMeseros(): Observable<RendimientoMesero[]> {
    return of([
      { nombre: 'María González', ordenesAtendidas: 2, mesasAsignadas: 2, ingresosGenerados: 77000, promedioPorOrden: 38500, rendimiento: 'Excelente' },
      { nombre: 'Carlos Ruiz', ordenesAtendidas: 1, mesasAsignadas: 1, ingresosGenerados: 54500, promedioPorOrden: 54500, rendimiento: 'Bueno' }
    ]);
  }
}
