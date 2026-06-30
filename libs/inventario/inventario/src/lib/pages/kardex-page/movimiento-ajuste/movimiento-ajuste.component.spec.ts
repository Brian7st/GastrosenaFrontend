import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { computed } from '@angular/core';
import { of, throwError } from 'rxjs';
import { MovimientoAjusteComponent } from './movimiento-ajuste.component';
import { KardexFacade } from '../../../data-access/kardex.facade';
import { BienesService } from '../../../data-access/services/bienes.service';
import { AjusteMovimientoData } from '../../../models/movimiento.model';
import { Bien } from '../../../models/inventario.model';
import { LucideIconComponent, ButtonComponent } from '@restaurant/shared/ui';

// ── Fixtures ──────────────────────────────────────────────────────────────────

const mockBien: Bien = {
  id: '1',
  codigoSena: 'SEN-001',
  codigoProveedor: 'PROV-001',
  descripcion: 'Aceite de girasol 1L',
  categoria: 'Abarrotes y Secos',
  unidadMedida: 'L',
  valor: 5000,
  valorNeto: 4000,
  iva: 19,
  estado: 'Activo',
  stockActual: 10,
  stockMinimo: 2,
  estadoStock: 'DISPONIBLE',
};

const mockFacade: Partial<KardexFacade> = {
  loading: computed(() => false),
  registrarAjuste: jest.fn(),
};

const mockRouter = { navigate: jest.fn() };

const mockBienesService: Partial<BienesService> = {
  getBienes: jest.fn().mockReturnValue(of({ bienes: [mockBien], paginacion: { totalElements: 1, totalPages: 1, page: 0, size: 10 } })),
};

// ── Setup ─────────────────────────────────────────────────────────────────────

