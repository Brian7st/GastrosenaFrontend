import {
  ConciliacionRegistro,
  ConciliacionDetalle,
  DiferenciaItem,
  TomaFisicaItem,
  TopDiferencia,
} from './conciliacion.model';

// ─────────────── Historial de conciliaciones ───────────────
export const CONCILIACIONES_MOCK: ConciliacionRegistro[] = [
  {
    id: 'CONC-001',
    fecha: '12 Oct, 08:30',
    ubicacion: 'Cocina Principal',
    itemsTotal: 145,
    itemsDif: 12,
    precision: 92,
    estado: 'Completada',
    estadoColor: 'success',
  },
  {
    id: 'CONC-002',
    fecha: '11 Oct, 14:15',
    ubicacion: 'Bodega Refrigerados',
    itemsTotal: 89,
    itemsDif: 3,
    precision: 97,
    estado: 'En Proceso',
    estadoColor: 'info',
  },
  {
    id: 'CONC-003',
    fecha: '10 Oct, 09:00',
    ubicacion: 'Almacén Seco',
    itemsTotal: 320,
    itemsDif: 45,
    precision: 86,
    estado: 'Pendiente Ajustes',
    estadoColor: 'warning',
  },
];

// ─────────────── Detalle de una conciliación ───────────────
export const CONCILIACION_DETALLE_MOCK: ConciliacionDetalle = {
  id: 'CONC-2024-012',
  fecha: '24 Oct 2024',
  responsable: 'Carlos Ruiz',
  estado: 'Completada',
  totalItemsContados: 120,
  diferencias: 8,
  precision: 93.3,
  valorTotalDiferencias: -340000,
};

// ─────────────── Lista de diferencias del detalle ───────────────
export const DIFERENCIAS_MOCK: DiferenciaItem[] = [
  {
    producto: 'Arroz Blanco Premium',
    codigo: 'COD-AB-001',
    categoria: 'Granos y Cereales',
    stockSistema: 250,
    stockFisico: 245,
    diferencia: -5,
    unidad: 'kg',
    valorUnit: 4000,
    impacto: -20000,
  },
  {
    producto: 'Aceite de Oliva Extra Virgen',
    codigo: 'COD-AO-012',
    categoria: 'Aceites y Grasas',
    stockSistema: 40,
    stockFisico: 35,
    diferencia: -5,
    unidad: 'L',
    valorUnit: 60000,
    impacto: -300000,
  },
  {
    producto: 'Sal Marina Fina',
    codigo: 'COD-SM-004',
    categoria: 'Especias y Condimentos',
    stockSistema: 100,
    stockFisico: 108,
    diferencia: 8,
    unidad: 'kg',
    valorUnit: 2500,
    impacto: 20000,
  },
];

// ─────────────── Ítems de toma física ───────────────
export const TOMA_FISICA_ITEMS_MOCK: TomaFisicaItem[] = [
  {
    id: '1',
    codigoSena: 'HRN-001',
    categoria: 'Abarrotes',
    producto: 'Harina de Trigo (Kg)',
    stockSistema: 150,
    conteoFisico: 150,
    valorUnitario: 3500,
  },
  {
    id: '2',
    codigoSena: 'LCH-042',
    categoria: 'Lácteos',
    producto: 'Leche Entera (L)',
    stockSistema: 85,
    conteoFisico: 80,
    valorUnitario: 4200,
  },
  {
    id: '3',
    codigoSena: 'CRN-112',
    categoria: 'Cárnicos',
    producto: 'Solomillo de Res (Kg)',
    stockSistema: 12,
    conteoFisico: 14,
    valorUnitario: 45000,
  },
  {
    id: '4',
    codigoSena: 'ESP-008',
    categoria: 'Especias',
    producto: 'Pimienta Negra (g)',
    stockSistema: 500,
    conteoFisico: null,
    valorUnitario: 150,
  },
];

// ─────────────── Top diferencias (panel del historial) ───────────────
export const TOP_DIFERENCIAS_MOCK: TopDiferencia[] = [
  { producto: 'Aceite Vegetal', diferencia: '-15 L', icon: 'droplet' },
  { producto: 'Azúcar Refinada', diferencia: '-8 Kg', icon: 'package' },
  { producto: 'Carne de Res', diferencia: '-5 Kg', icon: 'beef' },
];
