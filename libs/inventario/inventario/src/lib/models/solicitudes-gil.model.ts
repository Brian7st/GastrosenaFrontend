export type EstadoGil = 'Borrador' | 'Pendiente' | 'Validado' | 'Aprobado' | 'Procesado';

export interface SolicitudGil {
  id: string | number;
  codigo: string;          // Consecutivo GIL-F-014-YYYY-NNN
  fecha: string;           // Fecha de emisión o creación
  centroCostos: string;
  area: string;
  cuentadante: string;     // Instructor/responsable principal
  destino: string;
  ficha: string;           // Código tipo ADSO-2670687
  estado: EstadoGil;
  totalBienes?: number;    // Cantidad de ítems
  montoTotal?: number;     // Valor total en COP
  avatarColor?: string;    // Color del avatar para el listado
  bienes?: BienSolicitud[]; // Lista de bienes
}

export interface BienSolicitud {
  codigo: string;
  descripcion: string;
  um: string;
  cantidad: number;
  valorUnitario: number;
  subtotal: number;
}

export interface SolicitudesGilFiltros {
  busqueda?: string;
  instructor?: string;
  estado?: EstadoGil;
  fechaRango?: string;
}
