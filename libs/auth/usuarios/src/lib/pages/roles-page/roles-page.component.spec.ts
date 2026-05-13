import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RolesPageComponentComponent } from './roles-page.component';

describe('RolesPageComponentComponent', () => {
  let component: RolesPageComponentComponent;
  let fixture: ComponentFixture<RolesPageComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolesPageComponentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RolesPageComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
