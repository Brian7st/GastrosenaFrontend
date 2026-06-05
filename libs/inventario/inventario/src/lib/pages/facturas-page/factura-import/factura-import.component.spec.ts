import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { FacturaImportPageComponent } from './factura-import.component';
import { FacturasFacade } from '../../../data-access/facturas.facade';
import { Router } from '@angular/router';

describe('FacturaImportPageComponent — cantidadesRecibidas logic', () => {
  let component: FacturaImportPageComponent;

  const facadeMock = {
    facturaImportada: signal(null),
    gilesDisponibles: signal([]),
    conciliacionImportacion: signal(null),
    gilBienes: signal([]),
    loading: signal(false),
    error: signal(null),
    cargarGilesDisponibles: () => {},
    conciliarEnImportacion: () => {},
    limpiarImportacionFactura: () => {},
    cargarGilBienes: () => {},
    importarFacturaFelXml: () => {},
  };

  const routerMock = { navigate: () => {} };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FacturaImportPageComponent],
      providers: [
        { provide: FacturasFacade, useValue: facadeMock },
        { provide: Router, useValue: routerMock },
      ],
    });
    component = TestBed.createComponent(FacturaImportPageComponent).componentInstance;
  });

  describe('onCantidadRecibidaChange', () => {
    beforeEach(() => {
      // Seed two slots
      component['cantidadesRecibidas'].set([null, null]);
    });

    it('stores a valid positive number at the given index', () => {
      const event = { target: { value: '10' } } as unknown as Event;
      component.onCantidadRecibidaChange(0, event);
      expect(component['cantidadesRecibidas']()[0]).toBe(10);
    });

    it('stores null when input is empty string', () => {
      component['cantidadesRecibidas'].set([5, null]);
      const event = { target: { value: '' } } as unknown as Event;
      component.onCantidadRecibidaChange(0, event);
      expect(component['cantidadesRecibidas']()[0]).toBeNull();
    });

    it('stores null when input is negative (guard)', () => {
      const event = { target: { value: '-3' } } as unknown as Event;
      component.onCantidadRecibidaChange(0, event);
      expect(component['cantidadesRecibidas']()[0]).toBeNull();
    });

    it('stores null when input is NaN text', () => {
      const event = { target: { value: 'abc' } } as unknown as Event;
      component.onCantidadRecibidaChange(0, event);
      expect(component['cantidadesRecibidas']()[0]).toBeNull();
    });
  });

  describe('missingCounts computed', () => {
    it('returns true when any slot is null', () => {
      TestBed.runInInjectionContext(() => {
        // gilBienes has 2 items, counts has one null
        (facadeMock.gilBienes as ReturnType<typeof signal>).set([
          { productoId: 'A', codigoSena: '1', descripcion: 'X', unidadMedida: 'UN', cantidad: 1, valorUnitario: 1, subtotal: 1, iva: 0 },
          { productoId: 'B', codigoSena: '2', descripcion: 'Y', unidadMedida: 'UN', cantidad: 1, valorUnitario: 1, subtotal: 1, iva: 0 },
        ]);
        component['cantidadesRecibidas'].set([5, null]);
        expect(component.missingCounts()).toBe(true);
      });
    });

    it('returns false when all slots have values', () => {
      TestBed.runInInjectionContext(() => {
        (facadeMock.gilBienes as ReturnType<typeof signal>).set([
          { productoId: 'A', codigoSena: '1', descripcion: 'X', unidadMedida: 'UN', cantidad: 1, valorUnitario: 1, subtotal: 1, iva: 0 },
        ]);
        component['cantidadesRecibidas'].set([3]);
        expect(component.missingCounts()).toBe(false);
      });
    });
  });

  describe('onConciliar — map builder', () => {
    beforeEach(() => {
      (facadeMock.facturaImportada as ReturnType<typeof signal>).set({
        id: 'fac-1',
        numeroFactura: '001',
        cufe: 'cufe',
        proveedorNit: '123',
        proveedorNombre: 'Prov',
        fechaEmision: '2024-01-01',
        fechaRecepcion: '2024-01-01',
        estado: 'REGISTRADA' as const,
        lineas: [],
        subtotal: 0,
        totalIva: 0,
        total: 0,
      });
      component['gilId'].set('gil-1');
    });

    it('skips null counts (partial entry)', () => {
      (facadeMock.gilBienes as ReturnType<typeof signal>).set([
        { productoId: 'prod-A', codigoSena: '1', descripcion: 'A', unidadMedida: 'UN', cantidad: 5, valorUnitario: 10, subtotal: 50, iva: 0 },
        { productoId: 'prod-B', codigoSena: '2', descripcion: 'B', unidadMedida: 'UN', cantidad: 3, valorUnitario: 20, subtotal: 60, iva: 0 },
      ]);
      component['cantidadesRecibidas'].set([10, null]);

      const spy = jasmine.createSpy();
      facadeMock.conciliarEnImportacion = spy;

      component.onConciliar();

      expect(spy).toHaveBeenCalledWith('fac-1', 'gil-1', { 'prod-A': 10 });
    });

    it('skips rows with null productoId and sets a local warning', () => {
      (facadeMock.gilBienes as ReturnType<typeof signal>).set([
        { productoId: undefined, codigoSena: '1', descripcion: 'X', unidadMedida: 'UN', cantidad: 1, valorUnitario: 1, subtotal: 1, iva: 0 },
      ]);
      component['cantidadesRecibidas'].set([5]);

      const spy = jasmine.createSpy();
      facadeMock.conciliarEnImportacion = spy;

      component.onConciliar();

      // Row dropped → map empty {}
      expect(spy).toHaveBeenCalledWith('fac-1', 'gil-1', {});
      // Local warning set
      expect(component['localError']()).toContain('sin producto vinculado');
    });

    it('last-write-wins for duplicate productoId', () => {
      (facadeMock.gilBienes as ReturnType<typeof signal>).set([
        { productoId: 'prod-A', codigoSena: '1', descripcion: 'A', unidadMedida: 'UN', cantidad: 5, valorUnitario: 10, subtotal: 50, iva: 0 },
        { productoId: 'prod-A', codigoSena: '1', descripcion: 'A2', unidadMedida: 'UN', cantidad: 3, valorUnitario: 10, subtotal: 30, iva: 0 },
      ]);
      component['cantidadesRecibidas'].set([7, 99]);

      const spy = jasmine.createSpy();
      facadeMock.conciliarEnImportacion = spy;

      component.onConciliar();

      expect(spy).toHaveBeenCalledWith('fac-1', 'gil-1', { 'prod-A': 99 });
    });
  });
});
