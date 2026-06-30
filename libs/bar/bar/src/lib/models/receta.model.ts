export interface Categoria {
  idCategoria: string;
  nombreCategoria: string;
  activo?: boolean;
}

export interface Ingrediente {
  idIngrediente?: string;
  nombreIngrediente: string;
  cantidadRequerida?: number;
  unidadMedida?: string;
}

export interface Paso {
  orden: number;
  descripcionPaso: string;
  notasAdicionales?: string;
}

export interface Receta {
  idReceta: string;
  nombreReceta: string;
  idCategoria?: string;
  nombreCategoria: string;
  fechaCreacion?: string;
  temperatura: string;
  tiempoPreparacion: number;
  precioUnitario: number;
  urlImagen?: string;
  ingredientes: Ingrediente[];
  pasos?: Paso[];
}
