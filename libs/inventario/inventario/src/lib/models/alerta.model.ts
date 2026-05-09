// ============================================================
// Alertas de Stock — Modelos e interfaces
// RF-5.1, RF-5.6
// ============================================================

export type AlertaPrioridad = 'critica' | 'alta' | 'media' | 'baja';
export type AlertaEstado    = 'activa' | 'resuelta' | 'revisada';
export type AccionResolver  = 'gil' | 'entrada_manual' | 'revisada';

export interface TendenciaPoint {
  fecha:  string;
  nivel:  number; // porcentaje del stock respecto al objetivo (0-100)
}

export interface IncidenciaHistorial {
  fecha:        string;
  tipo:         'agotado' | 'alerta_umbral' | 'resuelto';
  descripcion:  string;
}

export interface Alerta {
  id:                   string;
  codigoSena:           string;
  nombreBien:           string;
  categoria:            string;
  ubicacion:            string;
  prioridad:            AlertaPrioridad;
  estado:               AlertaEstado;
  stockActual:          number;
  stockMinimo:          number;
  stockObjetivo:        number;
  unidad:               string;
  diasRestantes:        number;
  valorEnRiesgo:        number;
  notificacionEnviada:  boolean;
  fechaAlerta:          string;
  tendencia:            TendenciaPoint[];
  historialIncidencias: IncidenciaHistorial[];
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
    id:            'ALR-001',
    codigoSena:    'SENA-AOL-001',
    nombreBien:    'Aceite de Oliva Extra Virgen',
    categoria:     'Insumos Básicos',
    ubicacion:     'Almacén Principal, Sector A',
    prioridad:     'critica',
    estado:        'activa',
    stockActual:   0,
    stockMinimo:   50,
    stockObjetivo: 100,
    unidad:        'L',
    diasRestantes: 0,
    valorEnRiesgo: 1200000,
    notificacionEnviada: true,
    fechaAlerta:   '2023-10-26T09:45:00Z',
    tendencia: [
      { fecha: 'Hace 30 días', nivel: 90 },
      { fecha: 'Hace 25 días', nivel: 85 },
      { fecha: 'Hace 20 días', nivel: 75 },
      { fecha: 'Hace 15 días', nivel: 60 },
      { fecha: 'Hace 10 días', nivel: 45 },
      { fecha: 'Hace 7 días',  nivel: 30 },
      { fecha: 'Hace 3 días',  nivel: 15 },
      { fecha: 'Hoy',         nivel: 2 },
    ],
    historialIncidencias: [
      { fecha: 'Hoy, 09:45 AM',       tipo: 'agotado',       descripcion: 'El nivel de stock llegó a 0L. Se requiere reposición urgente.' },
      { fecha: 'Hace 3 días',          tipo: 'alerta_umbral', descripcion: 'El stock descendió por debajo del mínimo de 50L (45L registrados).' },
      { fecha: '15 Octubre, 2023',     tipo: 'resuelto',      descripcion: 'Ingreso de 150L al almacén principal. Estado normalizado.' },
      { fecha: '12 Octubre, 2023',     tipo: 'agotado',       descripcion: 'Incidencia previa similar resuelta en 3 días.' },
    ],
  },
  {
    id:            'ALR-002',
    codigoSena:    'SENA-HTP-002',
    nombreBien:    'Harina de Trigo Premium',
    categoria:     'Abarrotes',
    ubicacion:     'Almacén Central, Sector B',
    prioridad:     'alta',
    estado:        'activa',
    stockActual:   12,
    stockMinimo:   100,
    stockObjetivo: 200,
    unidad:        'Kg',
    diasRestantes: 2,
    valorEnRiesgo: 450000,
    notificacionEnviada: true,
    fechaAlerta:   '2023-10-25T08:00:00Z',
    tendencia: [
      { fecha: 'Hace 30 días', nivel: 80 },
      { fecha: 'Hace 25 días', nivel: 70 },
      { fecha: 'Hace 20 días', nivel: 55 },
      { fecha: 'Hace 15 días', nivel: 40 },
      { fecha: 'Hace 10 días', nivel: 25 },
      { fecha: 'Hace 7 días',  nivel: 18 },
      { fecha: 'Hace 3 días',  nivel: 10 },
      { fecha: 'Hoy',         nivel: 6 },
    ],
    historialIncidencias: [
      { fecha: 'Hoy, 08:00 AM',    tipo: 'alerta_umbral', descripcion: 'Stock en 12kg, muy por debajo del umbral mínimo de 100kg.' },
      { fecha: 'Hace 5 días',       tipo: 'alerta_umbral', descripcion: 'Se detectó descenso continuo desde 80kg.' },
    ],
  },
  {
    id:            'ALR-003',
    codigoSena:    'SENA-CAR-015',
    nombreBien:    'Pechuga de Pollo',
    categoria:     'Cárnicos',
    ubicacion:     'Cuarto Frío, Sector C',
    prioridad:     'media',
    estado:        'activa',
    stockActual:   45,
    stockMinimo:   50,
    stockObjetivo: 100,
    unidad:        'Kg',
    diasRestantes: 5,
    valorEnRiesgo: 800000,
    notificacionEnviada: true,
    fechaAlerta:   '2023-10-24T14:00:00Z',
    tendencia: [
      { fecha: 'Hace 30 días', nivel: 95 },
      { fecha: 'Hace 25 días', nivel: 88 },
      { fecha: 'Hace 20 días', nivel: 78 },
      { fecha: 'Hace 15 días', nivel: 70 },
      { fecha: 'Hace 10 días', nivel: 62 },
      { fecha: 'Hace 7 días',  nivel: 55 },
      { fecha: 'Hace 3 días',  nivel: 50 },
      { fecha: 'Hoy',         nivel: 45 },
    ],
    historialIncidencias: [
      { fecha: 'Hoy, 14:00 PM',    tipo: 'alerta_umbral', descripcion: 'Stock a 45kg, cercano al umbral mínimo de 50kg.' },
    ],
  },
];

