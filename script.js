const fs = require('fs');
const path = require('path');
const base = 'libs/inventario/inventario/src/lib/pages/presupuesto-page';
const files = [
  'presupuesto-cargar-gil/presupuesto-cargar-gil.component.ts',
  'presupuesto-dashboard/presupuesto-dashboard.component.ts',
  'presupuesto-exportar/presupuesto-exportar.component.ts',
  'presupuesto-registrar/presupuesto-registrar.component.ts',
  'presupuesto-traslado/presupuesto-traslado.component.ts'
];
files.forEach(file => {
  const filepath = path.join(base, file);
  let content = fs.readFileSync(filepath, 'utf8');
  content = content.replace(/selector:\s*'inventario-/g, "selector: 'restaurant-");
  content = content.replace(/styleUrls:\s*\[([^\]]+)\]/g, (match, p1) => {
    return 'styleUrl: ' + p1;
  });
  fs.writeFileSync(filepath, content);
  console.log('Updated ' + file);
});
