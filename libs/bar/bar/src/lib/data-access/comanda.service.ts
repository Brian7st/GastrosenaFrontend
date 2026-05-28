import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ComandaBarYBarismo } from '../models/comanda.model';

@Injectable({
    providedIn: 'root'
})
export class ComandaService {
    private http = inject(HttpClient);
    private url = '/api/barybarismo/comandas';

    // Mock data temporal para la demo visual (similar a cocina)
    private mockComandas: ComandaBarYBarismo[] = [];
listarComandas(): Observable<ComandaBarYBarismo[]> {
    return this.http.get<ComandaBarYBarismo[]>(this.url);
    // return of([...this.mockComandas]);
}

buscarPorId(id: string): Observable<ComandaBarYBarismo> {
    return this.http.get<ComandaBarYBarismo>(`${this.url}/${id}`);
    // const found = this.mockComandas.find(c => c.idComanda === id);
    // return of(found as ComandaBarYBarismo);
}

actualizarEstado(idComanda: string, nuevoEstado: string): Observable<void> {
    return this.http.put<void>(`${this.url}/${idComanda}/estado?estado=${nuevoEstado}`, {});
}
iniciarDetalle(idDetalle: string): Observable<unknown> {
    return this.http.put(`${this.url}/${idDetalle}/iniciar?responsable=bartender`, {});
}


finalizarDetalle(idDetalle: string): Observable<unknown> {
    return this.http.put(`${this.url}/${idDetalle}/finalizar`, {});
}
    private evaluarYActualizarEstadoComanda(comanda: ComandaBarYBarismo) {
        if (!comanda.items || comanda.items.length === 0) return;
        const todosListos = comanda.items.every(i => i.estado === 'LISTO');
        const algunoPreparandoOlisto = comanda.items.some(i => i.estado === 'PREPARANDO' || i.estado === 'LISTO');
        if (todosListos) {
            comanda.estadoPreparacion = 'LISTO';
        } else if (algunoPreparandoOlisto) {
            comanda.estadoPreparacion = 'PREPARANDO';
        } else {
            comanda.estadoPreparacion = 'PENDIENTE';
        }
    }

    private baseUrlEstadisticas = '/api/barybarismo/estadisticas';

    private parseTiempoPromedioToMinutos(tiempo: string): number {
        if (!tiempo) return 0;
        const minMatch = tiempo.match(/(\d+)\s*min/);
        const segMatch = tiempo.match(/(\d+)\s*seg/);
        const mins = minMatch ? parseInt(minMatch[1], 10) : 0;
        const segs = segMatch ? parseInt(segMatch[1], 10) : 0;
        return mins + (segs / 60);
    }

    getEstadisticasPromedios(): Observable<PromedioBebida[]> {
        interface PromedioPreparacionDTO {
            bebida: string;
            tiempoPromedio: string;
        }
        return this.http.get<PromedioPreparacionDTO[]>(`${this.baseUrlEstadisticas}/promedio`).pipe(
            map(data => (data || []).map(d => ({
                nombreReceta: d.bebida || '—',
                promedioMinutos: this.parseTiempoPromedioToMinutos(d.tiempoPromedio)
            })))
        );
    }

    getEstadisticasDiarias(): Observable<CargaTrabajoDiaria[]> {
        const hoy = new Date();
        const year = hoy.getFullYear();
        const month = String(hoy.getMonth() + 1).padStart(2, '0');
        const day = String(hoy.getDate()).padStart(2, '0');
        const fechaLocal = `${year}-${month}-${day}`;
        interface EstadisticasDiariasDTO {
            fecha: string;
            totalComandas: number;
            tiempoPromedio: string;
        }
        return this.http.get<EstadisticasDiariasDTO>(`${this.baseUrlEstadisticas}/diarias?fecha=${fechaLocal}`).pipe(
            map(data => {
                if (!data) return [];
                return [{
                    hora: data.fecha || fechaLocal,
                    totalBebidas: data.totalComandas || 0
                }];
            })
        );
    }

    getKpis(): Observable<EstadisticasKpi> {
        return this.http.get<EstadisticasKpi>(`${this.baseUrlEstadisticas}/kpis`);
    }
}

export interface PromedioBebida {
    nombreReceta: string;
    promedioMinutos: number;
}

export interface CargaTrabajoDiaria {
    hora: string;
    totalBebidas: number;
}

export interface EstadisticasKpi {
    promedioDemoraGeneral: number;
    bebidaMasRapida: string;
    totalBebidasDespachadosHoy: number;
}