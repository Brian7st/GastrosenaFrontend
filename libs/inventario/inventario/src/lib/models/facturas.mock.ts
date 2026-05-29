import { Factura, FacturaKpis, SolicitudGIL } from './facturas.model';

export const FACTURAS_MOCK: Factura[] = [
  {
    id: 1,
    numeroFactura: 'FEL-12345',
    cufe: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    proveedorNit: '900123456-1',
    proveedorNombre: 'TechCorp Solutions',
    proveedorBeneficiarioZese: true,
    fechaEmision: '2026-01-01',
    fechaRecepcion: '2026-01-02',
    estado: 'REGISTRADA',
    lineas: [
      { productoId: 'prod-001', descripcion: 'Mouse Logitech', cantidad: 2, precioUnitario: 100000, porcentajeIva: 19, iva: 19, subtotal: 200000, valorIva: 38000, total: 238000 },
      { productoId: 'prod-002', descripcion: 'Teclado Mecánico', cantidad: 1, precioUnitario: 250000, porcentajeIva: 19, iva: 19, subtotal: 250000, valorIva: 47500, total: 297500 },
    ],
    subtotal: 450000,
    totalIva: 85500,
    total: 532687.5,
    ordenCompra: 'OC-2026-001',
    instructorId: 'inst-123',
    valorRetencionZese: 2812.5,
    infoBancariaBanco: 'Bancolombia',
    infoBancariaCuenta: '1234567890',
    infoBancariaTipo: 'AHORROS',
  },
];

export const FACTURAS_KPIS_MOCK: FacturaKpis = {
  totalFacturas: 1,
  tendenciaTotalFacturas: 0,
  montoMensual: 532687.5,
  tendenciaMonto: 0,
  registradas: 1,
  verificadas: 0,
  pagadas: 0,
  anuladas: 0,
};

export const SOLICITUD_GIL_MOCK: SolicitudGIL = {
  id: 'GIL-F-014-2024-001',
  nombreVocero: 'Juan David Castro',
  horarios: '06:00 AM - 12:00 PM',
  resultadoAprendizaje: 'Realizar el mantenimiento correctivo de los sistemas mecánicos del entorno productivo...',
  estadoSolicitud: 'BORRADOR',
  fechaCreacion: '2024-10-24',
  totalEstimado: 1240000,
  responsable: 'Carlos Alberto Ruiz',
  regional: 'Antioquia',
  centroFormacion: 'Centro de Diseño y Manufactura del Cuero',
  areaPrograma: 'Mantenimiento Electromecánico Industrial',
  cuentadanteResponsable: 'Marta Lucía Gómez',
  destinoBien: 'Ambiente de Soldadura - Sede Itagüí',
  preFacturas: [
    {
      id: 'PROV-9982-2024',
      proveedor: 'Herramientas Industriales SAS',
      subtotal: 850000,
      items: [
        { descripcion: 'Juego de Llaves Allen - Industrial Grade', cantidad: 2, precioUnitario: 125000, porcentajeIva: 0, iva: 0, total: 250000 },
        { descripcion: 'Pulidora Angular 4.5" 1200W', cantidad: 2, precioUnitario: 300000, porcentajeIva: 0, iva: 0, total: 600000 },
      ],
    },
  ],
  observaciones: 'Solicitud de reposición de herramientas y EPP.',
  comentarios: ['Revisado por coordinación', '+1'],
  hashTransaccion: '8F9A2B...3C1E',
  idTransaccion: '#TRX-998210-GIL',
};
