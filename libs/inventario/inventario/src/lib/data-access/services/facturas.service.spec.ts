import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { FacturasService } from './facturas.service';

describe('FacturasService — conciliarFacturaGil', () => {
  let service: FacturasService;
  let httpMock: HttpTestingController;

  const mockConciliacionResponse = {
    id: 'conc-1',
    facturaId: 'fac-1',
    gilId: 'gil-1',
    estado: 'CONCILIADO',
    diferenciasPendientes: 0,
    detalles: [],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FacturasService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(FacturasService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('omits cantidadesRecibidas from body when not provided', () => {
    service.conciliarFacturaGil('fac-1', 'gil-1').subscribe();

    const req = httpMock.expectOne('/api/v1/sourcing/conciliaciones-gil');
    expect(req.request.body).toEqual({ facturaId: 'fac-1', gilId: 'gil-1' });
    expect(req.request.body['cantidadesRecibidas']).toBeUndefined();
    req.flush(mockConciliacionResponse);
  });

  it('omits cantidadesRecibidas from body when map is empty', () => {
    service.conciliarFacturaGil('fac-1', 'gil-1', {}).subscribe();

    const req = httpMock.expectOne('/api/v1/sourcing/conciliaciones-gil');
    expect(req.request.body['cantidadesRecibidas']).toBeUndefined();
    req.flush(mockConciliacionResponse);
  });

  it('includes cantidadesRecibidas in body when populated', () => {
    const counts = { 'prod-A': 5, 'prod-B': 3 };
    service.conciliarFacturaGil('fac-1', 'gil-1', counts).subscribe();

    const req = httpMock.expectOne('/api/v1/sourcing/conciliaciones-gil');
    expect(req.request.body['cantidadesRecibidas']).toEqual(counts);
    req.flush(mockConciliacionResponse);
  });
});
