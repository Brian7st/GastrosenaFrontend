import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaPageComponentComponent } from './lista-page.component';

describe('ListaPageComponentComponent', () => {
  let component: ListaPageComponentComponent;
  let fixture: ComponentFixture<ListaPageComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaPageComponentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaPageComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
