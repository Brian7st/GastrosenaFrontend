import {
  ConciliacionRegistro,
  ConciliacionDetalle,
  ConciliacionDiferencia,
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
  almacen: 'Almacén Seco',
  estado: 'Completada',
  totalItems: 120,
  itemsCorrectos: 112,
  diferencias: 8,
  precision: 93.3,
  valoracionMonetaria: -340000,
  perdidas: -320000,
  sobrantes: 20000,
};

// ─────────────── Lista de diferencias del detalle ───────────────
export const DIFERENCIAS_MOCK: ConciliacionDiferencia[] = [
  {
    producto: 'Arroz Blanco Premium',
    codigo: 'COD-AB-001',
    categoria: 'Granos y Cereales',
    stockSis: '250 kg',
    fisico: '245 kg',
    dif: '-5 kg',
    valorUnit: 4000,
    impacto: -20000,
    isPositive: false,
  },
  {
    producto: 'Aceite de Oliva Extra Virgen',
    codigo: 'COD-AO-012',
    categoria: 'Aceites y Grasas',
    stockSis: '40 L',
    fisico: '35 L',
    dif: '-5 L',
    valorUnit: 60000,
    impacto: -300000,
    isPositive: false,
  },
  {
    producto: 'Sal Marina Fina',
    codigo: 'COD-SM-004',
    categoria: 'Especias y Condimentos',
    stockSis: '100 kg',
    fisico: '108 kg',
    dif: '+8 kg',
    valorUnit: 2500,
    impacto: 20000,
    isPositive: true,
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
  { producto: 'Aceite Vegetal', dif: '-15 L', icon: 'droplet' },
  { producto: 'Azúcar Refinada', dif: '-8 Kg', icon: 'package' },
  { producto: 'Carne de Res', dif: '-5 Kg', icon: 'beef' },
];
