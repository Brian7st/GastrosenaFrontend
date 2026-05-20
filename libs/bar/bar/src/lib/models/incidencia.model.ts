export interface AuditoriaIncidencia {
  idAuditoria: string;
  comanda: {
    idComanda: string;
    mesa?: { numeroMesa: string };
    nombreMesero?: string;
  };
  fechaRegistro: string;
  detalleModificado?: string;
  tipoIncidencia: 'CANCELACION' | 'DEVOLUCION' | 'MODIFICACION';
  motivo: string;
}
