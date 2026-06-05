import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { computed } from '@angular/core';
import { MovimientoAjusteComponent } from './movimiento-ajuste.component';
import { KardexFacade } from '../../../data-access/kardex.facade';
import { AjusteMovimientoData } from '../../../models/movimiento.model';
import { LucideIconComponent, ButtonComponent } from '@restaurant/shared/ui';

const mockFacade: Partial<KardexFacade> = {
  loading: computed(() => false),
  registrarAjuste: jest.fn(),
};

const mockRouter = { navigate: jest.fn() };

describe('MovimientoAjusteComponent', () => {
  let component: MovimientoAjusteComponent;
  let fixture: ComponentFixture<MovimientoAjusteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovimientoAjusteComponent, ReactiveFormsModule],
      providers: [
        { provide: KardexFacade, useValue: mockFacade },
        { provide: Router, useValue: mockRouter },
      ],
    })
    .overrideComponent(MovimientoAjusteComponent, {
      remove: { imports: [LucideIconComponent, ButtonComponent] },
      add:    { imports: [] },
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovimientoAjusteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form validation', () => {
    it('should be invalid when empty', () => {
      expect(component.ajusteForm.invalid).toBe(true);
    });

    it('should be invalid without productoId', () => {
      component.ajusteForm.patchValue({ cantidadNueva: 10, motivo: 'Conteo físico' });
      expect(component.ajusteForm.invalid).toBe(true);
    });

    it('should be invalid without motivo', () => {
      component.ajusteForm.patchValue({ productoId: 'uuid-123', cantidadNueva: 10 });
      expect(component.ajusteForm.invalid).toBe(true);
    });

    it('should be invalid when cantidadNueva is negative', () => {
      component.ajusteForm.patchValue({ productoId: 'uuid-123', cantidadNueva: -1, motivo: 'Merma' });
      expect(component.ajusteForm.get('cantidadNueva')?.invalid).toBe(true);
    });

    it('should be valid when all required fields are filled', () => {
      component.ajusteForm.patchValue({ productoId: 'uuid-123', cantidadNueva: 5, motivo: 'Ajuste por conteo' });
      expect(component.ajusteForm.valid).toBe(true);
    });

    it('should allow cantidadNueva of 0 (full depletion)', () => {
      component.ajusteForm.patchValue({ productoId: 'uuid-123', cantidadNueva: 0, motivo: 'Merma total' });
      expect(component.ajusteForm.valid).toBe(true);
    });
  });

  describe('onSubmit', () => {
    it('should not call facade when form is invalid', () => {
      (mockFacade.registrarAjuste as jest.Mock).mockClear();
      component.onSubmit();
      expect(mockFacade.registrarAjuste).not.toHaveBeenCalled();
    });

    it('should call facade.registrarAjuste with correct shape', () => {
      (mockFacade.registrarAjuste as jest.Mock).mockClear();
      component.ajusteForm.patchValue({
        productoId:    'prod-uuid-456',
        cantidadNueva: 20,
        motivo:        'Devolución cliente',
        autorizado:    true,
      });

      component.onSubmit();

      const expected: AjusteMovimientoData = {
        producto:      'prod-uuid-456',
        cantidadNueva: 20,
        motivo:        'Devolución cliente',
        autorizado:    true,
        referenciaId:  null,
      };
      expect(mockFacade.registrarAjuste).toHaveBeenCalledWith(expected);
    });

    it('should show success message after submit', () => {
      component.ajusteForm.patchValue({ productoId: 'uuid', cantidadNueva: 5, motivo: 'Test' });
      component.onSubmit();
      expect(component.successMessage()).toBe('Ajuste registrado correctamente.');
    });

    it('should reset form with autorizado=true after submit', () => {
      component.ajusteForm.patchValue({ productoId: 'uuid', cantidadNueva: 5, motivo: 'Test', autorizado: false });
      component.onSubmit();
      expect(component.ajusteForm.get('productoId')?.value).toBeNull();
      expect(component.ajusteForm.get('autorizado')?.value).toBe(true);
    });
  });

  describe('closeModal', () => {
    it('should navigate to movimientos list', () => {
      (mockRouter.navigate as jest.Mock).mockClear();
      component.closeModal();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/app/inventario/movimientos']);
    });
  });
});
