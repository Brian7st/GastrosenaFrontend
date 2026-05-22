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
  nombreReceta: string;
  promedioMinutos: number;
}

export interface CargaTrabajoDiaria {
  hora: string;
  totalPlatos: number;
}

export interface EstadisticasKpi {
  promedioDemoraGeneral: number;
  platoMasRapido: string;
  totalPlatosDespachadosHoy: number;
}

export interface Receta {
  idPlato: string;
  nombre: string;
  tiempoMinutos: number;
  ingredientes: string[];
  pasos: string[];
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
    return this.http.get<PromedioPlato[]>(`${this.baseUrlEstadisticas}/promedios`);
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

  getRecetaMock(idPlato: string): Receta {
    return {
      idPlato: idPlato,
      nombre: 'Hamburguesa',
      tiempoMinutos: 35,
      ingredientes: [
        'Pan de hamburguesa artesanal',
        'Carne de res 200g',
        'Queso cheddar',
        'Cebolla caramelizada',
        'Lechuga fresca'
      ],
      pasos: [
        'Sellar el pan en la plancha',
        'Cocinar la carne a término deseado',
        'Fundir el queso sobre la carne',
        'Ensamblar la hamburguesa'
      ]
    };
  }
}
