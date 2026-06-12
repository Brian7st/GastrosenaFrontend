import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ContratosFacade } from './contratos.facade';
import { ContratosService } from './services/contratos.service';
import { InventarioFacade } from './inventario.facade';
import { ContratoCabecera } from '../models/contrato.model';
import { CierreContratoResponse } from './api/catalog.api';

describe('ContratosFacade — importarExcel', () => {
  let facade: ContratosFacade;
  let serviceSpy: jest.Mocked<Pick<ContratosService, 'importarContratoExcel' | 'getContratos'>>;
  let inventarioFacadeSpy: jest.Mocked<Pick<InventarioFacade, 'cargarBienes' | 'cargarKpis'>>;

  const archivo = new File(['data'], 'contrato.xlsx');
  const cabecera: ContratoCabecera = { numero: 'CTO-001', vigencia: 2025 };
  const resultado = { contratoId: 'cto-1', productosCreados: 2, productosActualizados: 1 };

  beforeEach(() => {
    serviceSpy = {
      importarContratoExcel: jest.fn(),
      getContratos: jest.fn().mockReturnValue(of([])),
    };

    inventarioFacadeSpy = {
      cargarBienes: jest.fn(),
      cargarKpis: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        ContratosFacade,
        { provide: ContratosService, useValue: serviceSpy },
        { provide: InventarioFacade, useValue: inventarioFacadeSpy },
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

describe('ContratosFacade — cerrarContrato', () => {
  let facade: ContratosFacade;
  let serviceSpy: jest.Mocked<Pick<ContratosService, 'cerrarContrato' | 'getContratos'>>;
  let inventarioFacadeSpy: jest.Mocked<Pick<InventarioFacade, 'cargarBienes' | 'cargarKpis'>>;

  const cierreResponse: CierreContratoResponse = { contratoId: 'cto-1', bienesDesactivados: 3 };

  beforeEach(() => {
    serviceSpy = {
      cerrarContrato: jest.fn(),
      getContratos: jest.fn().mockReturnValue(of([])),
    };

    inventarioFacadeSpy = {
      cargarBienes: jest.fn(),
      cargarKpis: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        ContratosFacade,
        { provide: ContratosService, useValue: serviceSpy },
        { provide: InventarioFacade, useValue: inventarioFacadeSpy },
      ],
    });

    facade = TestBed.inject(ContratosFacade);
  });

  it('sets ultimoCierre signal with the response', () => {
    serviceSpy.cerrarContrato.mockReturnValue(of(cierreResponse));

    facade.cerrarContrato('cto-1');

    expect(facade.ultimoCierre()).toEqual(cierreResponse);
  });

  it('reloads contracts after successful close', () => {
    serviceSpy.cerrarContrato.mockReturnValue(of(cierreResponse));

    facade.cerrarContrato('cto-1');

    expect(serviceSpy.getContratos).toHaveBeenCalled();
  });

  it('triggers InventarioFacade.cargarBienes after successful close', () => {
    serviceSpy.cerrarContrato.mockReturnValue(of(cierreResponse));

    facade.cerrarContrato('cto-1');

    expect(inventarioFacadeSpy.cargarBienes).toHaveBeenCalled();
  });

  it('triggers InventarioFacade.cargarKpis after successful close', () => {
    serviceSpy.cerrarContrato.mockReturnValue(of(cierreResponse));

    facade.cerrarContrato('cto-1');

    expect(inventarioFacadeSpy.cargarKpis).toHaveBeenCalled();
  });

  it('sets error signal and does NOT refresh on HTTP error', () => {
    serviceSpy.cerrarContrato.mockReturnValue(throwError(() => new Error('Server error')));

    facade.cerrarContrato('cto-1');

    expect(facade.error()).toBeTruthy();
    expect(inventarioFacadeSpy.cargarBienes).not.toHaveBeenCalled();
    expect(facade.ultimoCierre()).toBeNull();
  });

  it('sets loading to false after success', () => {
    serviceSpy.cerrarContrato.mockReturnValue(of(cierreResponse));

    facade.cerrarContrato('cto-1');

    expect(facade.loading()).toBe(false);
  });

  it('sets loading to false after error', () => {
    serviceSpy.cerrarContrato.mockReturnValue(throwError(() => new Error('fail')));

    facade.cerrarContrato('cto-1');

    expect(facade.loading()).toBe(false);
  });
});
