import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticasHistorialComponent } from './estadisticas-historial.component';

describe('EstadisticasHistorialComponent', () => {
  let component: EstadisticasHistorialComponent;
  let fixture: ComponentFixture<EstadisticasHistorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadisticasHistorialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadisticasHistorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
