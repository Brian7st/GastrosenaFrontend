import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ComandaBarYBarismo } from '../models/comanda.model';

@Injectable({
    providedIn: 'root'
})
export class ComandaService {
    private http = inject(HttpClient);
    private url = 'http://localhost:8080/api/barybarismo/comandas';

    // Mock data temporal para la demo visual (similar a cocina)
    private mockComandas: ComandaBarYBarismo[] = [];

    listarComandas(): Observable<ComandaBarYBarismo[]> {
        // return this.http.get<ComandaBarYBarismo[]>(this.url);
        return of([...this.mockComandas]);
    }

    buscarPorId(id: string): Observable<ComandaBarYBarismo> {
        // return this.http.get<ComandaBarYBarismo>(`${this.url}/${id}`);
        const found = this.mockComandas.find(c => c.idComanda === id);
        return of(found as ComandaBarYBarismo);
    }

    actualizarEstado(idComanda: string, nuevoEstado: string): Observable<void> {
        // return this.http.patch<void>(`${this.url}/${idComanda}/estado`, { estado: nuevoEstado });
        const index = this.mockComandas.findIndex(c => c.idComanda === idComanda);
        if (index !== -1) {
            this.mockComandas[index] = { ...this.mockComandas[index], estadoPreparacion: nuevoEstado };
        }
        return of(void 0);
    }

    iniciarDetalle(idDetalle: string): Observable<unknown> {
        // return this.http.patch(`${this.url}/detalle/${idDetalle}/iniciar?idResponsable=550e8400-e29b-41d4-a716-446655440000`, {});
        const comanda = this.mockComandas.find(c => c.items?.some(i => i.idDetalleComanda === idDetalle));
        if (comanda && comanda.items) {
            const item = comanda.items.find(i => i.idDetalleComanda === idDetalle);
            if (item) {
                item.estado = 'PREPARANDO';
                item.horaInicioPreparacion = new Date().toISOString();
            }
            this.evaluarYActualizarEstadoComanda(comanda);
        }
        return of(void 0);
    }

    finalizarDetalle(idDetalle: string): Observable<unknown> {
        // return this.http.patch(`${this.url}/detalle/${idDetalle}/finalizar`, {});
        const comanda = this.mockComandas.find(c => c.items?.some(i => i.idDetalleComanda === idDetalle));
        if (comanda && comanda.items) {
            const item = comanda.items.find(i => i.idDetalleComanda === idDetalle);
            if (item) {
                item.estado = 'LISTO';
                item.horaFinPreparacion = new Date().toISOString();
                if (item.horaInicioPreparacion) {
                    item.duracionMinutos = Math.floor((new Date().getTime() - new Date(item.horaInicioPreparacion).getTime()) / 60000);
                }
            }
            this.evaluarYActualizarEstadoComanda(comanda);
        }
        return of(void 0);
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

    private baseUrlEstadisticas = 'http://localhost:8080/api/barybarismo/estadisticas';

    getEstadisticasPromedios(): Observable<PromedioBebida[]> {
        return this.http.get<PromedioBebida[]>(`${this.baseUrlEstadisticas}/promedios`);
    }

    getEstadisticasDiarias(): Observable<CargaTrabajoDiaria[]> {
        const hoy = new Date();
        const fechaISO = hoy.toISOString().split('T')[0];
        return this.http.get<CargaTrabajoDiaria[]>(`${this.baseUrlEstadisticas}/diarias?fecha=${fechaISO}`);
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