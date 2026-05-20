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
    private mockComandas: ComandaBarYBarismo[] = [
        {
            idComanda: '1',
            numeroMesa: 3,
            preparacion: 'Margarita',
            cantidad: 2,
            estadoPreparacion: 'ESPERA',
            especificacionesCliente: 'Sin sal en el borde',
            horaEntrada: new Date().toISOString(),
            prioridad: 'alta',
            mesero: 'Carlos',
            tiempoEstimado: 10,
            items: [{ nombre: 'Margarita Clásica', cantidad: 2, nota: 'Sin sal' }]
        },
        {
            idComanda: '2',
            numeroMesa: 5,
            preparacion: 'Mojito',
            cantidad: 1,
            estadoPreparacion: 'PREPARANDO',
            especificacionesCliente: 'Extra menta',
            horaEntrada: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
            prioridad: 'urgente',
            mesero: 'Ana',
            tiempoEstimado: 8,
            items: [{ nombre: 'Mojito Cubano', cantidad: 1, nota: 'Extra menta' }]
        },
        {
            idComanda: '3',
            numeroMesa: 1,
            preparacion: 'Cerveza Artesanal',
            cantidad: 3,
            estadoPreparacion: 'TERMINADO',
            especificacionesCliente: 'Bien fría',
            horaEntrada: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
            prioridad: 'normal',
            mesero: 'Luis',
            tiempoEstimado: 5,
            items: [{ nombre: 'Cerveza IPA', cantidad: 3 }]
        },
        {
            idComanda: '4',
            numeroMesa: 8,
            preparacion: 'Piña Colada',
            cantidad: 2,
            estadoPreparacion: 'ESPERA',
            especificacionesCliente: '',
            horaEntrada: new Date().toISOString(),
            prioridad: 'normal',
            mesero: 'Sofía',
            tiempoEstimado: 12,
            items: [{ nombre: 'Piña Colada', cantidad: 2 }]
        }
    ];

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
}