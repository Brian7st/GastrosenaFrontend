import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PlatoDetalle {
  idDetalleComanda: string;
  idReceta: string;
  nombrePlato?: string;
  receta?: { nombre: string };
  cantidad: number;
  estado: 'ESPERA' | 'PREPARANDO' | 'LISTO' | 'CANCELADO' | 'DEVUELTO';
  notas: string;
  horaInicioPreparacion?: string;
  horaFinPreparacion?: string;
  duracionMinutos?: number;
}

export interface Comanda {
  idComanda: string;
  numeroMesa: number;
  nombreMesero: string;
  fechaPedido: string;
  horaEntrada: string;

  estado: 'PENDIENTE' | 'PREPARANDO' | 'LISTO' | 'CANCELADO' | 'DEVUELTO';
  notasAdicionales: string;
  detalles: PlatoDetalle[];
  /** Backend: la comanda viene de una devolución y se está re-cocinando */
  esDevolucion?: boolean;
  /** Marca virtual: indica que esta comanda es un duplicado de platos cancelados/devueltos */
  esDuplicadoCancelado?: boolean;
  esDuplicadoDevuelto?: boolean;
}

export interface PromedioPlato {
  nombrePlato: string;
  tiempoPromedioMinutos: number;
  cantidadPreparada: number;
}

export interface CargaTrabajoDiaria {
  fecha: string;
  totalPlatosPreparados: number;
  tiempoPromedioGlobalMinutos: number;
}

export interface EstadisticasKpi {
  promedioDemoraGeneral: number;
  platoMasRapido: string;
  totalPlatosDespachadosHoy: number;
}

export interface IngredienteReceta {
  idIngrediente: string;
  nombreIngrediente: string;
  cantidadRequerida: number;
  unidadMedida: string;
}

export interface PasoReceta {
  idPaso: string;
  orden: number;
  descripcionPaso: string;
  notasAdicionales: string;
}

export interface Receta {
  idReceta: string;
  nombreReceta: string;
  nombreCategoria: string;
  tiempoPreparacion: number;
  temperatura: string;
  ingredientes: IngredienteReceta[];
  pasos: PasoReceta[];
}

@Injectable({
  providedIn: 'root'
})
export class ComandaService {
  private http = inject(HttpClient);
  
  // Endpoints reales indicados por el usuario
  private baseUrlComandas = 'http://localhost:8082/api/cocina/comandas';
  private baseUrlEstadisticas = 'http://localhost:8082/api/cocina/estadisticas';

  iniciarDetalle(idDetalle: string): Observable<any> {
    return this.http.patch(`${this.baseUrlComandas}/detalle/${idDetalle}/iniciar?idResponsable=550e8400-e29b-41d4-a716-446655440000`, {});
  }

  finalizarDetalle(idDetalle: string): Observable<any> {
    return this.http.patch(`${this.baseUrlComandas}/detalle/${idDetalle}/finalizar`, {});
  }

  getEstadisticasPromedios(): Observable<PromedioPlato[]> {
    return this.http.get<PromedioPlato[]>(`${this.baseUrlEstadisticas}/promedio`);
  }

  getEstadisticasDiarias(): Observable<CargaTrabajoDiaria[]> {
    const hoy = new Date();
    const fechaISO = hoy.toISOString().split('T')[0];
    return this.http.get<CargaTrabajoDiaria[]>(`${this.baseUrlEstadisticas}/diarias?fecha=${fechaISO}`);
  }
  
  getKpis(): Observable<EstadisticasKpi> {
    return this.http.get<EstadisticasKpi>(`${this.baseUrlEstadisticas}/kpis`);
  }

  getComandas(): Observable<Comanda[]> {
    return this.http.get<Comanda[]>(this.baseUrlComandas);
  }

  getIncidenciasPorTipo(tipo: 'CANCELACION' | 'DEVOLUCION' | 'MODIFICACION'): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8082/api/cocina/incidencias/tipo/${tipo}`);
  }

  getConteoIncidencias(): Observable<{ canceladas: number; devueltas: number }> {
    return this.http.get<{ canceladas: number; devueltas: number }>(
      `http://localhost:8082/api/cocina/incidencias/conteo`
    );
  }

  getRecetaById(idReceta: string): Observable<Receta> {
    // Las recetas viven en el microservicio de cocina (puerto 8082), no en 8080.
    return this.http.get<Receta>(`http://localhost:8082/api/recetas/${idReceta}`);
  }

  limpiarComandas(fechaInicio: string, fechaFin: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrlComandas}/limpiar`, {
      params: { fechaInicio, fechaFin }
    });
  }

  eliminarComandaPorId(idComanda: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrlComandas}/${idComanda}`);
  }

  // ── Incidencias (Cancelados / Devueltos): borran incidencia + comanda ──────────
  private baseUrlIncidencias = 'http://localhost:8082/api/cocina/incidencias';

  eliminarIncidencia(idAuditoria: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrlIncidencias}/${idAuditoria}`);
  }

  limpiarIncidencias(tipo: 'CANCELACION' | 'DEVOLUCION', fechaInicio: string, fechaFin: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrlIncidencias}/limpiar`, {
      params: { tipo, fechaInicio, fechaFin }
    });
  }
}
