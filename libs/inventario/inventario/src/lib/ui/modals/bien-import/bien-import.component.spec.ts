import { TestBed } from '@angular/core/testing';
import { BienImportModalComponent } from './bien-import.component';

describe('BienImportModalComponent — F1 rename', () => {
  it('modal title is "Cargar datos internos"', async () => {
    await TestBed.configureTestingModule({
      imports: [BienImportModalComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(BienImportModalComponent);
    fixture.detectChanges();

    const h1 = fixture.nativeElement.querySelector('.import-title') as HTMLElement;
    expect(h1?.textContent?.trim()).toBe('Cargar datos internos');
  });

  it('process button label is "Cargar datos internos"', async () => {
    await TestBed.configureTestingModule({
      imports: [BienImportModalComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(BienImportModalComponent);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.btn-procesar') as HTMLElement;
    expect(button?.textContent?.trim()).not.toContain('Importar Bienes');
    expect(button?.textContent?.trim()).toContain('Cargar datos internos');
  });
});
