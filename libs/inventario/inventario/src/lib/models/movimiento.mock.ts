import { Movimiento } from './movimiento.model';

export const MOVIMIENTOS_MOCK: Movimiento[] = [
  {
    id: '1',
    tipo: 'ENTRADA',
    productoNombre: 'Cable UTP Cat 6a',
    productoSku: 'NET-CAT6A-01',
    codigoSena: 'AOL001',
    cantidad: 150,
    unidad: 'Metros',
    fecha: '15 Oct 2023',
    hora: '09:45 AM',
    origenDestino: 'Proveedor: TechGlobal',
    docOrigen: 'FAC-2025-001',
    responsableNombre: 'Carlos R.',
    responsableAvatar: 'CR',
    valor: 450000,
    estado: 'Completado'
  },
  {
    id: '2',
    tipo: 'SALIDA',
    productoNombre: 'Multímetro Digital Pro',
    productoSku: 'TOOL-DMM-05',
    codigoSena: 'HTP002',
    cantidad: 12,
    unidad: 'Unidades',
    fecha: '15 Oct 2023',
    hora: '11:20 AM',
    origenDestino: 'Laboratorio de Electrónica',
    docOrigen: 'GIL-2024-089',
    responsableNombre: 'Ana M.',
    responsableAvatar: 'AM',
    valor: 1240000,
    estado: 'Pendiente'
  },
  {
    id: '3',
    tipo: 'ENTRADA',
    productoNombre: 'Conector RJ45 blindado',
    productoSku: 'NET-RJ45-B',
    codigoSena: 'TCP003',
    cantidad: 1000,
    unidad: 'Piezas',
    fecha: '14 Oct 2023',
    hora: '04:15 PM',
    origenDestino: 'Stock General',
    docOrigen: 'FAC-2025-003',
    responsableNombre: 'SISTEMA',
    responsableAvatar: 'SIS',
    valor: 85000,
    estado: 'Completado'
  }
];
