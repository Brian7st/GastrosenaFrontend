import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ContratosService } from './contratos.service';
import { ContratoResponse, ImportacionContratoResponse, PrecioVigenteResponse } from '../api/catalog.api';
import { RegistrarContratoData } from '../../models/contrato.model';

describe('ContratosService', () => {
  let service: ContratosService;
  let httpMock: HttpTestingController;

  const contratoResponse: ContratoResponse = {
    id: 'cto-1',
    numero: 'CTO-2025-001',
    descripcion: 'Insumos 2025',
    vigencia: 2025,
    fechaInicio: '2025-01-01',
    fechaFin: '2025-12-31',
    estado: 'VIGENTE',
    items: [
      {
        refArticulo: '1',
        codigoSena: '283415',
        descripcion: 'Harina',
        unidadMedida: 'kg',
        cantidad: 1,
        codigoProveedor: 'PROV-900',
        valorEstimado: 5200,
        vrlAdjudicado: 5000,
        vrlAntes: 4202,
        ivaPorcentaje: 0.19,
        ivaValor: 798.38,
      },
    ],
  };

  const datosRegistro: RegistrarContratoData = {
    numero: 'CTO-2025-001',
    descripcion: 'Insumos 2025',
    vigencia: 2025,
    fechaInicio: '2025-01-01',
    fechaFin: '2025-12-31',
    items: [
      { refArticulo: '1', descripcion: 'Harina', vrlAdjudicado: 5000 },
    ],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContratosService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ContratosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('getContratos maps the API response to the domain model', () => {
    service.getContratos().subscribe(contratos => {
      expect(contratos.length).toBe(1);
      expect(contratos[0].numero).toBe('CTO-2025-001');
      expect(contratos[0].items[0].ivaValor).toBe(798.38);
    });

    const req = httpMock.expectOne('/api/v1/catalog/contratos');
    expect(req.request.method).toBe('GET');
    req.flush([contratoResponse]);
  });

  it('getContratos forwards the vigencia query param', () => {
    service.getContratos(2025).subscribe();

    const req = httpMock.expectOne(r => r.url === '/api/v1/catalog/contratos');
    expect(req.request.params.get('vigencia')).toBe('2025');
    req.flush([contratoResponse]);
  });

  it('falls back to VIGENTE for an unknown estado', () => {
    service.getContratoById('cto-1').subscribe(contrato => {
      expect(contrato.estado).toBe('VIGENTE');
    });

    const req = httpMock.expectOne('/api/v1/catalog/contratos/cto-1');
    req.flush({ ...contratoResponse, estado: 'DESCONOCIDO' });
  });

  it('registrarContrato posts the mapped request and returns the id', () => {
    service.registrarContrato(datosRegistro).subscribe(id => expect(id).toBe('cto-1'));

    const req = httpMock.expectOne('/api/v1/catalog/contratos');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.numero).toBe('CTO-2025-001');
    expect(req.request.body.items[0].codigoSena).toBeNull();
    req.flush({ id: 'cto-1' });
  });

  it('importarContrato hits /importar and returns the upsert counts', () => {
    const importResponse: ImportacionContratoResponse = {
      contratoId: 'cto-1',
      productosCreados: 2,
      productosActualizados: 3,
    };

    service.importarContrato(datosRegistro).subscribe(res => {
      expect(res.productosCreados).toBe(2);
      expect(res.productosActualizados).toBe(3);
    });

    const req = httpMock.expectOne('/api/v1/catalog/contratos/importar');
    expect(req.request.method).toBe('POST');
    req.flush(importResponse);
  });

  it('consultarPrecioVigente sends both query params and maps the response', () => {
    const precio: PrecioVigenteResponse = {
      codigoSena: '283415',
      refArticulo: '1',
      descripcion: 'Harina',
      numeroContrato: 'CTO-2025-001',
      vigencia: 2025,
      vrlAdjudicado: 5000,
      vrlAntes: 4202,
      ivaPorcentaje: 0.19,
      ivaValor: 798.38,
    };

    service.consultarPrecioVigente('283415', 2025).subscribe(res => {
      expect(res.vrlAdjudicado).toBe(5000);
      expect(res.numeroContrato).toBe('CTO-2025-001');
    });

    const req = httpMock.expectOne(r => r.url === '/api/v1/catalog/contratos/precio');
    expect(req.request.params.get('codigoSena')).toBe('283415');
    expect(req.request.params.get('vigencia')).toBe('2025');
    req.flush(precio);
  });

  it('cerrarContrato issues a PATCH to the cerrar endpoint', () => {
    service.cerrarContrato('cto-1').subscribe();

    const req = httpMock.expectOne('/api/v1/catalog/contratos/cto-1/cerrar');
    expect(req.request.method).toBe('PATCH');
    req.flush(null);
  });
});
