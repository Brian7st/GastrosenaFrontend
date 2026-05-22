import { SolicitudGil, BienSolicitud } from './solicitudes-gil.model';
export { BienSolicitud };

// ── Bienes por solicitud (ítems de formulario) ───────────────────────────────

export const BIENES_SOLICITUD_MOCK: BienSolicitud[] = [
  {
    codigo: 'ALM-001',
    descripcion: 'Harina de Trigo x 50kg',
    um: 'Bto',
    cantidad: 2,
    valorUnitario: 150000,
    subtotal: 300000,
  },
];

// ── Alias requerido por los componentes ──────────────────────────────────────
export const SOLICITUDES_MOCK: SolicitudGil[] = [
  {
    id: 1,
    codigo: 'GIL-F-014-2024-001',
    fecha: '24 Oct, 2024',
    centroCostos: 'CBA Mosquera',
    area: 'Gastronomía',
    cuentadante: 'Carlos Alberto Ruiz',
    destino: 'Cocina Principal',
    ficha: 'ADSO-2670687',
    estado: 'Borrador',
    totalBienes: 8,
    montoTotal: 1240000,
    avatarColor: 'blue',
    bienes: [...BIENES_SOLICITUD_MOCK]
  },
  {
    id: 2,
    codigo: 'GIL-F-014-2024-002',
    fecha: '22 Oct, 2024',
    centroCostos: 'CBA Mosquera',
    area: 'Mantenimiento',
    cuentadante: 'Martha Lucía Gomez',
    destino: 'Taller Técnico',
    ficha: 'MANT-2550122',
    estado: 'Pendiente',
    totalBienes: 5,
    montoTotal: 450500,
    avatarColor: 'purple',
    bienes: [...BIENES_SOLICITUD_MOCK]
  },
  {
    id: 3,
    codigo: 'GIL-F-014-2024-003',
    fecha: '20 Oct, 2024',
    centroCostos: 'CBA Mosquera',
    area: 'Gestión Empresarial',
    cuentadante: 'Fernando Vallejo',
    destino: 'Aula 301',
    ficha: 'GEST-2899341',
    estado: 'Validado',
    totalBienes: 12,
    montoTotal: 2890000,
    avatarColor: 'amber',
    bienes: [...BIENES_SOLICITUD_MOCK]
  },
  {
    id: 4,
    codigo: 'GIL-F-014-2024-004',
    fecha: '18 Oct, 2024',
    centroCostos: 'CBA Mosquera',
    area: 'Gastronomía',
    cuentadante: 'Lucía Mercedes Prada',
    destino: 'Cocina Caliente',
    ficha: 'ADSO-2670687',
    estado: 'Aprobado',
    totalBienes: 20,
    montoTotal: 3150000,
    avatarColor: 'green',
    bienes: [...BIENES_SOLICITUD_MOCK]
  },
  {
    id: 5,
    codigo: 'GIL-F-014-2024-005',
    fecha: '15 Oct, 2024',
    centroCostos: 'CBA Mosquera',
    area: 'Mantenimiento',
    cuentadante: 'Roberto Jaramillo',
    destino: 'Laboratorio',
    ficha: 'MANT-2550122',
    estado: 'Procesado',
    totalBienes: 6,
    montoTotal: 890000,
    avatarColor: 'slate',
    bienes: [...BIENES_SOLICITUD_MOCK]
  },
];

/** @deprecated Use SOLICITUDES_MOCK — kept for backward-compat with SolicitudesService */
export const SOLICITUDES_GIL_MOCK = SOLICITUDES_MOCK;