export const MOCK_HISTORIAL: RegistroHistorial[] = [
  { id: 'HIST-001', bien: 'Harina de Trigo',  lote: 'HT-2023-45A',  prioridad: 'alta',    accion: 'Entrada Registrada',    responsable: 'Ana Torres',  referencia: 'REC-8942', fecha: '24 Oct 2023', hora: '14:30 hrs' },
  { id: 'HIST-002', bien: 'Carne de Res',      lote: 'CR-2023-12B',  prioridad: 'media',   accion: 'Revisada - Conforme',   responsable: 'Luis Gómez',  referencia: 'REV-0125', fecha: '24 Oct 2023', hora: '09:15 hrs' },
  { id: 'HIST-003', bien: 'Aceite de Oliva',   lote: 'AO-2023-99X',  prioridad: 'critica', accion: 'GIL Generado',          responsable: 'Elena Ruiz',  referencia: 'GIL-4458', fecha: '23 Oct 2023', hora: '16:45 hrs' },
  { id: 'HIST-004', bien: 'Sal Marina',         lote: 'SM-2023-01A',  prioridad: 'baja',    accion: 'Entrada Registrada',    responsable: 'Ana Torres',  referencia: 'REC-8901', fecha: '22 Oct 2023', hora: '11:00 hrs' },
  { id: 'HIST-005', bien: 'Papa Pastusa',       lote: 'PP-2023-77B',  prioridad: 'alta',    accion: 'GIL Generado',          responsable: 'Luis Gómez',  referencia: 'GIL-4410', fecha: '21 Oct 2023', hora: '15:30 hrs' },
];

export const MOCK_UMBRALES: UmbralConfig[] = [
  { id: 'UMB-001', bien: 'Aceite de Oliva Extra Virgen', categoria: 'ABARROTES / ACEITES',    icono: 'oil_barrel',    stockMinimo: 15,  emailActivo: true,  correos: 'admin@empresa.com, ti@empresa.com',  enAlerta: false },
  { id: 'UMB-002', bien: 'Harina de Trigo Premium',      categoria: 'ABARROTES / HARINAS',    icono: 'bakery_dining', stockMinimo: 5,   emailActivo: true,  correos: 'compras@empresa.com',                enAlerta: false },
  { id: 'UMB-003', bien: 'Pechuga de Pollo',             categoria: 'CÁRNICOS / AVES',        icono: 'set_meal',      stockMinimo: 10,  emailActivo: true,  correos: 'urgencias@empresa.com',              enAlerta: true  },
  { id: 'UMB-004', bien: 'Sal Marina',                   categoria: 'ABARROTES / CONDIMENTOS', icono: 'kitchen',      stockMinimo: 50,  emailActivo: false, correos: '',                                   enAlerta: false },
];
