import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CuentasPageComponentComponent } from './cuentas-page.component';

describe('CuentasPageComponentComponent', () => {
  let component: CuentasPageComponentComponent;
  let fixture: ComponentFixture<CuentasPageComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuentasPageComponentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CuentasPageComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
