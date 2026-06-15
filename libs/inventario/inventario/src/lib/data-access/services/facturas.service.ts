import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { forkJoin, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Factura, FacturaFiltros, FacturaKpis, FacturaPaginacion, SolicitudGIL, EstadoGIL, ConciliacionGil, FacturaFormDto, GilPickerItem, NotaCredito, RegistrarNotaCreditoRequest } from '../../models/facturas.model';
import {
  ActualizarFacturaRequest,
  AnularFacturaRequest,
  FacturaPagedResponse,
  FacturaResponse,
  FacturaResumenResponse,
  ConciliacionGilResponse,
  ConciliarRequest,
  ResolverDiferenciaGilRequest,
  VincularInstructorRequest,
  NotaCreditoResponse,
  RegistrarNotaCreditoApiRequest,
  ResolverNotaCreditoRequest,
  ResolverNotaCreditoResponse,
} from '../api/sourcing.api';
import { BienGilResponse, GilResponse } from '../api/procurement.api';
import { facturaFromApi, conciliacionGilFromApi, facturaFormToRequest, notaCreditoFromApi } from '../mappers/sourcing.mapper';

const API = '/api/v1';

@Injectable({ providedIn: 'root' })
export class FacturasService {
  private http = inject(HttpClient);

  getFacturas(filtros?: FacturaFiltros): Observable<{ facturas: Factura[]; paginacion: FacturaPaginacion }> {
    let params = new HttpParams();
    if (filtros?.busqueda)   params = params.set('numeroFactura', filtros.busqueda);
    if (filtros?.estado)     params = params.set('estado', filtros.estado);
    if (filtros?.proveedor)  params = params.set('proveedorNit', filtros.proveedor);
    if (filtros?.fechaDesde) params = params.set('fechaDesde', filtros.fechaDesde);
    if (filtros?.fechaHasta) params = params.set('fechaHasta', filtros.fechaHasta);
    params = params.set('page', String(filtros?.page ?? 0));
    params = params.set('size', String(filtros?.size ?? 10));

    return this.http
      .get<FacturaPagedResponse>(`${API}/sourcing/facturas`, { params })
      .pipe(
        map(res => ({
          facturas: res.contenido.map(facturaFromApi),
          paginacion: {
            totalElements: res.totalElementos,
            totalPages:    res.totalPaginas,
            page:          res.paginaActual,
            size:          res.tamano,
          },
        })),
        catchError(err => throwError(() => err))
      );
  }

  getKpis(): Observable<FacturaKpis> {
    return this.http
      .get<FacturaResumenResponse>(`${API}/sourcing/facturas/resumen`)
      .pipe(
        map(r => ({
          totalFacturas:          r.totalGeneral,
          tendenciaTotalFacturas: 0,
          montoMensual:           r.montoGeneral,
          tendenciaMonto:         0,
          registradas:            r.totalRegistradas,
          verificadas:            r.totalVerificadas,
          pagadas:                r.totalPagadas,
          anuladas:               r.totalAnuladas,
        })),
        catchError(err => throwError(() => err))
      );
  }

  getFacturaById(id: string | number): Observable<Factura | undefined> {
    return this.http
      .get<FacturaResponse>(`${API}/sourcing/facturas/${id}`)
      .pipe(
        map(facturaFromApi),
        catchError(err => throwError(() => err))
      );
  }

  createFactura(data: FacturaFormDto): Observable<Factura> {
    return this.http
      .post<FacturaResponse>(`${API}/sourcing/facturas`, facturaFormToRequest(data))
      .pipe(
        map(facturaFromApi),
        catchError(err => throwError(() => err))
      );
  }

  importarFacturaFelXml(file: File, gilId?: string): Observable<Factura> {
    const formData = new FormData();
    formData.append('archivo', file, file.name);

    let params = new HttpParams();
    if (gilId) params = params.set('gilId', gilId);

    return this.http
      .post<FacturaResponse>(`${API}/sourcing/facturas/importar-fel-xml`, formData, { params })
      .pipe(
        map(facturaFromApi),
        catchError(err => throwError(() => err))
      );
  }

  updateFactura(id: string | number, data: ActualizarFacturaRequest): Observable<Factura> {
    return this.http
      .patch<FacturaResponse>(`${API}/sourcing/facturas/${id}`, data)
      .pipe(
        map(facturaFromApi),
        catchError(err => throwError(() => err))
      );
  }

  /** PATCH /sourcing/facturas/{id}/anular - motivo es @NotBlank en backend */
  anularFactura(id: string | number, motivo: string): Observable<void> {
    const body: AnularFacturaRequest = { motivo };
    return this.http
      .patch<void>(`${API}/sourcing/facturas/${id}/anular`, body)
      .pipe(catchError(err => throwError(() => err)));
  }

