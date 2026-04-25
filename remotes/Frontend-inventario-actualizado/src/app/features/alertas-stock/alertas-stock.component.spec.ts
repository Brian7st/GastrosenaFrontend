import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertasStockComponent } from './alertas-stock.component';

describe('AlertasStockComponent', () => {
  let component: AlertasStockComponent;
  let fixture: ComponentFixture<AlertasStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertasStockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertasStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
