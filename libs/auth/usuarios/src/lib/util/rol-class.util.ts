export const ROL_CLASS_MAP: Record<string, string> = {
  ADMINISTRADOR:  'rol--administrador',
  CONTADORA:      'rol--contadora',
  INSTRUCTOR:     'rol--instructor',
  CHEF:           'rol--chef',
  MESERO:         'rol--mesero',
  BARTENDER:      'rol--bartender',
  AUXILIAR_COCINA:'rol--auxiliar',
  CAJERO:         'rol--cajero',
  APRENDIZ:       'rol--aprendiz',
};

export function getRolClass(rol: string): string {
  return ROL_CLASS_MAP[rol] ?? 'rol--default';
}
