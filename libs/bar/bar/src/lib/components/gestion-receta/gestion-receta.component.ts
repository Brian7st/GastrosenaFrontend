import { Component, OnInit, inject, Input, Output, EventEmitter, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoriaService } from '../../data-access/categoria.service';
import { RecetaService } from '../../data-access/receta.service';
import { IngredienteService } from '../../data-access/ingrediente.service';
import { Receta, Ingrediente, Paso } from '../../models/receta.model';
import { LucideIconComponent, ButtonComponent, InputComponent, ConfirmDialogComponent } from '@restaurant/shared/ui';

@Component({
  selector: 'bar-gestion-receta',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, LucideIconComponent, ButtonComponent, InputComponent, ConfirmDialogComponent],
  templateUrl: './gestion-receta.component.html',
  styleUrl: './gestion-receta.component.scss'
})
export class GestionRecetaComponent implements OnInit {
  @Input() receta: Receta | null = null;
  @Output() closeManage = new EventEmitter<boolean>(); // true if saved, false if cancelled

  private fb = inject(FormBuilder);
  public catService = inject(CategoriaService);
  public ingService = inject(IngredienteService);
  private recetaService = inject(RecetaService);

  isSaving = false;
  mostrarExitoModal = signal<boolean>(false);
  exitoModalTitulo = signal<string>('');
  exitoModalMensaje = signal<string>('');

  recipeForm = this.fb.group({
    idCategoria: ['', Validators.required],        
    nombreReceta: ['', [Validators.required, Validators.minLength(3)]], 
    tiempoPreparacion: [1, [Validators.required, Validators.min(1), Validators.max(720)]],   
    precioUnitario: [0, [Validators.required, Validators.min(0), Validators.max(1000000)]],    
    temperatura: ['', Validators.required],
    urlImagen: [''],
    ingredientes: this.fb.array([], Validators.required),
    pasos: this.fb.array([], Validators.required)
  });

  get ingredientesArr(){
    return this.recipeForm.controls['ingredientes'] as FormArray;
  }

  get pasosArr() {
    return this.recipeForm.controls['pasos'] as FormArray;
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
      receta.ingredientes.forEach((ing: Ingrediente) => {
        const group = this.fb.group({
          nombreIngrediente: [ing.nombreIngrediente || (ing as unknown as Record<string, unknown>)['nombre'] as string, [Validators.required, Validators.minLength(2)]],
          cantidadRequerida: [ing.cantidadRequerida, [Validators.required, Validators.min(0.1), Validators.max(10000)]],
          unidadMedida: [ing.unidadMedida, Validators.required]
        });
        this.ingredientesArr.push(group);
      });
    }

    if (receta.pasos) {
      receta.pasos.forEach((paso: Paso) => {
        const group = this.fb.group({
          orden: [paso.orden],
          descripcionPaso: [paso.descripcionPaso, [Validators.required, Validators.minLength(3), Validators.maxLength(500)]],
          notesAdicionales: [paso.notasAdicionales || ''] // keep compatibility
        });
        this.pasosArr.push(group);
      });
    }
  }

  agregarIngrediente() {
    if (this.ingredientesArr.hasError('duplicate')) {
      alert('Por favor corrige los ingredientes duplicados antes de agregar uno nuevo.');
      return;
    }
    const lastCtrl = this.ingredientesArr.controls[this.ingredientesArr.length - 1];
    if (lastCtrl && !lastCtrl.get('nombreIngrediente')?.value?.trim()) {
      alert('Debes completar el nombre del ingrediente actual antes de agregar otro.');
      return;
    }

    const nuevoIngrediente = this.fb.group({
      nombreIngrediente: ['', [Validators.required, Validators.minLength(2)]], 
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
      alert('Por favor corrige los pasos repetidos antes de agregar uno nuevo.');
      return;
    }
    const lastCtrl = this.pasosArr.controls[this.pasosArr.length - 1];
    if (lastCtrl && !lastCtrl.get('descripcionPaso')?.value?.trim()) {
      alert('Debes completar la descripción del paso actual antes de agregar otro.');
      return;
    }

    const orden = this.pasosArr.length + 1;
    const group = this.fb.group({
      orden: [orden],
      descripcionPaso: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]],
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

  removerImagen() {
    this.recipeForm.patchValue({ urlImagen: '' });
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  cancelar() {
    this.closeManage.emit(false);
  }

  cerrarExitoModal() {
    this.mostrarExitoModal.set(false);
    this.closeManage.emit(true);
  }

  guardar() {
    if (this.recipeForm.valid) {
      this.isSaving = true;
      
      const formValue = this.recipeForm.value as unknown as Partial<Receta>;
      
      // Adapt notesAdicionales mapping
      if (formValue.pasos) {
        formValue.pasos = formValue.pasos.map((p: unknown) => {
          const step = p as Record<string, unknown>;
          return {
            orden: Number(step['orden']),
            descripcionPaso: String(step['descripcionPaso']),
            notasAdicionales: String(step['notesAdicionales'] || step['notasAdicionales'] || '')
          };
        });
      }

      // Mapear los ingredientes ingresados por texto a su ID correspondiente del backend
      if (formValue.ingredientes) {
        const ingredientsList = this.ingService.ingredientes();
        const ingredientesMapeados = [];

        for (const ing of formValue.ingredientes) {
          const match = ingredientsList.find(
            i => i.nombreIngrediente.toLowerCase().trim() === ing.nombreIngrediente?.toLowerCase().trim()
          );

          if (!match) {
            alert(`El ingrediente "${ing.nombreIngrediente}" no es válido o no está registrado en el sistema.`);
            this.isSaving = false;
            return;
          }

          ingredientesMapeados.push({
            ...ing,
            idIngrediente: match.idIngrediente
          });
        }
        formValue.ingredientes = ingredientesMapeados;
      }
      
      const observable = this.receta?.idReceta 
        ? this.recetaService.actualizarRecetaCompleta(this.receta.idReceta, formValue)
        : this.recetaService.guardarRecetaCompleta(formValue);

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

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Solo se permiten archivos de imagen');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const max = 800;
        let w = img.width;
        let h = img.height;
        if (w > max || h > max) {
          const ratio = Math.min(max / w, max / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, w, h);
        const compressed = canvas.toDataURL('image/jpeg', 0.7);
        const bytes = Math.round((compressed.length * 3) / 4);
        if (bytes > 1_000_000) {
          alert('La imagen sigue siendo muy grande después de comprimir. Selecciona una imagen más pequeña.');
          return;
        }
        this.recipeForm.patchValue({ urlImagen: compressed });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}
