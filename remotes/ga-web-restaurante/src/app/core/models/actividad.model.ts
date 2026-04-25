export type ActividadTipo = 'orden' | 'completado' | 'alerta' | 'usuario' | 'mesa';

export interface Actividad {
    descripcion: string;
    hora: string;
    tipo: ActividadTipo;
}