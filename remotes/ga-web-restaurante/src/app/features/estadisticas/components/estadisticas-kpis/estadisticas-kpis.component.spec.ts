import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticasKpisComponent } from './estadisticas-kpis.component';

describe('EstadisticasKpisComponent', () => {
  let component: EstadisticasKpisComponent;
  let fixture: ComponentFixture<EstadisticasKpisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadisticasKpisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadisticasKpisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
