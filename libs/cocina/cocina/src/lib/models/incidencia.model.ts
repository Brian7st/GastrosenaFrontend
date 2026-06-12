export interface AuditoriaIncidencia {
  idAuditoria: string;
  comanda: {
    idComanda: string;
    // El backend envía numeroMesa directo; el flujo de "LISTAS" usa mesa.numeroMesa.
    numeroMesa?: number;
    mesa?: { numeroMesa: string };
    nombreMesero?: string;
  };
  fechaRegistro: string;
  detalleModificado?: string;
  tipoIncidencia: 'CANCELACION' | 'DEVOLUCION' | 'MODIFICACION';
  motivo: string;
}
