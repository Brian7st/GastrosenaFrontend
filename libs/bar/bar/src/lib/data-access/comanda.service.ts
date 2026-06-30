import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ComandaBarYBarismo, ComandaItem } from '../models/comanda.model';
import { Receta } from '../models/receta.model';

@Injectable({
    providedIn: 'root'
})
export class ComandaService {
    private http = inject(HttpClient);
    private url = '/api/barybarismo/comandas';

    private parsearItems(idComanda: string, listaPlatos: string, estadoPreparacion: string): ComandaItem[] {
        if (!listaPlatos) return [];
        const parts = this.splitRespectingParens(listaPlatos);
        return parts.map((part, index) => {
            const match = part.match(/^(\d+)\s*[xX]\s*(.+)$/);
            const cantidad = match ? parseInt(match[1], 10) : 1;
            const nombreCompleto = match ? match[2].trim() : part;

            const notaMatch = nombreCompleto.match(/\(([^)]+)\)/);
            const nota = notaMatch ? notaMatch[1].trim() : '';
            const nombre = notaMatch ? nombreCompleto.replace(/\s*\([^)]+\)\s*/g, '').trim() : nombreCompleto;

            let estado: 'ESPERA' | 'PREPARANDO' | 'LISTO' = 'ESPERA';
            if (estadoPreparacion === 'LISTO') estado = 'LISTO';
            else if (estadoPreparacion === 'PROCESO' || estadoPreparacion === 'EN_PREPARACION') estado = 'PREPARANDO';

            return {
                idDetalleComanda: `${idComanda}-${index}`,
                nombre,
                cantidad,
                estado,
                nota: nota || undefined,
                tiempoEstimado: 5
            };
        });
    }

    private splitRespectingParens(text: string): string[] {
        const parts: string[] = [];
        let depth = 0;
        let current = '';
        for (const ch of text) {
            if (ch === '(') depth++;
            else if (ch === ')') depth = Math.max(0, depth - 1);
            if (ch === ',' && depth === 0) {
                const trimmed = current.trim();
                if (trimmed) parts.push(trimmed);
                current = '';
            } else {
                current += ch;
            }
        }
        const trimmed = current.trim();
        if (trimmed) parts.push(trimmed);
        return parts;
    }

    listarComandas(): Observable<ComandaBarYBarismo[]> {
        return this.http.get<ComandaBarYBarismo[]>(this.url).pipe(
            map(comandas => (comandas || []).map(c => ({
                ...c,
                idComanda: String(c.idComanda),
                prioridad: (c.prioridad?.toLowerCase() || 'normal') as 'normal' | 'alta' | 'urgente',
                mesero: c.mesero || '',
                items: this.parsearItems(String(c.idComanda), c.preparacion, c.estadoPreparacion)
            })))
        );
    }

    buscarPorId(id: string): Observable<ComandaBarYBarismo> {
        return this.http.get<ComandaBarYBarismo>(`${this.url}/${id}`).pipe(
            map(c => {
                if (!c) return c;
                return {
                    ...c,
                    prioridad: (c.prioridad?.toLowerCase() || 'normal') as 'normal' | 'alta' | 'urgente',
                    mesero: c.mesero || c.responsable || '',
                    items: this.parsearItems(c.idComanda, c.preparacion, c.estadoPreparacion)
                };
            })
        );
    }

    iniciarDetalle(idDetalle: string): Observable<unknown> {
        const idComanda = idDetalle.split('-')[0];
        return this.http.put(`${this.url}/${idComanda}/iniciar?responsable=1`, {});
    }

    finalizarDetalle(idDetalle: string): Observable<unknown> {
        const idComanda = idDetalle.split('-')[0];
        return this.http.put(`${this.url}/${idComanda}/finalizar`, {});
    }

    eliminarComandaPorId(idComanda: string): Observable<unknown> {
        return this.http.delete(`${this.url}/${idComanda}`);
    }

    limpiarComandas(fechaInicio: string, fechaFin: string): Observable<unknown> {
        return this.http.delete(`${this.url}/limpiar?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
    }

    getRecetaById(idReceta: string): Observable<Receta> {
        return this.http.get<Receta>(`/api/barybarismo/recetas/${idReceta}`);
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
