export enum EstadoFactura {
  REGISTRADA = 'REGISTRADA',
  VERIFICADA = 'VERIFICADA',
  PAGADA = 'PAGADA',
  ANULADA = 'ANULADA',
}

export interface Factura {
  id: string;
  cufe: string;
  proveedor: string;
  valorTotal: number;
  estado: EstadoFactura;
  fechaEmision: string;
}
