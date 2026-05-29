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
    private parseListaPlatosToItems(idComanda: string, listaPlatos: string, estadoComanda: string, notasEspeciales?: string): ComandaItem[] {
        if (!listaPlatos) return [];
        const parts = listaPlatos.split(',');
        const items = parts.map((part, index) => {
            const trimmed = part.trim();
            const match = trimmed.match(/^(\d+)\s*[xX]\s*(.+)$/);
            const cantidad = match ? parseInt(match[1], 10) : 1;
            const nombreCompleto = match ? match[2].trim() : trimmed;

            // Extraer nota si viene en paréntesis, ej: "Mojito (Sin azúcar)"
            let nombre = nombreCompleto;
            let nota = '';
            const notaMatch = nombreCompleto.match(/\(([^)]+)\)/);
            if (notaMatch) {
                nota = notaMatch[1].trim();
                nombre = nombreCompleto.replace(/\([^)]+\)/, '').trim();
            }

            // Determinar estado basado en local storage y comanda
            let estado: 'ESPERA' | 'PREPARANDO' | 'LISTO' = 'ESPERA';
            if (estadoComanda === 'PENDIENTE') {
                estado = 'ESPERA';
                localStorage.removeItem(`gastro_bar_item_status_${idComanda}_${nombre}`);
            } else if (estadoComanda === 'LISTO') {
                estado = 'LISTO';
                localStorage.removeItem(`gastro_bar_item_status_${idComanda}_${nombre}`);
            } else {
                const local = localStorage.getItem(`gastro_bar_item_status_${idComanda}_${nombre}`);
                if (local === 'PREPARANDO' || local === 'LISTO') {
                    estado = local;
                } else {
                    estado = 'ESPERA';
                }
            }

            // Mapeo simple de idReceta
            let idReceta = '';
            const nameLower = nombre.toLowerCase();
            if (nameLower.includes('mojito')) idReceta = 'rec-mojito';
            else if (nameLower.includes('limonada')) idReceta = 'rec-limonada-coco';
            else if (nameLower.includes('capuchino')) idReceta = 'rec-001';

            return {
                idDetalleComanda: `${idComanda}-${index}`,
                nombre,
                cantidad,
                estado,
                idReceta,
                nota: nota || undefined,
                tiempoEstimado: 5
            };
        });

        // Si hay una sola bebida y tiene notasEspeciales general de comanda, y no tiene nota individual, le asignamos esa
        if (items.length === 1 && notasEspeciales && !items[0].nota) {
            items[0].nota = notasEspeciales;
        }

        return items;
    }


    listarComandas(): Observable<ComandaBarYBarismo[]> {
        return this.http.get<ComandaBarYBarismo[]>(this.url).pipe(
            map(comandas => (comandas || []).map(c => {
                const notasEsp = c.notasEspeciales || '';
                return {
                    ...c,
                    idComanda: String(c.idComanda),
                    prioridad: (c.prioridad?.toLowerCase() || 'normal') as 'normal' | 'alta' | 'urgente',
                    mesero: c.mesero || '',
                    especificacionesCliente: notasEsp,
                    items: this.parseListaPlatosToItems(String(c.idComanda), c.preparacion, c.estadoPreparacion, notasEsp)
                };
            }))
        );
    }

    buscarPorId(id: string): Observable<ComandaBarYBarismo> {
        return this.http.get<ComandaBarYBarismo>(`${this.url}/${id}`).pipe(
            map(c => {
                if (!c) return c;
                const notasEsp = c.notasEspeciales || '';
                return {
                    ...c,
                    prioridad: (c.prioridad?.toLowerCase() || 'normal') as 'normal' | 'alta' | 'urgente',
                    mesero: c.mesero || c.responsable || '',
                    especificacionesCliente: notasEsp,
                    items: this.parseListaPlatosToItems(c.idComanda, c.preparacion, c.estadoPreparacion, notasEsp)
                };
            })
        );
    }
    actualizarEstado(idComanda: string, nuevoEstado: string): Observable<void> {
        return this.http.put<void>(`${this.url}/${idComanda}/estado?estado=${nuevoEstado}`, {});
    }

    iniciarDetalle(idDetalle: string): Observable<unknown> {
        return this.http.put(`${this.url}/${idDetalle}/iniciar?responsable=1`, {});
    }

    finalizarDetalle(idDetalle: string): Observable<unknown> {
        return this.http.put(`${this.url}/${idDetalle}/finalizar`, {});
    }

    getRecetaById(idReceta: string): Observable<Receta> {
        return this.http.get<Receta>(`/api/barybarismo/recetas/${idReceta}`);
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