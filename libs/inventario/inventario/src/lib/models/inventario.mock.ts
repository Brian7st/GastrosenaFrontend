import { Bien, BienKpis } from './inventario.model';

export const BIENES_MOCK: Bien[] = [
  {
    id: 1,
    codigoSena: 'EQU-2024-001',
    codigoProveedor: 'PRV-992-B',
    nombre: 'Portátil Dell Latitude 5420',
    descripcion: 'Core i7, 16GB RAM, 512GB SSD',
    categoria: 'Equipos de Cómputo',
    categoriaColor: 'blue',
    stockActual: 15,
    stockMinimo: 5,
    unidadMedida: 'UND',
    valor: 4500000,
    estado: 'Activo',
    tieneHistorial: true
  },
  {
    id: 2,
    codigoSena: 'PAP-2024-042',
    codigoProveedor: 'PRV-118-P',
    nombre: 'Papel Bond Carta 75g (Resma)',
    descripcion: 'Caja x 10 resmas',
    categoria: 'Papelería',
    categoriaColor: 'amber',
    stockActual: 4,
    stockMinimo: 10,
    unidadMedida: 'UND',
    valor: 120000,
    estado: 'Bajo Stock',
    tieneHistorial: false
  },
  {
    id: 3,
    codigoSena: 'MOB-2024-015',
    codigoProveedor: 'PRV-445-M',
    nombre: 'Silla Ergonómica Pro-Manager',
    descripcion: 'Respaldo en malla, ajuste lumbar',
    categoria: 'Mobiliario',
    categoriaColor: 'green',
    stockActual: 32,
    stockMinimo: 10,
    unidadMedida: 'UND',
    valor: 850000,
    estado: 'Activo',
    tieneHistorial: true
  },
  {
    id: 4,
    codigoSena: 'COC-2024-088',
    codigoProveedor: 'PRV-221-C',
    nombre: 'Olla Industrial 50 Litros',
    descripcion: 'Acero inoxidable 304, fondo difusor',
    categoria: 'Cocina',
    categoriaColor: 'purple',
    stockActual: 6,
    stockMinimo: 8,
    unidadMedida: 'UND',
    valor: 1200000,
    estado: 'Bajo Stock',
    tieneHistorial: true
  }
];

export const BIENES_KPIS_MOCK: BienKpis = {
  valorTotal: 458240000,
  totalAlertas: 23,
  movimientosHoy: 156,
  tendenciaValor: 12
};