  /** PATCH /sourcing/facturas/{id}/verificar - dispara entrada automática de stock */
  verificarFactura(id: string | number): Observable<Factura> {
    return this.http
      .patch<FacturaResponse>(`${API}/sourcing/facturas/${id}/verificar`, {})
      .pipe(
        map(facturaFromApi),
        catchError(err => throwError(() => err))
      );
  }

  /**
   * PATCH /sourcing/facturas/{id}/lineas/resolver — asocia una línea PENDIENTE-CATALOGO
   * a un bien existente del catálogo por su código SENA. El bien debe existir.
   */
  resolverLineaPendiente(
    id: string | number,
    descripcionLinea: string,
    codigoProductoSena: string
  ): Observable<Factura> {
    const body = { descripcionLinea, codigoProductoSena };
    return this.http
      .patch<FacturaResponse>(`${API}/sourcing/facturas/${id}/lineas/resolver`, body)
      .pipe(
        map(facturaFromApi),
        catchError(err => throwError(() => err))
      );
  }

  /** PATCH /sourcing/facturas/{id}/pagar - solo válido desde estado VERIFICADA */
  marcarPagada(id: string | number): Observable<Factura> {
    return this.http
      .patch<FacturaResponse>(`${API}/sourcing/facturas/${id}/pagar`, {})
      .pipe(
        map(facturaFromApi),
        catchError(err => throwError(() => err))
      );
  }

  /** PATCH /sourcing/facturas/{id}/info-bancaria - solo en estados REGISTRADA o VERIFICADA */
  actualizarInfoBancaria(
    id: string | number,
    data: { banco: string; tipoCuenta: string; numeroCuenta: string },
  ): Observable<Factura> {
    return this.http
      .patch<FacturaResponse>(`${API}/sourcing/facturas/${id}/info-bancaria`, data)
      .pipe(
        map(facturaFromApi),
        catchError(err => throwError(() => err))
      );
  }

  /** POST /sourcing/conciliaciones-gil - vincula una factura con su GIL - 201 Created */
  conciliarFacturaGil(
    facturaId: string,
    gilId: string,
    cantidadesRecibidas?: Record<string, number>,
  ): Observable<ConciliacionGil> {
    const body: ConciliarRequest = { facturaId, gilId };
    if (cantidadesRecibidas && Object.keys(cantidadesRecibidas).length > 0) {
      body.cantidadesRecibidas = cantidadesRecibidas;
    }
    return this.http
      .post<ConciliacionGilResponse>(`${API}/sourcing/conciliaciones-gil`, body)
      .pipe(
        map(conciliacionGilFromApi),
        catchError(err => throwError(() => err))
      );
  }

  /** GET /sourcing/conciliaciones-gil?facturaId=X ó ?gilId=Y */
  getConciliacionGil(params: { facturaId?: string; gilId?: string }): Observable<ConciliacionGil> {
    let httpParams = new HttpParams();
    if (params.facturaId) httpParams = httpParams.set('facturaId', params.facturaId);
    if (params.gilId)     httpParams = httpParams.set('gilId',     params.gilId);
    return this.http
      .get<ConciliacionGilResponse>(`${API}/sourcing/conciliaciones-gil`, { params: httpParams })
      .pipe(
        map(conciliacionGilFromApi),
        catchError(err => throwError(() => err))
      );
  }

  /** PATCH /sourcing/conciliaciones-gil/{id}/diferencias/{gilItemId}/resolver */
  resolverDiferenciaGil(id: string, gilItemId: string, observacion: string): Observable<ConciliacionGil> {
    const body: ResolverDiferenciaGilRequest = { observacion };
    return this.http
      .patch<ConciliacionGilResponse>(
        `${API}/sourcing/conciliaciones-gil/${id}/diferencias/${gilItemId}/resolver`,
        body,
      )
      .pipe(
        map(conciliacionGilFromApi),
        catchError(err => throwError(() => err))
      );
  }

  /** PUT /sourcing/instructor-vinculos/{ordenCompra} - 204 No Content */
  vincularInstructorOrden(ordenCompra: string, instructorId: string): Observable<void> {
    const body: VincularInstructorRequest = { instructorId };
    return this.http
      .put<void>(`${API}/sourcing/instructor-vinculos/${ordenCompra}`, body)
      .pipe(catchError(err => throwError(() => err)));
  }

  /** GET /procurement/giles/:id — bienes del GIL para cruce manual en importación FEL. */
  getGilBienes(gilId: string): Observable<BienGilResponse[]> {
    return this.http
      .get<GilResponse>(`${API}/procurement/giles/${gilId}`)
      .pipe(
        map(r => r.bienes ?? []),
        catchError(err => throwError(() => err))
      );
  }

