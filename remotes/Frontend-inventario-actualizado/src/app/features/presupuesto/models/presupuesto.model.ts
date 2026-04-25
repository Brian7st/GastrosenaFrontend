export interface RubroPresupuestal {
  id: string;
  programa: string;           
  nombre: string;             
  codigo: string;             
  apropiacionInicial: number;
  disponible: number;
  comprometido: number;
  pagado: number;
  retencionZese: number;
  porcentajeEjecucion: number;
  nivelEjecucion: 'normal' | 'alto' | 'critico';
}

export interface GilDocumento {
  id: string;
  codigo: string;             
  fechaValidacion: string;
  monto: number;
  rubro: string;
  item: string;
  estado: 'validado' | 'procesado' | 'error';
  errorMessage?: string;
}

export interface VencimientoProximo {
  titulo: string;
  fecha: string;
  diasRestantes: number;
  tipo: 'critico' | 'pendiente' | 'informativo';
}

export const MOCK_RUBROS: RubroPresupuestal[] = [
  {
    id: '1',
    programa: 'Agropecuaria',
    nombre: 'Materiales para Formación',
    codigo: '212-04-01-01',
    apropiacionInicial: 850000000,
    disponible: 42500000,
    comprometido: 807500000,
    pagado: 640200000,
    retencionZese: 0,
    porcentajeEjecucion: 95,
    nivelEjecucion: 'critico'
  },
  {
    id: '2',
    programa: 'Agropecuaria',
    nombre: 'Mantenimiento de Maquinaria',
    codigo: '212-04-02-15',
    apropiacionInicial: 420000000,
    disponible: 84000000,
    comprometido: 336000000,
    pagado: 295000000,
    retencionZese: 8400000,
    porcentajeEjecucion: 80,
    nivelEjecucion: 'alto'
  },
  {
    id: '3',
    programa: 'Formación Titulada',
    nombre: 'Instructores Contratistas',
    codigo: '121-01-05-02',
    apropiacionInicial: 4500000000,
    disponible: 900000000,
    comprometido: 3600000000,
    pagado: 3200000000,
    retencionZese: 18250000,
    porcentajeEjecucion: 80,
    nivelEjecucion: 'alto'
  },
  {
    id: '4',
    programa: 'Formación Titulada',
    nombre: 'Infraestructura Tecnológica',
    codigo: '215-11-03-01',
    apropiacionInicial: 1200000000,
    disponible: 180000000,
    comprometido: 1020000000,
    pagado: 850000000,
    retencionZese: 0,
    porcentajeEjecucion: 85,
    nivelEjecucion: 'critico'
  },
  {
    id: '5',
    programa: 'Formación Titulada',
    nombre: 'Certificación de Competencias',
    codigo: '215-08-01-04',
    apropiacionInicial: 250000000,
    disponible: 195000000,
    comprometido: 55000000,
    pagado: 48000000,
    retencionZese: 1200000,
    porcentajeEjecucion: 22,
    nivelEjecucion: 'normal'
  }
];

export const MOCK_GIL_DOCUMENTOS: GilDocumento[] = [
  {
    id: 'g1',
    codigo: 'GIL-F-014-2023-1102',
    fechaValidacion: '23 Oct 2023',
    monto: 28750000,
    rubro: '2.1.2.02.01.003.01',
    item: 'Materiales de Formación - Construcción',
    estado: 'error',
    errorMessage: 'El rubro correspondiente no tiene saldo disponible suficiente'
  },
  {
    id: 'g2',
    codigo: 'GIL-F-014-2023-1105',
    fechaValidacion: '23 Oct 2023',
    monto: 5600000,
    rubro: '2.1.2.02.02.008.02',
    item: 'Servicios de Limpieza General',
    estado: 'validado'
  },
  {
    id: 'g3',
    codigo: 'GIL-F-014-2023-1108',
    fechaValidacion: '22 Oct 2023',
    monto: 1250000,
    rubro: '2.1.2.01.01.002.04',
    item: 'Papelería y Útiles de Oficina',
    estado: 'validado'
  }
];

export const MOCK_VENCIMIENTOS: VencimientoProximo[] = [
  {
    titulo: 'Cierre Contratación Directa',
    fecha: 'Nov 02',
    diasRestantes: 2,
    tipo: 'critico'
  },
  {
    titulo: 'Informe de Ejecución Mensual',
    fecha: 'Nov 05',
    diasRestantes: 5,
    tipo: 'pendiente'
  },
  {
    titulo: 'Conciliación ZESE Trimestral',
    fecha: 'Nov 12',
    diasRestantes: 12,
    tipo: 'informativo'
  }
];
