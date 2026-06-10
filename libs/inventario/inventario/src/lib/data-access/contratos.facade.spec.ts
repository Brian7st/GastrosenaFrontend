import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ContratosFacade } from './contratos.facade';
import { ContratosService } from './services/contratos.service';
import { ContratoCabecera } from '../models/contrato.model';

describe('ContratosFacade — importarExcel', () => {
  let facade: ContratosFacade;
  let serviceSpy: jest.Mocked<Pick<ContratosService, 'importarContratoExcel' | 'getContratos'>>;

  const archivo = new File(['data'], 'contrato.xlsx');
  const cabecera: ContratoCabecera = { numero: 'CTO-001', vigencia: 2025 };
  const resultado = { contratoId: 'cto-1', productosCreados: 2, productosActualizados: 1 };

  beforeEach(() => {
    serviceSpy = {
      importarContratoExcel: jest.fn(),
      getContratos: jest.fn().mockReturnValue(of([])),
    };

    TestBed.configureTestingModule({
      providers: [
        ContratosFacade,
        { provide: ContratosService, useValue: serviceSpy },
      ],
    });

    facade = TestBed.inject(ContratosFacade);
  });

  it('delegates importarExcel to ContratosService.importarContratoExcel', () => {
    serviceSpy.importarContratoExcel.mockReturnValue(of(resultado));

    facade.importarExcel(archivo, cabecera);

    expect(serviceSpy.importarContratoExcel).toHaveBeenCalledWith(archivo, cabecera);
  });

  it('sets ultimaImportacion signal with the result', () => {
    serviceSpy.importarContratoExcel.mockReturnValue(of(resultado));
    serviceSpy.getContratos.mockReturnValue(of([]));

    facade.importarExcel(archivo, cabecera);

    expect(facade.ultimaImportacion()).toEqual(resultado);
  });

  it('sets loading to false after completion', () => {
    serviceSpy.importarContratoExcel.mockReturnValue(of(resultado));
    serviceSpy.getContratos.mockReturnValue(of([]));

    facade.importarExcel(archivo, cabecera);

    expect(facade.loading()).toBe(false);
  });

  it('sets error signal on HTTP error', () => {
    serviceSpy.importarContratoExcel.mockReturnValue(
      throwError(() => new Error('Network error')),
    );

    facade.importarExcel(archivo, cabecera);

    expect(facade.error()).toBeTruthy();
    expect(facade.loading()).toBe(false);
  });

  it('reloads contracts after successful import', () => {
    serviceSpy.importarContratoExcel.mockReturnValue(of(resultado));
    serviceSpy.getContratos.mockReturnValue(of([]));

    facade.importarExcel(archivo, cabecera);

    expect(serviceSpy.getContratos).toHaveBeenCalled();
  });
});
