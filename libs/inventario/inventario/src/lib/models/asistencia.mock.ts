import { FichaResponseDTO, UsuarioResponseDTO } from '../data-access/api/legalization.api';

// ── Fichas Mock ────────────────────────────────────────────────────────────
export const MOCK_FICHAS: FichaResponseDTO[] = [
  {
    id: 'f1a2b3c4-0000-0000-0000-000000000001',
    numero: '2574832',
    programa: 'Técnico en Cocina',
    fechaInicio: '2025-02-03',
    fechaFin:    '2026-08-15',
    activa: true,
  },
  {
    id: 'f1a2b3c4-0000-0000-0000-000000000002',
    numero: '2574833',
    programa: 'Técnico en Panadería y Repostería',
    fechaInicio: '2025-02-03',
    fechaFin:    '2026-08-15',
    activa: true,
  },
  {
    id: 'f1a2b3c4-0000-0000-0000-000000000003',
    numero: '2574834',
    programa: 'Técnico en Servicios de Bar y Restaurante',
    fechaInicio: '2025-02-03',
    fechaFin:    '2026-08-15',
    activa: true,
  },
];

// ── Aprendices Mock ────────────────────────────────────────────────────────
// 32 aprendices: tope realista de una ficha SENA. Se generan a partir de la
// lista [documento, nombre, apellidos] para evitar repetir el objeto completo.
const APRENDICES_BASE: ReadonlyArray<readonly [string, string, string]> = [
  ['1012345678', 'Carlos', 'Rodríguez Peña'],
  ['1023456789', 'María', 'González Torres'],
  ['1034567890', 'Juan', 'Martínez López'],
  ['1045678901', 'Ana', 'Vargas Ruiz'],
  ['1056789012', 'Pedro', 'Sánchez Cruz'],
  ['1067890123', 'Lucía', 'Ramírez Flores'],
  ['1078901234', 'Andrés', 'Castro Moreno'],
  ['1089012345', 'Valentina', 'Herrera Díaz'],
  ['1090123456', 'Santiago', 'Jiménez Rojas'],
  ['1101234567', 'Camila', 'Gómez Mejía'],
  ['1112345678', 'Sebastián', 'Ortiz Cardona'],
  ['1123456789', 'Daniela', 'Núñez Salazar'],
  ['1134567890', 'Mateo', 'Restrepo Vélez'],
  ['1145678901', 'Isabella', 'Pardo Quintero'],
  ['1156789012', 'Nicolás', 'Acosta Ríos'],
  ['1167890123', 'Sofía', 'Mendoza Lara'],
  ['1178901234', 'Samuel', 'Guerrero Pinto'],
  ['1189012345', 'Mariana', 'Cárdenas Soto'],
  ['1190123456', 'David', 'Fuentes Navarro'],
  ['1201234567', 'Gabriela', 'Beltrán Ospina'],
  ['1212345678', 'Tomás', 'Aguilar Mora'],
  ['1223456789', 'Laura', 'Ríos Cabrera'],
  ['1234567890', 'Felipe', 'Suárez Bernal'],
  ['1245678901', 'Antonia', 'Molina Vega'],
  ['1256789012', 'Emilio', 'Pineda Gallego'],
  ['1267890123', 'Salomé', 'Cortés Arango'],
  ['1278901234', 'Martín', 'Vega Hidalgo'],
  ['1289012345', 'Manuela', 'Rincón Bravo'],
  ['1290123456', 'Joaquín', 'Lozano Pérez'],
  ['1301234567', 'Renata', 'Cano Espinoza'],
  ['1312345678', 'Simón', 'Duarte Maldonado'],
  ['1323456789', 'Antonella', 'Reyes Castaño'],
];

export const MOCK_APRENDICES: UsuarioResponseDTO[] = APRENDICES_BASE.map(
  ([documento, nombre, apellidos], i): UsuarioResponseDTO => ({
    idUsuario: `ap-${String(i + 1).padStart(3, '0')}`,
    documento,
    nombre,
    apellidos,
    email: `${nombre}.${apellidos.split(' ')[0]}@sena.edu.co`.toLowerCase(),
    telefono: `31${String(1000000 + i).padStart(8, '0')}`,
    estado: true,
    rol: 'APRENDIZ',
  })
);