describe('MovimientoAjusteComponent', () => {
  let component: MovimientoAjusteComponent;
  let fixture: ComponentFixture<MovimientoAjusteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovimientoAjusteComponent, ReactiveFormsModule],
      providers: [
        { provide: KardexFacade,   useValue: mockFacade },
        { provide: Router,         useValue: mockRouter },
        { provide: BienesService,  useValue: mockBienesService },
      ],
    })
    .overrideComponent(MovimientoAjusteComponent, {
      remove: { imports: [LucideIconComponent, ButtonComponent] },
      add:    { imports: [] },
    })
    .compileComponents();

    fixture   = TestBed.createComponent(MovimientoAjusteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ── Validación del formulario ────────────────────────────────────────────────

  describe('form validation', () => {
    it('should be invalid when empty', () => {
      expect(component.ajusteForm.invalid).toBe(true);
    });

    it('should be invalid without productoId', () => {
      component.ajusteForm.patchValue({ cantidadNueva: 10, motivo: 'Conteo físico' });
      expect(component.ajusteForm.invalid).toBe(true);
    });

    it('should be invalid without motivo', () => {
      component.ajusteForm.patchValue({ productoId: 'SEN-001', cantidadNueva: 10 });
      expect(component.ajusteForm.invalid).toBe(true);
    });

    it('should be invalid when cantidadNueva is negative', () => {
      component.ajusteForm.patchValue({ productoId: 'SEN-001', cantidadNueva: -1, motivo: 'Merma' });
      expect(component.ajusteForm.get('cantidadNueva')?.invalid).toBe(true);
    });

    it('should be valid when all required fields are filled', () => {
      component.ajusteForm.patchValue({ productoId: 'SEN-001', cantidadNueva: 5, motivo: 'Ajuste por conteo' });
      expect(component.ajusteForm.valid).toBe(true);
    });

    it('should allow cantidadNueva of 0 (full depletion)', () => {
      component.ajusteForm.patchValue({ productoId: 'SEN-001', cantidadNueva: 0, motivo: 'Merma total' });
      expect(component.ajusteForm.valid).toBe(true);
    });
  });

  // ── Selector de producto ─────────────────────────────────────────────────────

  describe('product selector', () => {
    it('should not search when query length < 2', fakeAsync(() => {
      (mockBienesService.getBienes as jest.Mock).mockClear();
      const event = { target: { value: 'a' } } as unknown as Event;
      component.onBusquedaChange(event);
      tick();
      expect(mockBienesService.getBienes).not.toHaveBeenCalled();
      expect(component.resultados()).toEqual([]);
    }));

    it('should call getBienes with busqueda when query >= 2 chars', fakeAsync(() => {
      (mockBienesService.getBienes as jest.Mock).mockClear();
      const event = { target: { value: 'ac' } } as unknown as Event;
      component.onBusquedaChange(event);
      tick();
      expect(mockBienesService.getBienes).toHaveBeenCalledWith(
        expect.objectContaining({ busqueda: 'ac', estado: 'Activo' })
      );
    }));

    it('should populate resultados after search', fakeAsync(() => {
      const event = { target: { value: 'aceite' } } as unknown as Event;
      component.onBusquedaChange(event);
      tick();
      expect(component.resultados()).toHaveLength(1);
      expect(component.resultados()[0].codigoSena).toBe('SEN-001');
    }));

    it('should set productoId to codigoSena on seleccionarProducto', () => {
      component.seleccionarProducto(mockBien);
      expect(component.ajusteForm.get('productoId')?.value).toBe('SEN-001');
      expect(component.productoSeleccionado()).toEqual(mockBien);
    });

    it('should clear productoId on limpiarProducto', () => {
      component.seleccionarProducto(mockBien);
      component.limpiarProducto();
      expect(component.ajusteForm.get('productoId')?.value).toBe('');
      expect(component.productoSeleccionado()).toBeNull();
    });

    it('should set resultados to [] on service error', fakeAsync(() => {
      (mockBienesService.getBienes as jest.Mock).mockReturnValueOnce(throwError(() => new Error('Network error')));
      const event = { target: { value: 'aceite' } } as unknown as Event;
      component.onBusquedaChange(event);
      tick();
      expect(component.resultados()).toEqual([]);
      expect(component.buscando()).toBe(false);
    }));

    it('should compute etiquetaProducto from selected bien', () => {
      component.seleccionarProducto(mockBien);
      expect(component.etiquetaProducto()).toBe('Aceite de girasol 1L — SEN-001');
    });
  });

  // ── onSubmit ─────────────────────────────────────────────────────────────────

  describe('onSubmit', () => {
    it('should not call facade when form is invalid', () => {
      (mockFacade.registrarAjuste as jest.Mock).mockClear();
      component.onSubmit();
      expect(mockFacade.registrarAjuste).not.toHaveBeenCalled();
    });

    it('should call facade.registrarAjuste with codigoSena as producto', () => {
      (mockFacade.registrarAjuste as jest.Mock).mockClear();
      component.seleccionarProducto(mockBien);
      component.ajusteForm.patchValue({
        cantidadNueva: 20,
        motivo:        'Devolución cliente',
        autorizado:    true,
      });

      component.onSubmit();

      const expected: AjusteMovimientoData = {
        producto:      'SEN-001',
        cantidadNueva: 20,
        motivo:        'Devolución cliente',
        autorizado:    true,
        referenciaId:  null,
      };
      expect(mockFacade.registrarAjuste).toHaveBeenCalledWith(expected);
    });

    it('should show success message after submit', () => {
      component.seleccionarProducto(mockBien);
      component.ajusteForm.patchValue({ cantidadNueva: 5, motivo: 'Test' });
      component.onSubmit();
      expect(component.successMessage()).toBe('Ajuste registrado correctamente.');
    });

    it('should reset form and clear product after submit', () => {
      component.seleccionarProducto(mockBien);
      component.ajusteForm.patchValue({ cantidadNueva: 5, motivo: 'Test', autorizado: false });
      component.onSubmit();
      expect(component.ajusteForm.get('productoId')?.value).toBeNull();
      expect(component.ajusteForm.get('autorizado')?.value).toBe(true);
      expect(component.productoSeleccionado()).toBeNull();
    });
  });

  // ── closeModal ────────────────────────────────────────────────────────────────

  describe('closeModal', () => {
    it('should navigate to movimientos list', () => {
      (mockRouter.navigate as jest.Mock).mockClear();
      component.closeModal();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/app/inventario/movimientos']);
    });
  });
});
