export interface ConsolidadoResumen {
  id: string;
  codigo: string;        
  periodo: string;       
  tipo: string;         
  totalConsolidado: number;
  estado: 'Activo' | 'Archivado' | 'Bajo Stock';
}

export interface SubtotalDiscriminado {
  centroCosto: string;   
  descripcion: string;   
  categoria: string;     
  subtotal: number;
}

export interface FormatoGilIncluido {
  codigo: string;        
  solicitante: string;
  iniciales: string;
  fecha: string;
  valor: number;
}

export interface ConsolidadoDetalle {
  id: string;
  codigo: string;        
  estado: string;        
  totalConsolidado: number;
  vouchersIncluidos: number;
  fechaCierre: string;
  horaCierre: string;
  centroOperacion: string;
  sedeOpcion: string;
  subtotales: SubtotalDiscriminado[];
  formatos: FormatoGilIncluido[];
}

export const MOCK_CONSOLIDADOS: ConsolidadoResumen[] = [
  {
    id: '1',
    codigo: '#GIL-2023-12-01',
    periodo: 'Diciembre 2023',
    tipo: 'Cierre Anual',
    totalConsolidado: 45200000.00,
    estado: 'Activo'
  },
  {
    id: '2',
    codigo: '#GIL-2023-11-28',
    periodo: 'Noviembre 2023',
    tipo: 'Regular',
    totalConsolidado: 38150000.00,
    estado: 'Archivado'
  },
  {
    id: '3',
    codigo: '#GIL-2023-10-15',
    periodo: 'Octubre 2023',
    tipo: 'Regular',
    totalConsolidado: 29400000.00,
    estado: 'Bajo Stock'
  },
  {
    id: '4',
    codigo: '#GIL-2023-09-30',
    periodo: 'Septiembre 2023',
    tipo: 'Regular',
    totalConsolidado: 41200000.00,
    estado: 'Activo'
  }
];

export const MOCK_CONSOLIDADO_DETALLE: ConsolidadoDetalle = {
  id: '1',
  codigo: '#CON-2023-0842',
  estado: 'Contabilizado',
  totalConsolidado: 142500000,
  vouchersIncluidos: 28,
  fechaCierre: '24 Oct, 2023',
  horaCierre: '16:45 PM',
  centroOperacion: 'Bogotá D.C.',
  sedeOpcion: 'Sede Administrativa',
  subtotales: [
    {
      centroCosto: 'CC-001',
      descripcion: 'Mantenimiento y Planta',
      categoria: 'Suministros de Oficina',
      subtotal: 45230000
    },
    {
      centroCosto: 'CC-045',
      descripcion: 'Formación Técnica',
      categoria: 'Material Didáctico',
      subtotal: 82100500
    },
    {
      centroCosto: 'CC-012',
      descripcion: 'Gestión Humana',
      categoria: 'Elementos de Seguridad',
      subtotal: 15169500
    }
  ],
  formatos: [
    {
      codigo: 'GIL-2023-F014-001',
      solicitante: 'Ricardo Martínez',
      iniciales: 'RM',
      fecha: '12 Oct, 2023',
      valor: 12450000
    },
    {
      codigo: 'GIL-2023-F014-002',
      solicitante: 'Ana Lucia Gómez',
      iniciales: 'AL',
      fecha: '14 Oct, 2023',
      valor: 8900000
    },
    {
      codigo: 'GIL-2023-F014-003',
      solicitante: 'Julián Prada',
      iniciales: 'JP',
      fecha: '18 Oct, 2023',
      valor: 23750000
    },
    {
      codigo: 'GIL-2023-F014-004',
      solicitante: 'Sofía Cárdenas',
      iniciales: 'SC',
      fecha: '20 Oct, 2023',
      valor: 11200000
    }
  ]
};
