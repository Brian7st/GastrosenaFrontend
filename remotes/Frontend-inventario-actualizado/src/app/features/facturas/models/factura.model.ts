export interface Factura {
  id: string;
  proveedor: string;
  proveedorIniciales: string;
  proveedorId: string;
  ordenCompra: string;
  total: number;
  fecha: string;
  estado: 'Activo' | 'Bajo Stock' | 'Pendiente' | 'Anulada';
}

export interface DetalleArticulo {
  descripcion: string;
  codigo: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
}

export interface ResumenPago {
  subtotal: number;
  iva: number;
  retencionZese: number;
  totalNeto: number;
}

export interface FacturaCompleta extends Factura {
  articulos: DetalleArticulo[];
  resumen: ResumenPago;
  nitReceptor?: string;
  clienteReceptor?: string;
  direccionReceptor?: string;
  nitEmisor: string;
  direccionEmisor: string;
  cufe: string;
  metodoPago: string;
}

export const FACTURAS_MOCK: Factura[] = [
  {
    id: '1',
    proveedor: 'TechCorp Solutions',
    proveedorIniciales: 'TC',
    proveedorId: 'ID: 809231-1',
    ordenCompra: 'OC-2023-045',
    total: 1450.00,
    fecha: 'Oct 24, 2023',
    estado: 'Activo'
  },
  {
    id: '2',
    proveedor: 'Global Logistics S.A.',
    proveedorIniciales: 'GL',
    proveedorId: 'ID: 554212-3',
    ordenCompra: 'OC-2023-046',
    total: 890.50,
    fecha: 'Oct 23, 2023',
    estado: 'Bajo Stock'
  },
  {
    id: '3',
    proveedor: 'Iberia Proveedores',
    proveedorIniciales: 'IP',
    proveedorId: 'ID: 102938-5',
    ordenCompra: 'OC-2023-047',
    total: 3200.00,
    fecha: 'Oct 22, 2023',
    estado: 'Activo'
  },
  {
    id: '4',
    proveedor: 'Blue Materiales',
    proveedorIniciales: 'BM',
    proveedorId: 'ID: 994011-9',
    ordenCompra: 'OC-2023-048',
    total: 540.00,
    fecha: 'Oct 22, 2023',
    estado: 'Pendiente'
  },
  {
    id: '5',
    proveedor: 'Nova Systems',
    proveedorIniciales: 'NS',
    proveedorId: 'ID: 772110-0',
    ordenCompra: 'OC-2023-049',
    total: 12400.00,
    fecha: 'Oct 21, 2023',
    estado: 'Activo'
  }
];

export const FACTURA_DETALLE_MOCK: FacturaCompleta = {
    id: '1',
    proveedor: 'Corporación Logística Global',
    proveedorIniciales: 'CL',
    proveedorId: 'ID: 809231-1',
    ordenCompra: 'OC-2023-045',
    total: 10260.00,
    fecha: '24 Oct, 2023',
    estado: 'Activo',
    nitReceptor: '900.452.118-5',
    clienteReceptor: 'Corporación Logística Global',
    direccionReceptor: 'Av. Industrial 45-12, Medellín',
    nitEmisor: '899.999.034-1',
    direccionEmisor: 'Calle 57 # 8 - 69, Bogotá',
    cufe: '89c4a85...9d8a1f2e3d4f5q6h7i8j9k01lm2n3o4p',
    metodoPago: 'Transferencia Bancaria - 30 Días',
    articulos: [
        { descripcion: 'Servicios de Consultoría IT', codigo: 'SERV-IT-001', cantidad: 2, precioUnitario: 1200000, total: 2400000 },
        { descripcion: 'Licencia Software Gestión', codigo: 'LIC-SOFT-45', cantidad: 5, precioUnitario: 450000, total: 2250000 },
        { descripcion: 'Soporte Técnico Remoto', codigo: 'SUP-REM-10', cantidad: 10, precioUnitario: 85000, total: 850000 },
        { descripcion: 'Implementación Nube Azure', codigo: 'IMP-CLOUD-01', cantidad: 1, precioUnitario: 3500000, total: 3500000 },
    ],
    resumen: {
        subtotal: 9000000,
        iva: 1710000,
        retencionZese: -450000,
        totalNeto: 10260000
    }
}
