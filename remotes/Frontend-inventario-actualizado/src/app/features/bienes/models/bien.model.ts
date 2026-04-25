// ==============================
// Modelos de Gestión de Bienes
// ==============================

export interface Bien {
  id: number;
  codigoSena: string;
  codigoProveedor: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  categoriaColor: 'blue' | 'amber' | 'green' | 'purple' | 'red';
  stock: number;
  stockMinimo: number;
  unidadMedida: string;
  valor: number;
  estado: 'Activo' | 'Bajo Stock' | 'Inactivo';
  imagenUrl?: string;
}

export interface MovimientoBien {
  id: number;
  fecha: string;
  tipo: 'ENTRADA' | 'SALIDA' | 'TRASLADO';
  responsable: string;
  ubicacion: string;
  cantidad: number;
  observacion: string;
}

export interface EspecificacionTecnica {
  etiqueta: string;
  valor: string;
}

export interface ExportConfig {
  fechaInicio: string;
  fechaFin: string;
  categoria: string;
  estado: string;
  almacen: string;
  formato: 'excel' | 'pdf' | 'csv';
}

export interface ImportRow {
  codigoPlaca: string;
  descripcion: string;
  serial: string;
  ubicacion: string;
  estado: 'Activo' | 'Bajo Stock';
}

// ==============================
// Datos Mock
// ==============================

export const BIENES_MOCK: Bien[] = [
  {
    id: 1,
    codigoSena: 'EQU-2024-001',
    codigoProveedor: 'PRV-992-B',
    nombre: 'Portátil Dell Latitude 5420',
    descripcion: 'Core i7, 16GB RAM, 512GB SSD',
    categoria: 'Equipos de Cómputo',
    categoriaColor: 'blue',
    stock: 15,
    stockMinimo: 5,
    unidadMedida: 'UND',
    valor: 4500000,
    estado: 'Activo'
  },
  {
    id: 2,
    codigoSena: 'PAP-2024-042',
    codigoProveedor: 'PRV-118-P',
    nombre: 'Papel Bond Carta 75g (Resma)',
    descripcion: 'Caja x 10 resmas',
    categoria: 'Papelería',
    categoriaColor: 'amber',
    stock: 4,
    stockMinimo: 10,
    unidadMedida: 'UND',
    valor: 120000,
    estado: 'Bajo Stock'
  },
  {
    id: 3,
    codigoSena: 'MOB-2024-015',
    codigoProveedor: 'PRV-445-M',
    nombre: 'Silla Ergonómica Pro-Manager',
    descripcion: 'Respaldo en malla, ajuste lumbar',
    categoria: 'Mobiliario',
    categoriaColor: 'green',
    stock: 32,
    stockMinimo: 10,
    unidadMedida: 'UND',
    valor: 850000,
    estado: 'Activo'
  },
  {
    id: 4,
    codigoSena: 'COC-2024-088',
    codigoProveedor: 'PRV-221-C',
    nombre: 'Olla Industrial 50 Litros',
    descripcion: 'Acero inoxidable 304, fondo difusor',
    categoria: 'Cocina',
    categoriaColor: 'purple',
    stock: 6,
    stockMinimo: 8,
    unidadMedida: 'UND',
    valor: 1200000,
    estado: 'Bajo Stock'
  }
];

export const MOVIMIENTOS_MOCK: MovimientoBien[] = [
  { id: 1, fecha: '14/05/2024', tipo: 'ENTRADA', responsable: 'Admin Central', ubicacion: 'Almacén General', cantidad: 5, observacion: 'Reposición de stock anual' },
  { id: 2, fecha: '22/04/2024', tipo: 'SALIDA', responsable: 'Coord. Sistemas', ubicacion: 'Laboratorio 302', cantidad: -2, observacion: 'Asignación a nuevos instructores' },
  { id: 3, fecha: '10/03/2024', tipo: 'TRASLADO', responsable: 'Gestión Activos', ubicacion: 'Sede Norte', cantidad: 0, observacion: 'Mantenimiento preventivo trimestral' }
];

export const IMPORT_ROWS_MOCK: ImportRow[] = [
  { codigoPlaca: 'SENA-001245', descripcion: 'Computador Portátil HP EliteBook', serial: '5CG12345XYZ', ubicacion: 'Sede Central - Piso 3', estado: 'Activo' },
  { codigoPlaca: 'SENA-001246', descripcion: 'Monitor Dell UltraSharp 27"', serial: 'CN-0X123-456', ubicacion: 'Sede Central - Piso 3', estado: 'Activo' },
  { codigoPlaca: 'SENA-001247', descripcion: 'Silla Ergonómica Pro-Manager', serial: 'N/A', ubicacion: 'Biblioteca - Ala Norte', estado: 'Bajo Stock' },
  { codigoPlaca: 'SENA-001248', descripcion: 'Video Beam Epson PowerLite', serial: 'VBP-7788-990', ubicacion: 'Auditorio Principal', estado: 'Activo' },
  { codigoPlaca: 'SENA-001249', descripcion: 'Tableta Digitalizadora Wacom', serial: 'WCM-4455-667', ubicacion: 'Lab Diseño Gráfico', estado: 'Activo' }
];
