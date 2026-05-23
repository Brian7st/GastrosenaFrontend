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
    numeroGil: 'GIL-F-014-2024-001',
    fecha: '24 Oct, 2024',
    centroFormacionId: 'CBA Mosquera',
    area: 'Gastronomía',
    cuentadantes: [{ id: 1, nombre: 'Carlos Alberto Ruiz' }],
    destino: 'Cocina Principal',
    fichaId: 'ADSO-2670687',
    estado: 'BORRADOR',
    bienes: [...BIENES_SOLICITUD_MOCK]
  },
  {
    id: 2,
    numeroGil: 'GIL-F-014-2024-002',
    fecha: '22 Oct, 2024',
    centroFormacionId: 'CBA Mosquera',
    area: 'Mantenimiento',
    cuentadantes: [{ id: 2, nombre: 'Martha Lucía Gomez' }],
    destino: 'Taller Técnico',
    fichaId: 'MANT-2550122',
    estado: 'EMITIDO',
    bienes: [...BIENES_SOLICITUD_MOCK]
  },
  {
    id: 3,
    numeroGil: 'GIL-F-014-2024-003',
    fecha: '20 Oct, 2024',
    centroFormacionId: 'CBA Mosquera',
    area: 'Gestión Empresarial',
    cuentadantes: [{ id: 3, nombre: 'Fernando Vallejo' }],
    destino: 'Aula 301',
    fichaId: 'GEST-2899341',
    estado: 'ENVIADO_PROVEEDOR',
    bienes: [...BIENES_SOLICITUD_MOCK]
  },
  {
    id: 4,
    numeroGil: 'GIL-F-014-2024-004',
    fecha: '18 Oct, 2024',
    centroFormacionId: 'CBA Mosquera',
    area: 'Gastronomía',
    cuentadantes: [{ id: 4, nombre: 'Lucía Mercedes Prada' }],
    destino: 'Cocina Caliente',
    fichaId: 'ADSO-2670687',
    estado: 'CERRADO',
    bienes: [...BIENES_SOLICITUD_MOCK]
  },
  {
    id: 5,
    numeroGil: 'GIL-F-014-2024-005',
    fecha: '15 Oct, 2024',
    centroFormacionId: 'CBA Mosquera',
    area: 'Mantenimiento',
    cuentadantes: [{ id: 5, nombre: 'Roberto Jaramillo' }],
    destino: 'Laboratorio',
    fichaId: 'MANT-2550122',
    estado: 'CERRADO',
    bienes: [...BIENES_SOLICITUD_MOCK]
  },
];

/** @deprecated Use SOLICITUDES_MOCK — kept for backward-compat with SolicitudesService */
export const SOLICITUDES_GIL_MOCK = SOLICITUDES_MOCK;
