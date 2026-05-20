export interface ComandaBarYBarismo {
    idComanda: string;
    numeroMesa: number;
    preparacion: string;
    cantidad: number;
    estadoPreparacion: string;
    especificacionesCliente: string;
    horaEntrada: string;

    prioridad?: 'normal' | 'alta' | 'urgente';
    mesero?: string;
    tiempoEstimado?: number;
    horaInicioPreparacion?: string;
    horaFinalizacion?: string;
    items?: ComandaItem[];
}

export interface ComandaItem {
    nombre: string;
    cantidad: number;
    nota?: string;
    tiempoEstimado?: number;
}