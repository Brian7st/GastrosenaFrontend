import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComandasResumenComponent } from './comandas-resumen.component';

describe('ComandasResumenComponent', () => {
  let component: ComandasResumenComponent;
  let fixture: ComponentFixture<ComandasResumenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComandasResumenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComandasResumenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
