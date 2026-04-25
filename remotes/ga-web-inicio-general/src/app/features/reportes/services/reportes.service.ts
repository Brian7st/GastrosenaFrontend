import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface ReporteCard {
  id:          string;
  nombre:      string;
  descripcion: string;
  tipo:        string;
  rol:         'CONTADORA' | 'ADMINISTRADOR' | 'CHEF';
}

export interface ReporteReciente {
  id:     string;
  nombre: string;
  fecha:  string;
  estado: 'Completado' | 'Pendiente' | 'Error';
  tipo:   string;
}

export interface FiltroReporte {
  tipo:         string;
  periodicidad: string;
}

@Injectable({ providedIn: 'root' })
export class ReportesService {

  private readonly BASE = 'http://localhost:8081/api/reportes';
  private readonly MOCK = true;

  private mockReportes: ReporteCard[] = [
    // Contadora
    { id: 'r01', nombre: 'Bienes',         descripcion: 'Listado detallado de bienes registrados en el sistema.',            tipo: 'inventario',  rol: 'CONTADORA'     },
    { id: 'r02', nombre: 'Insumos',         descripcion: 'Relación de insumos consumidos y disponibles en cocina.',           tipo: 'inventario',  rol: 'CONTADORA'     },
    { id: 'r03', nombre: 'Facturación',     descripcion: 'Resumen de facturas emitidas en el período seleccionado.',          tipo: 'ventas',      rol: 'CONTADORA'     },
    { id: 'r04', nombre: 'Inventario',      descripcion: 'Estado actual del inventario con entradas y salidas.',              tipo: 'inventario',  rol: 'CONTADORA'     },
    { id: 'r05', nombre: 'Pre-factura',     descripcion: 'Pre-facturas generadas pendientes de aprobación.',                  tipo: 'ventas',      rol: 'CONTADORA'     },
    { id: 'r06', nombre: 'Factura Global',  descripcion: 'Consolidado global de todas las facturas del período.',             tipo: 'ventas',      rol: 'CONTADORA'     },
    { id: 'r07', nombre: 'Presupuesto',     descripcion: 'Comparativo entre presupuesto asignado y gasto real.',              tipo: 'financiero',  rol: 'CONTADORA'     },
    { id: 'r08', nombre: 'Conciliación',    descripcion: 'Conciliación de ingresos y egresos contables.',                    tipo: 'financiero',  rol: 'CONTADORA'     },
    // Administrador
    { id: 'r09', nombre: 'Desempeño por Aprendiz', descripcion: 'Métricas de desempeño individual de cada aprendiz.',        tipo: 'usuarios',    rol: 'ADMINISTRADOR' },
    { id: 'r10', nombre: 'Pedidos de Cocina',       descripcion: 'Volumen y tiempos de pedidos procesados por cocina.',       tipo: 'cocina',      rol: 'ADMINISTRADOR' },
    { id: 'r11', nombre: 'Ventas por Mesero',       descripcion: 'Total de ventas generadas por cada mesero en el período.',  tipo: 'ventas',      rol: 'ADMINISTRADOR' },
    // Chef
    { id: 'r12', nombre: 'Pedidos de Cocina', descripcion: 'Pedidos recibidos, en proceso y completados en cocina.',         tipo: 'cocina',      rol: 'CHEF'          },
    { id: 'r13', nombre: 'Ventas por Mesero', descripcion: 'Consulta de platos más vendidos según mesero asignado.',         tipo: 'ventas',      rol: 'CHEF'          },
  ];

  private mockRecientes: ReporteReciente[] = [
    { id: 'rc1', nombre: 'Facturación Marzo 2025',        fecha: '2025-04-01', estado: 'Completado', tipo: 'ventas'      },
    { id: 'rc2', nombre: 'Inventario Trimestre Q1 2025',  fecha: '2025-03-31', estado: 'Completado', tipo: 'inventario'  },
    { id: 'rc3', nombre: 'Presupuesto Febrero 2025',      fecha: '2025-03-02', estado: 'Completado', tipo: 'financiero'  },
    { id: 'rc4', nombre: 'Ventas por Mesero Marzo 2025',  fecha: '2025-04-02', estado: 'Completado', tipo: 'ventas'      },
    { id: 'rc5', nombre: 'Desempeño Aprendices Q1 2025',  fecha: '2025-03-30', estado: 'Completado', tipo: 'usuarios'    },
  ];

  constructor(private http: HttpClient) {}

  getReportes(): Observable<ReporteCard[]> {
    if (this.MOCK) return of(this.mockReportes);
    return this.http.get<ReporteCard[]>(this.BASE);
  }

  getRecientes(): Observable<ReporteReciente[]> {
    if (this.MOCK) return of(this.mockRecientes);
    return this.http.get<ReporteReciente[]>(`${this.BASE}/recientes`);
  }

  generarReporte(id: string, filtro: FiltroReporte): Observable<{ mensaje: string }> {
    if (this.MOCK) return of({ mensaje: `Reporte ${id} generado (${filtro.periodicidad})` });
    return this.http.post<{ mensaje: string }>(`${this.BASE}/${id}/generar`, filtro);
  }

  descargarPDF(id: string): Observable<{ url: string }> {
    if (this.MOCK) return of({ url: `#mock-pdf-${id}` });
    return this.http.get<{ url: string }>(`${this.BASE}/${id}/pdf`);
  }
}
