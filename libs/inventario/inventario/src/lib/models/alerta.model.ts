// ============================================================
// Alertas — Modelos e interfaces (F-07)
// ============================================================

export type AlertaPrioridad = 'ALTA' | 'MEDIA' | 'BAJA';
export type AlertaEstado    = 'ACTIVA' | 'CRITICA' | 'RESUELTA';
export type AccionResolver  = 'gil' | 'entrada_manual' | 'revisada';

export interface Alerta {
  id:               string;
  tipo:             string;
  prioridad:        AlertaPrioridad;
  referenciaId:     string;
  referenciaTipo:   string;
  descripcion:      string;
  destinatarioId:   string;
  destinatarioRol:  string;
  fechaGeneracion:  string;
  estado:           AlertaEstado;
  fechaResolucion?: string;
  accionResolucion?: string;
  resueltoPorId?:   string;
  // Solo cuando tipo === 'STOCK_BAJO'
  codigoSena?:  string;
  nombreBien?:  string;
  stockActual?: number;
  stockMinimo?: number;
  unidad?:      string;
}

export interface RegistroHistorial {
  id:          string;
  bien:        string;
  lote:        string;
  prioridad:   AlertaPrioridad;
  accion:      string;
  responsable: string;
  referencia:  string;
  fecha:       string;
  hora:        string;
}

export interface UmbralConfig {
  id:          string;
  bien:        string;
  categoria:   string;
  icono:       string; // Material Symbol name
  stockMinimo: number;
  emailActivo: boolean;
  correos:     string;
  enAlerta:    boolean;
}

// ============================================================
// MOCKS
// ============================================================

export const MOCK_ALERTAS: Alerta[] = [
  {
    id:              'ALR-001',
    tipo:            'STOCK_BAJO',
    prioridad:       'ALTA',
    referenciaId:    'BIEN-001',
    referenciaTipo:  'BIEN',
    descripcion:     'Stock de Aceite de Oliva Extra Virgen por debajo del mínimo crítico.',
    destinatarioId:  'USR-001',
    destinatarioRol: 'ALMACENISTA',
    fechaGeneracion: '2023-10-26T09:45:00Z',
    estado:          'CRITICA',
    codigoSena:      'SENA-AOL-001',
    nombreBien:      'Aceite de Oliva Extra Virgen',
    stockActual:     0,
    stockMinimo:     50,
    unidad:          'L',
  },
  {
    id:              'ALR-002',
    tipo:            'STOCK_BAJO',
    prioridad:       'ALTA',
    referenciaId:    'BIEN-002',
    referenciaTipo:  'BIEN',
    descripcion:     'Stock de Harina de Trigo Premium por debajo del umbral mínimo.',
    destinatarioId:  'USR-001',
    destinatarioRol: 'ALMACENISTA',
    fechaGeneracion: '2023-10-25T08:00:00Z',
    estado:          'ACTIVA',
    codigoSena:      'SENA-HTP-002',
    nombreBien:      'Harina de Trigo Premium',
    stockActual:     12,
    stockMinimo:     100,
    unidad:          'Kg',
  },
  {
    id:              'ALR-003',
    tipo:            'STOCK_BAJO',
    prioridad:       'MEDIA',
    referenciaId:    'BIEN-003',
    referenciaTipo:  'BIEN',
    descripcion:     'Stock de Pechuga de Pollo próximo al umbral mínimo.',
    destinatarioId:  'USR-002',
    destinatarioRol: 'ALMACENISTA',
    fechaGeneracion: '2023-10-24T14:00:00Z',
    estado:          'ACTIVA',
    codigoSena:      'SENA-CAR-015',
    nombreBien:      'Pechuga de Pollo',
    stockActual:     45,
    stockMinimo:     50,
    unidad:          'Kg',
  },
];

export const MOCK_HISTORIAL: RegistroHistorial[] = [
  { id: 'HIST-001', bien: 'Harina de Trigo',  lote: 'HT-2023-45A',  prioridad: 'ALTA',   accion: 'Entrada Registrada',    responsable: 'Ana Torres',  referencia: 'REC-8942', fecha: '24 Oct 2023', hora: '14:30 hrs' },
  { id: 'HIST-002', bien: 'Carne de Res',      lote: 'CR-2023-12B',  prioridad: 'MEDIA',  accion: 'Revisada - Conforme',   responsable: 'Luis Gómez',  referencia: 'REV-0125', fecha: '24 Oct 2023', hora: '09:15 hrs' },
  { id: 'HIST-003', bien: 'Aceite de Oliva',   lote: 'AO-2023-99X',  prioridad: 'ALTA',   accion: 'GIL Generado',          responsable: 'Elena Ruiz',  referencia: 'GIL-4458', fecha: '23 Oct 2023', hora: '16:45 hrs' },
  { id: 'HIST-004', bien: 'Sal Marina',         lote: 'SM-2023-01A',  prioridad: 'BAJA',   accion: 'Entrada Registrada',    responsable: 'Ana Torres',  referencia: 'REC-8901', fecha: '22 Oct 2023', hora: '11:00 hrs' },
  { id: 'HIST-005', bien: 'Papa Pastusa',       lote: 'PP-2023-77B',  prioridad: 'ALTA',   accion: 'GIL Generado',          responsable: 'Luis Gómez',  referencia: 'GIL-4410', fecha: '21 Oct 2023', hora: '15:30 hrs' },
];

export const MOCK_UMBRALES: UmbralConfig[] = [
  { id: 'UMB-001', bien: 'Aceite de Oliva Extra Virgen', categoria: 'ABARROTES / ACEITES',     icono: 'oil_barrel',    stockMinimo: 15,  emailActivo: true,  correos: 'admin@empresa.com, ti@empresa.com',  enAlerta: false },
  { id: 'UMB-002', bien: 'Harina de Trigo Premium',      categoria: 'ABARROTES / HARINAS',     icono: 'bakery_dining', stockMinimo: 5,   emailActivo: true,  correos: 'compras@empresa.com',                enAlerta: false },
  { id: 'UMB-003', bien: 'Pechuga de Pollo',             categoria: 'CÁRNICOS / AVES',         icono: 'set_meal',      stockMinimo: 10,  emailActivo: true,  correos: 'urgencias@empresa.com',              enAlerta: true  },
  { id: 'UMB-004', bien: 'Sal Marina',                   categoria: 'ABARROTES / CONDIMENTOS', icono: 'kitchen',       stockMinimo: 50,  emailActivo: false, correos: '',                                   enAlerta: false },
];
