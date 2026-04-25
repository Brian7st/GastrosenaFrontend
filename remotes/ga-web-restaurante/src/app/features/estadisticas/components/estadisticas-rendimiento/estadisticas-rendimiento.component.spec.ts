import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticasRendimientoComponent } from './estadisticas-rendimiento.component';

describe('EstadisticasRendimientoComponent', () => {
  let component: EstadisticasRendimientoComponent;
  let fixture: ComponentFixture<EstadisticasRendimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadisticasRendimientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadisticasRendimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
