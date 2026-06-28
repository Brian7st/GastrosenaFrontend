import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { PaqueteService } from './paquete.service';

describe('PaqueteService', () => {
  let service: PaqueteService;
  let httpMock: HttpTestingController;

  const ID = 'paq-1';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaqueteService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PaqueteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('revisarPaquete envía PATCH /revisar con el revisorId en el body', () => {
    let ok: boolean | undefined;
    service.revisarPaquete(ID, 'revisor-99').subscribe(r => (ok = r));

    const req = httpMock.expectOne(`/api/v1/legalization/paquetes/${ID}/revisar`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ revisorId: 'revisor-99' });
    req.flush(null);

    expect(ok).toBe(true);
  });

  it('revisarPaquete propaga el error del backend (422 estado inválido)', () => {
    let error: unknown;
    service.revisarPaquete(ID, 'revisor-99').subscribe({ error: e => (error = e) });

    httpMock
      .expectOne(`/api/v1/legalization/paquetes/${ID}/revisar`)
      .flush({ detail: 'estado inválido' }, { status: 422, statusText: 'Unprocessable Entity' });

    expect(error).toBeTruthy();
  });

  it('archivarPaquete envía PATCH /archivar', () => {
    service.archivarPaquete(ID).subscribe();

    const req = httpMock.expectOne(`/api/v1/legalization/paquetes/${ID}/archivar`);
    expect(req.request.method).toBe('PATCH');
    req.flush(null);
  });
});
