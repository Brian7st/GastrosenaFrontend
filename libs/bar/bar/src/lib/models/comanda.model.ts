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
    idDetalleComanda: string;
    nombre: string;
    cantidad: number;
    nota?: string;
    estado: 'ESPERA' | 'PREPARANDO' | 'LISTO';
    idReceta?: string;
    tiempoEstimado?: number;
    horaInicioPreparacion?: string;
    horaFinPreparacion?: string;
    duracionMinutos?: number;
}