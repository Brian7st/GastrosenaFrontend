import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticasTopMesasComponent } from './estadisticas-top-mesas.component';

describe('EstadisticasTopMesasComponent', () => {
  let component: EstadisticasTopMesasComponent;
  let fixture: ComponentFixture<EstadisticasTopMesasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadisticasTopMesasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadisticasTopMesasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
