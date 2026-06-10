import { TestBed } from '@angular/core/testing';
import { ContratoImportModalComponent, ContratoImportPayload } from './contrato-import.component';

/** Helper to create a File and trigger processFile via onFileSelected.
 *  jsdom does not implement File.prototype.text(), so we polyfill it.
 */
function selectFile(component: ContratoImportModalComponent, name: string, content = 'data'): void {
  const file = new File([content], name);
  // polyfill File.text for jsdom
  if (!file.text) {
    Object.defineProperty(file, 'text', {
      value: () => Promise.resolve(content),
    });
  } else {
    jest.spyOn(file, 'text').mockResolvedValue(content);
  }
  const event = { target: { files: [file] } } as unknown as Event;
  component.onFileSelected(event);
}

describe('ContratoImportModalComponent — extension detection (F4)', () => {
  let component: ContratoImportModalComponent;
  let emitted: ContratoImportPayload | undefined;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContratoImportModalComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(ContratoImportModalComponent);
    component = fixture.componentInstance;
    emitted = undefined;

    component.importar.subscribe((p: ContratoImportPayload) => { emitted = p; });

    // Set valid cabecera so importDeshabilitado doesn't block
    component.onNumero('CTO-001');
    component.onVigencia('2025');
    fixture.detectChanges();
  });

  it('xlsx file sets isExcel signal to true', async () => {
    selectFile(component, 'contrato.xlsx');
    await Promise.resolve(); // allow microtask for processFile
    expect(component.isExcel()).toBe(true);
  });

  it('xls file sets isExcel signal to true', async () => {
    selectFile(component, 'contrato.xls');
    await Promise.resolve();
    expect(component.isExcel()).toBe(true);
  });

  it('csv file sets isExcel signal to false', async () => {
    selectFile(component, 'contrato.csv', 'refArticulo;descripcion;vrlAdjudicado\n1;Harina;5000');
    await new Promise(r => setTimeout(r, 0));
    expect(component.isExcel()).toBe(false);
  });

  it('pdf file sets statusMessage error and does NOT set file', async () => {
    selectFile(component, 'doc.pdf');
    await Promise.resolve();
    expect(component.statusMessage()).toBeTruthy();
    // no-emit: calling onProcesar with invalid extension should not emit
  });

  it('onProcesar with xlsx emits payload tipo excel with File and cabecera', async () => {
    selectFile(component, 'contrato.xlsx');
    await Promise.resolve();

    component.onProcesar();

    expect(emitted).toBeDefined();
    expect(emitted?.tipo).toBe('excel');
    if (emitted?.tipo === 'excel') {
      expect(emitted.archivo.name).toBe('contrato.xlsx');
      expect(emitted.cabecera.numero).toBe('CTO-001');
      expect(emitted.cabecera.vigencia).toBe(2025);
    }
  });

  it('onProcesar with csv emits payload tipo csv', async () => {
    selectFile(component, 'contrato.csv', 'refArticulo;descripcion;vrlAdjudicado\n1;Harina;5000');
    await new Promise(r => setTimeout(r, 50));

    component.onProcesar();

    expect(emitted).toBeDefined();
    expect(emitted?.tipo).toBe('csv');
  });

  it('onProcesar with pdf does NOT emit', async () => {
    selectFile(component, 'doc.pdf');
    await Promise.resolve();

    component.onProcesar();

    expect(emitted).toBeUndefined();
  });
});
