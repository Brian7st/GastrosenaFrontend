import { Component, OnInit, inject, Input, Output, EventEmitter, signal, ChangeDetectorRef } from "@angular/core";
import { FormArray, FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { CategoriaService } from "../../data-access/categoria.service";
import { RecetaService } from "../../data-access/receta.service";
import { IngredienteService } from "../../data-access/ingrediente.service";
import { Receta } from "../../models/receta.model";
import { LucideIconComponent, ButtonComponent, InputComponent, ConfirmDialogComponent } from "@restaurant/shared/ui";
import { soloLetrasValidator } from "../../validators/solo-letras.validator";

export function noDuplicatesValidator(fieldName: string): ValidatorFn {
  return (formArray: AbstractControl): ValidationErrors | null => {
    if (!(formArray instanceof FormArray)) return null;
    const values = formArray.controls
      .map(ctrl => ctrl.get(fieldName)?.value?.toString().toLowerCase().trim())
      .filter(v => !!v); // ignorar los vacíos
    const hasDuplicates = new Set(values).size !== values.length;
    return hasDuplicates ? { duplicate: true } : null;
  };
}

@Component({
  selector: 'restaurant-gestion-receta',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, LucideIconComponent, ButtonComponent, InputComponent, ConfirmDialogComponent],
  templateUrl: './gestion-receta.component.html',
  styleUrl: './gestion-receta.component.scss'
})
export class GestionRecetaComponent implements OnInit {
  @Input() receta: Receta | null = null;
  @Output() close = new EventEmitter<boolean>(); // true if saved, false if cancelled

  private fb = inject(FormBuilder);
  public catService = inject(CategoriaService);
  public ingService = inject(IngredienteService);
  private recetaService = inject(RecetaService);
  private cdr = inject(ChangeDetectorRef);

  isSaving = false;
  mostrarExitoModal = signal<boolean>(false);
  exitoModalTitulo = signal<string>('');
  exitoModalMensaje = signal<string>('');

  recipeForm = this.fb.group({
    idCategoria: ['', Validators.required],        
    nombreReceta: ['', [Validators.required, Validators.minLength(5), soloLetrasValidator()]], 
    tiempoPreparacion: [0, [Validators.required, Validators.min(1), Validators.max(720)]],   
    precioUnitario: [0, [Validators.required, Validators.min(0), Validators.max(1000000)]],    
    temperatura: ['', Validators.required],
    urlImagen: [''],
    ingredientes: this.fb.array([], [Validators.required, noDuplicatesValidator('nombreIngrediente')]),
    pasos: this.fb.array([], [Validators.required, noDuplicatesValidator('descripcionPaso')])
  });

  get ingredientesArr(){
    return this.recipeForm.controls["ingredientes"] as FormArray;
  }

  get pasosArr() {
    return this.recipeForm.controls["pasos"] as FormArray;
  }

