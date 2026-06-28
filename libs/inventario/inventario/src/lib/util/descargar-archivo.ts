/**
 * Dispara la descarga de un Blob en el navegador (patrón anchor + objectURL).
 * Se usa para los reportes/documentos que genera el microservicio de reportes
 * (acta, requisición, paquete, etc.) y se devuelven como archivo.
 */
export function descargarBlob(blob: Blob, nombreArchivo: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = nombreArchivo;
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
