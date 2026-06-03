export const ZONAS_HORARIAS = [
  'America/Bogota',
  'America/Mexico_City',
  'America/Argentina/Buenos_Aires',
  'America/Lima',
  'America/Santiago',
  'America/Caracas',
  'America/Panama',
  'America/La_Paz',
  'America/Guayaquil',
  'America/Managua',
  'America/Santo_Domingo',
  'America/Asuncion',
  'America/Havana',
  'America/Costa_Rica',
  'America/El_Salvador',
] as const;

export const MONEDAS = [
  { codigo: 'COP', nombre: 'Peso colombiano', simbolo: '$' },
  { codigo: 'MXN', nombre: 'Peso mexicano', simbolo: '$' },
  { codigo: 'ARS', nombre: 'Peso argentino', simbolo: '$' },
  { codigo: 'USD', nombre: 'Dólar estadounidense', simbolo: 'US$' },
  { codigo: 'EUR', nombre: 'Euro', simbolo: '€' },
] as const;

export const UNIDADES_MEDIDA = [
  'Unidad',
  'Kilogramo',
  'Gramo',
  'Litro',
  'Mililitro',
  'Libra',
  'Caja',
  'Paquete',
  'Botella',
  'Galón',
] as const;