  esCampoInvalido(campo: string): boolean {
    const control = this.recipeForm.get(campo);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  ngOnInit(){
    this.catService.listar();
    this.ingService.listarIngredientes();
    
    if (this.receta) {
      this.cargarDatosParaEdicion(this.receta);
    }
  }

  private cargarDatosParaEdicion(receta: Receta) {
    this.recipeForm.patchValue({
      idCategoria: receta.idCategoria || '',
      nombreReceta: receta.nombreReceta,
      tiempoPreparacion: receta.tiempoPreparacion,
      precioUnitario: receta.precioUnitario,
      temperatura: receta.temperatura,
      urlImagen: receta.urlImagen || ''
    });

    if (receta.ingredientes) {
      receta.ingredientes.forEach((ing: any) => {
        const group = this.fb.group({
          nombreIngrediente: [ing.nombreIngrediente || ing.nombre, [Validators.required, Validators.minLength(2), soloLetrasValidator()]],
          cantidadRequerida: [ing.cantidadRequerida, [Validators.required, Validators.min(0.1), Validators.max(10000)]],
          unidadMedida: [ing.unidadMedida, Validators.required]
        });
        this.ingredientesArr.push(group);
      });
    }

    if (receta.pasos) {
      receta.pasos.forEach((paso: any) => {
        const group = this.fb.group({
          orden: [paso.orden],
          descripcionPaso: [paso.descripcionPaso, [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
          notasAdicionales: [paso.notasAdicionales]
        });
        this.pasosArr.push(group);
      });
    }
  }

  agregarIngrediente() {
    if (this.ingredientesArr.hasError('duplicate')) {
      alert("Por favor corrige los ingredientes duplicados antes de agregar uno nuevo.");
      return;
    }
    const lastCtrl = this.ingredientesArr.controls[this.ingredientesArr.length - 1];
    if (lastCtrl && !lastCtrl.get('nombreIngrediente')?.value?.trim()) {
      alert("Debes completar el nombre del ingrediente actual antes de agregar otro.");
      return;
    }

    const nuevoIngrediente = this.fb.group({
      nombreIngrediente: ['', [Validators.required, Validators.minLength(2), soloLetrasValidator()]], 
      cantidadRequerida: [1, [Validators.required, Validators.min(0.1), Validators.max(10000)]],      
      unidadMedida: ['GR', Validators.required]                             
    });
    this.ingredientesArr.push(nuevoIngrediente);
  }

  removerIngrediente(index: number) {
    this.ingredientesArr.removeAt(index);
  }

  agregarPaso() {
    if (this.pasosArr.hasError('duplicate')) {
      alert("Por favor corrige los pasos repetidos antes de agregar uno nuevo.");
      return;
    }
    const lastCtrl = this.pasosArr.controls[this.pasosArr.length - 1];
    if (lastCtrl && !lastCtrl.get('descripcionPaso')?.value?.trim()) {
      alert("Debes completar la descripción del paso actual antes de agregar otro.");
      return;
    }

    const orden = this.pasosArr.length + 1;
    const group = this.fb.group({
      orden: [orden],
      descripcionPaso: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      notasAdicionales: ['']
    });
    this.pasosArr.push(group);
  }

  removerPaso(index: number) {
    this.pasosArr.removeAt(index);
    this.pasosArr.controls.forEach((control, i) => {
      control.get('orden')?.setValue(i + 1);
    });
  }

  cancelar() {
    this.close.emit(false);
  }

  guardar() {
    if (this.recipeForm.valid) {
      this.isSaving = true;
      
      const observable = this.receta?.idReceta 
        ? this.recetaService.actualizarRecetaCompleta(this.receta.idReceta, this.recipeForm.value)
        : this.recetaService.guardarRecetaCompleta(this.recipeForm.value);

      observable.subscribe({
        next: () => {
          this.exitoModalTitulo.set(this.receta ? 'Receta actualizada correctamente' : 'Receta guardada correctamente');
          this.exitoModalMensaje.set(this.receta ? 'Los cambios han sido guardados en el sistema.' : 'La nueva receta ha sido registrada en el sistema.');
          this.mostrarExitoModal.set(true);
        },
        error: (err) => {
          console.error('Error al guardar:', err);
          let errorMsg = 'Error al guardar. Verifica la conexión con el backend.';
          if (err.error) {
            if (typeof err.error === 'string') {
               errorMsg = err.error;
            } else if (err.error.mensaje) {
               errorMsg = err.error.mensaje;
            } else {
               errorMsg = JSON.stringify(err.error, null, 2);
            }
          }
          alert('Error del Servidor:\n' + errorMsg);
          this.isSaving = false;
        }
      });
    } else {
      this.recipeForm.markAllAsTouched();
    }
  }

  cerrarExitoModal() {
    this.mostrarExitoModal.set(false);
    this.close.emit(true);
  }

  removerImagen() {
    this.recipeForm.patchValue({ urlImagen: '' });
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round(height * (MAX_WIDTH / width));
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round(width * (MAX_HEIGHT / height));
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Comprimir como JPEG al 70% de calidad para evitar exceder el límite del paquete de MySQL
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);

          // Calcular el tamaño aproximado en base64
          const sizeInBytes = dataUrl.length * (3 / 4);
          const sizeInMB = sizeInBytes / (1024 * 1024);
          if (sizeInMB > 1) {
            alert('La imagen es demasiado pesada incluso después de comprimir. Por favor, elige una imagen con menor resolución o recórtala.');
            return;
          }

          this.recipeForm.patchValue({ urlImagen: dataUrl });
          this.cdr.markForCheck();
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
