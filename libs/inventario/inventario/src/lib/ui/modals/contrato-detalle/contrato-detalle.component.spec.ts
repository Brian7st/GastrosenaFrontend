import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContratoDetalleComponent } from './contrato-detalle.component';
import { Contrato } from '../../../models/contrato.model';

const CONTRATO_MOCK: Contrato = {
  id: 'c-001',
  numero: 'CTO-2025-01',
  descripcion: 'Contrato de prueba',
  vigencia: 2025,
  fechaInicio: '2025-01-01',
  fechaFin: '2025-12-31',
  estado: 'VIGENTE',
  items: [
    {
      refArticulo: 'REF-001',
      codigoSena: null,
      descripcion: 'Harina de trigo',
      unidadMedida: 'Kg',
      cantidad: 100,
      codigoProveedor: 'PROV-01',
      valorEstimado: 5200,
      vrlAdjudicado: 5000,
      vrlAntes: 4800,
      ivaPorcentaje: 0.19,
      ivaValor: 912,
    },
  ],
};

describe('ContratoDetalleComponent', () => {
  let component: ContratoDetalleComponent;
  let fixture: ComponentFixture<ContratoDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContratoDetalleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContratoDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates successfully', () => {
    expect(component).toBeTruthy();
  });

  it('emits cerrar when close button is clicked', () => {
    component.contrato = CONTRATO_MOCK;
    fixture.detectChanges();

    let emitted = false;
    component.cerrar.subscribe(() => { emitted = true; });

    const closeBtn = fixture.nativeElement.querySelector('.btn-close') as HTMLButtonElement;
    closeBtn.click();

    expect(emitted).toBe(true);
  });

  it('shows LoadingSkeletonComponent when loading=true and no contrato', () => {
    component.loading = true;
    component.contrato = undefined;
    fixture.detectChanges();

    const skeleton = fixture.nativeElement.querySelector('restaurant-loading-skeleton');
    expect(skeleton).toBeTruthy();
  });

  it('renders contrato numero and vigencia in the header', () => {
    component.contrato = CONTRATO_MOCK;
    fixture.detectChanges();

    const header = fixture.nativeElement.querySelector('.detalle-header') as HTMLElement;
    expect(header.textContent).toContain('CTO-2025-01');
    expect(header.textContent).toContain('2025');
  });

  it('renders item rows in the table', () => {
    component.contrato = CONTRATO_MOCK;
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('.items-table tbody tr') as NodeList;
    expect(rows.length).toBe(1);
  });

  it('getEstadoBadgeClass returns badge--vigente for VIGENTE', () => {
    expect(component.getEstadoBadgeClass('VIGENTE')).toBe('badge--vigente');
  });

  it('getEstadoBadgeClass returns badge--cerrado for CERRADO', () => {
    expect(component.getEstadoBadgeClass('CERRADO')).toBe('badge--cerrado');
  });

  it('formatCurrency returns em dash for null', () => {
    expect(component.formatCurrency(null)).toBe('—');
  });

  it('formatPorcentaje returns formatted percent', () => {
    expect(component.formatPorcentaje(0.19)).toBe('19%');
  });
});
