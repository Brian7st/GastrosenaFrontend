import { Component, OnInit } from '@angular/core';


// Importa tus modelos (ajusta la ruta si es necesario)
import { Comanda } from '../../../../core/models/comanda.model';
import { KpiEstadisticas, RendimientoMesero, TopMesa } from '../../../../core/models/estadisticas.model';

// Importa tus componentes
import { EstadisticasKpisComponent } from '../../components/estadisticas-kpis/estadisticas-kpis.component';
import { EstadisticasTopMesasComponent } from '../../components/estadisticas-top-mesas/estadisticas-top-mesas.component';
import { EstadisticasRendimientoComponent } from '../../components/estadisticas-rendimiento/estadisticas-rendimiento.component';
import { EstadisticasHistorialComponent } from '../../components/estadisticas-historial/estadisticas-historial.component';
import { EstadisticasExportarComponent } from '../../components/estadisticas-exportar/estadisticas-exportar.component';

@Component({
  selector: 'app-estadisticas-page',
  standalone: true,
  imports: [
    EstadisticasKpisComponent,
    EstadisticasTopMesasComponent,
    EstadisticasRendimientoComponent,
    EstadisticasHistorialComponent,
    EstadisticasExportarComponent
],
  templateUrl: './estadisticas-page.component.html',
  styleUrls: ['./estadisticas-page.component.scss']
})
export class EstadisticasPageComponent implements OnInit {

  // AQUÍ ESTÁ TU ARREGLO CON EL NUEVO DATO INCLUIDO
  comandasData: Comanda[] = [
    {
      idComanda: 'ORD001', mesa: 'Mesa 2', mesero: 'María González', estado: 'En Preparación',
      total: 45000, fechaHora: '2025-09-23T16:27:19', items: 3,
      detalles: []
    },
    {
      idComanda: 'ORD002', mesa: 'Mesa 5', mesero: 'María González', estado: 'Abierto',
      total: 32000, fechaHora: '2025-09-23T16:27:19', items: 4,
      detalles: []
    },
    {
      idComanda: 'ORD1758664191444', mesa: 'Mesa 1', mesero: 'Instructor', estado: 'Pagado',
      total: 20000, fechaHora: '2025-09-23T16:49:51', items: 2,
      detalles: []
    },
    {
      idComanda: 'ORD003', mesa: 'Mesa 12', mesero: 'Carlos Ruiz', estado: 'En Preparación',
      total: 54500, fechaHora: '2025-09-23T18:10:45', items: 3,
      detalles: []
    },
    // TU NUEVO DATO:
    {
      idComanda: "ORD005", mesa: "Mesa 5", mesero: "María González", estado: "Abierto",
      total: 45000, fechaHora: "2025-09-23T17:15:42", items: 3,
      detalles: [
        { nombre: "Hamburguesa Especial", cantidad: 1, precio: 22000 },
        { nombre: "Papas Nativas", cantidad: 1, precio: 11000 },
        { nombre: "Malteada de Vainilla", cantidad: 1, precio: 12000 }
      ]
    }
  ];

  // Variables que alimentarán la vista
  kpisData!: KpiEstadisticas;
  topMesasData: TopMesa[] = [];
  rendimientoData: RendimientoMesero[] = [];

  ngOnInit(): void {
    // En lugar de llamar al servicio mockeado, calculamos todo base al arreglo
    this.calcularEstadisticas();
  }

  // ESTA ES LA MAGIA: Calcula todo dinámicamente basado en comandasData
  private calcularEstadisticas(): void {

    // 1. CÁLCULO DE KPIs
    const ingresosTotales = this.comandasData.reduce((acc, c) => acc + c.total, 0);
    const pedidosActivos = this.comandasData.filter(c => c.estado !== 'Pagado').length;
    const mesasAtendidasUnicas = new Set(this.comandasData.map(c => c.mesa)).size;

    this.kpisData = {
      pedidosActivos: pedidosActivos,
      tiempoPromedio: 17, // Este sigue estático por ahora
      ingresosTotales: ingresosTotales,
      mesasAtendidas: mesasAtendidasUnicas
    };


    // 2. CÁLCULO DE TOP MESAS (Agrupar por nombre de mesa y sumar)
    const mesasMap = new Map<string, TopMesa>();

    this.comandasData.forEach(c => {
      if (!mesasMap.has(c.mesa)) {
        mesasMap.set(c.mesa, { mesa: c.mesa, cantidadOrdenes: 0, totalConsumo: 0 });
      }
      const stat = mesasMap.get(c.mesa)!;
      stat.cantidadOrdenes += 1;
      stat.totalConsumo += c.total;
    });

    // Convertimos el mapa a arreglo, lo ordenamos de mayor a menor y sacamos el Top 3
    this.topMesasData = Array.from(mesasMap.values())
      .sort((a, b) => b.totalConsumo - a.totalConsumo)
      .slice(0, 3);


    // 3. CÁLCULO DE RENDIMIENTO DE MESEROS
    const meserosMap = new Map<string, any>();

    this.comandasData.forEach(c => {
      if (!meserosMap.has(c.mesero)) {
        meserosMap.set(c.mesero, {
          nombre: c.mesero,
          ordenesAtendidas: 0,
          ingresosGenerados: 0,
          mesasAsignadasSet: new Set<string>() // Usamos Set para contar mesas únicas sin repetir
        });
      }
      const stat = meserosMap.get(c.mesero)!;
      stat.ordenesAtendidas += 1;
      stat.ingresosGenerados += c.total;
      stat.mesasAsignadasSet.add(c.mesa);
    });

    // Formateamos para que encaje en la interfaz RendimientoMesero
    this.rendimientoData = Array.from(meserosMap.values()).map(m => {
      const promedio = m.ingresosGenerados / m.ordenesAtendidas;
      return {
        nombre: m.nombre,
        ordenesAtendidas: m.ordenesAtendidas,
        mesasAsignadas: m.mesasAsignadasSet.size,
        ingresosGenerados: m.ingresosGenerados,
        promedioPorOrden: promedio,
        // Lógica simple: Si genera más de 40k de promedio, es Excelente
        rendimiento: promedio >= 40000 ? 'Excelente' : 'Bueno'
      };
    });

    // Ordenamos a los meseros por ingresos de mayor a menor
    this.rendimientoData.sort((a, b) => b.ingresosGenerados - a.ingresosGenerados);
  }
}
