import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticasExportarComponent } from './estadisticas-exportar.component';

describe('EstadisticasExportarComponent', () => {
  let component: EstadisticasExportarComponent;
  let fixture: ComponentFixture<EstadisticasExportarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadisticasExportarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadisticasExportarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
