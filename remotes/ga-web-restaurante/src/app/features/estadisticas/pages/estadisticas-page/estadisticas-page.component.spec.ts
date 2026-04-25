import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticasPageComponent } from './estadisticas-page.component';

describe('EstadisticasPageComponent', () => {
  let component: EstadisticasPageComponent;
  let fixture: ComponentFixture<EstadisticasPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadisticasPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadisticasPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
