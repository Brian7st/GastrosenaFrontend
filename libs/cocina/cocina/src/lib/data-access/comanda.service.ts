import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PlatoDetalle {
  idDetalleComanda: string;
  idReceta: string;
  nombrePlato?: string;
  receta?: { nombre: string };
  cantidad: number;
  estado: 'ESPERA' | 'PREPARANDO' | 'LISTO';
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
  prioridad: 'NORMAL' | 'ALTA' | 'URGENTE';
  estado: 'PENDIENTE' | 'PREPARANDO' | 'LISTO';
  notasAdicionales: string;
  detalles: PlatoDetalle[];
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
  private baseUrlComandas = 'http://localhost:8080/api/cocina/comandas';
  private baseUrlEstadisticas = 'http://localhost:8080/api/cocina/estadisticas';

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

  getRecetaById(idReceta: string): Observable<Receta> {
    return this.http.get<Receta>(`http://localhost:8080/api/recetas/${idReceta}`);
  }
}
