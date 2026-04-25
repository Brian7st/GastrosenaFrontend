// ==============================
// Modelos de Formato GIL-F-014
// ==============================

export type EstadoSolicitud = 'Borrador' | 'Pendiente' | 'Validado' | 'Aprobado' | 'Procesado';

export interface SolicitudGil {
  id: number;
  codigo: string;
  fecha: string;
  solicitante: string;
  solicitanteIniciales: string;
  grupoFicha: string;
  estado: EstadoSolicitud;
  total: number;
}

export interface ItemPreFactura {
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface PreFactura {
  codigo: string;
  proveedor: string;
  monto: number;
  items: ItemPreFactura[];
}

export interface FacturaElectronicaDisponible {
  codigo: string;
  area: string;
  responsable: string;
  cantidadItems: number;
  monto: number;
  items: string[];
  seleccionada: boolean;
}

export interface SolicitudGilCompleta {
  id: number;
  codigo: string;
  fecha: string;
  estado: EstadoSolicitud;
  total: number;

  // Info general
  regional: string;
  centroFormacion: string;
  area: string;
  cuentadante: string;
  destinoBien: string;
  solicitante: string;
  solicitanteIniciales: string;

  // Trazabilidad académica
  vocero: string;
  cedulaVocero: string;
  resultadoAprendizaje: string;
  franjaHoraria: string;

  // Documentos
  preFacturas: PreFactura[];
  observaciones: string;
}

// ==============================
// Datos Mock
// ==============================

export const SOLICITUDES_GIL_MOCK: SolicitudGil[] = [
  {
    id: 1,
    codigo: 'GIL-F-014-2024-001',
    fecha: '24 Oct, 2024',
    solicitante: 'Carlos Alberto Ruiz',
    solicitanteIniciales: 'CR',
    grupoFicha: 'ADSO-2670687',
    estado: 'Borrador',
    total: 1240000
  },
  {
    id: 2,
    codigo: 'GIL-F-014-2024-002',
    fecha: '22 Oct, 2024',
    solicitante: 'Martha Lucía Gomez',
    solicitanteIniciales: 'MG',
    grupoFicha: 'MANT-2550122',
    estado: 'Pendiente',
    total: 450500
  },
  {
    id: 3,
    codigo: 'GIL-F-014-2024-003',
    fecha: '20 Oct, 2024',
    solicitante: 'Fernando Vallejo',
    solicitanteIniciales: 'FV',
    grupoFicha: 'GEST-2899341',
    estado: 'Validado',
    total: 2890000
  }
];

export const SOLICITUD_GIL_DETALLE_MOCK: SolicitudGilCompleta = {
  id: 1,
  codigo: 'GIL-F-014-2024-001',
  fecha: '24 Oct, 2024',
  estado: 'Borrador',
  total: 1240000,

  regional: 'Antioquia',
  centroFormacion: 'Centro de Diseño y Manufactura del Cuero',
  area: 'Mantenimiento Electromecánico Industrial',
  cuentadante: 'Marta Lucía Gómez',
  destinoBien: 'Ambiente de Soldadura - Sede Itagüí',
  solicitante: 'Carlos Alberto Ruiz',
  solicitanteIniciales: 'CR',

  vocero: 'Juan David Castro',
  cedulaVocero: '1.098.345.221',
  resultadoAprendizaje: 'Realizar el mantenimiento correctivo de los sistemas mecánicos...',
  franjaHoraria: '06:00 AM - 12:00 PM',

  preFacturas: [
    {
      codigo: 'PROV-9982-2024',
      proveedor: 'Herramientas Industriales SAS',
      monto: 850000,
      items: [
        { descripcion: 'Juego de Llaves Allen - Industrial Grade', cantidad: 2, precioUnitario: 125000, subtotal: 250000 },
        { descripcion: 'Pulidora Angular 4.5" 1200W', cantidad: 2, precioUnitario: 300000, subtotal: 600000 }
      ]
    },
    {
      codigo: 'PROV-4412-2024',
      proveedor: 'Dotaciones del Norte Ltda.',
      monto: 390000,
      items: [
        { descripcion: 'Careta Electrónica para Soldar Pro-T', cantidad: 3, precioUnitario: 130000, subtotal: 390000 }
      ]
    }
  ],
  observaciones: 'La presente solicitud se realiza para la reposición de herramientas y equipo de protección personal del ambiente de soldadura. El equipo actual presenta un desgaste superior al 80%, lo cual afecta la calidad de los procesos de formación y la seguridad de los aprendices de la ficha 2503201.'
};

export const FACTURAS_DISPONIBLES_MOCK: FacturaElectronicaDisponible[] = [
  {
    codigo: 'FEL-2024-001',
    area: 'Cocina',
    responsable: 'María González',
    cantidadItems: 2,
    monto: 844900,
    items: ['ALM-001 - Harina de Trigo x 50kg', 'CON-442 - Aceite Vegetal Bidón 20L'],
    seleccionada: true
  },
  {
    codigo: 'FEL-2024-004',
    area: 'Repostería',
    responsable: 'Ana López',
    cantidadItems: 2,
    monto: 520000,
    items: ['ALM-005 - Azúcar Refinada Bulto', 'CON-109 - Esencia de Vainilla Litro'],
    seleccionada: false
  }
];