  /** GET /procurement/giles — lista para picker en importación FEL.
   *  Incluye EMITIDO y ENVIADO_PROVEEDOR: una factura puede llegar mientras el GIL
   *  aún está en estado EMITIDO, antes de ser enviado formalmente al proveedor. */
  getGilesEnviadosProveedor(): Observable<GilPickerItem[]> {
    return forkJoin([
      this.http.get<{ content: GilResponse[] }>(`${API}/procurement/giles`, {
        params: new HttpParams().set('estado', 'EMITIDO').set('size', '100'),
      }),
      this.http.get<{ content: GilResponse[] }>(`${API}/procurement/giles`, {
        params: new HttpParams().set('estado', 'ENVIADO_PROVEEDOR').set('size', '100'),
      }),
    ]).pipe(
      map(([emitidos, enviados]) => {
        const combined = [...(emitidos.content ?? []), ...(enviados.content ?? [])];
        return combined.map(g => ({ id: g.id, numeroGil: g.numeroGil, destino: g.destinoBienes }));
      }),
      catchError(err => throwError(() => err))
    );
  }

  /** POST /api/v1/notas-credito — registra una nota crédito por sobre-facturación */
  registrarNotaCredito(req: RegistrarNotaCreditoRequest): Observable<NotaCredito> {
    const body: RegistrarNotaCreditoApiRequest = {
      facturaId:    req.facturaId,
      cufeOrigen:   req.cufeOrigen,
      motivo:       req.motivo,
      fechaEmision: req.fechaEmision,
      lineas:       req.lineas,
    };
    return this.http
      .post<NotaCreditoResponse>(`${API}/notas-credito`, body)
      .pipe(
        map(notaCreditoFromApi),
        catchError(err => throwError(() => err)),
      );
  }

  /** POST /api/v1/conciliaciones/{conciliacionId}/detalles/{gilItemId}/resolver-nota-credito */
  resolverConNotaCredito(
    conciliacionId: string,
    gilItemId:      string,
    notaCreditoIds: string[],
  ): Observable<ResolverNotaCreditoResponse> {
    const body: ResolverNotaCreditoRequest = { notaCreditoIds };
    return this.http
      .post<ResolverNotaCreditoResponse>(
        `${API}/conciliaciones/${conciliacionId}/detalles/${gilItemId}/resolver-nota-credito`,
        body,
      )
      .pipe(catchError(err => throwError(() => err)));
  }

  /** Mapea GilResponse al tipo SolicitudGIL que usa la FacturasFacade.
   *  SolicitudGIL (facturas.model) y SolicitudGil (solicitudes-gil.model) son dos
   *  tipos distintos - unificarlos es trabajo de un refactor posterior. */
  getSolicitudGIL(id: string): Observable<SolicitudGIL | undefined> {
    return this.http
      .get<GilResponse>(`${API}/procurement/giles/${id}`)
      .pipe(
        map(g => this.gilResponseToSolicitudGIL(g)),
        catchError(err => throwError(() => err))
      );
  }

  private gilResponseToSolicitudGIL(g: GilResponse): SolicitudGIL {
    return {
      id:                      g.id,
      nombreVocero:            g.jefeOficinaCoordinador,
      // horarios and hashTransaccion are training-module fields not present in GilResponse
      horarios:                '',
      resultadoAprendizaje:    g.resultadoAprendizaje ?? '',
      estadoSolicitud:         g.estado as EstadoGIL,
      fechaCreacion:           g.fechaSolicitud,
      // totalEstimado is not returned by /procurement/giles — derived from bienes if needed
      totalEstimado:           g.bienes?.reduce((acc, b) => acc + b.subtotal, 0) ?? 0,
      responsable:             g.emitidoPor ?? '',
      regional:                g.regionalNombre,
      centroFormacion:         g.centroCostosNombre,
      areaPrograma:            g.area,
      cuentadanteResponsable:  g.cuentadantes[0]?.nombre ?? '',
      destinoBien:             g.destinoBienes,
      preFacturas:             [],
      observaciones:           g.observaciones ?? '',
      hashTransaccion:         '',
      idTransaccion:           '',
      numeroGil:               g.numeroGil,
      codigoGrupo:             g.codigoGrupo ?? '',
      solicitante:             g.solicitante ?? '',
      cuentadantes:            g.cuentadantes?.map(c => c.nombre) ?? [],
      bienes:                  (g.bienes ?? []).map(b => ({
        codigoSena:    b.codigoSena,
        descripcion:   b.descripcion,
        unidadMedida:  b.unidadMedida,
        cantidad:      b.cantidad,
        valorUnitario: b.valorUnitario,
        iva:           b.iva,
        subtotal:      b.subtotal,
      })),
    };
  }
}
