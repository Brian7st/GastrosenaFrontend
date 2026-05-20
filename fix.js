const fs = require('fs');
const filepath = 'libs/inventario/inventario/src/lib/pages/presupuesto-page/presupuesto-dashboard/presupuesto-dashboard.component.html';
let content = fs.readFileSync(filepath, 'utf8');

// Replace formatCompact(X) with X | formatoMoneda
content = content.replace(/formatCompact\(([^)]+)\)/g, '$1 | formatoMoneda');

// We also have formatCompact(resumen()!.totalZese) which has an extra ). Wait, `resumen()!.totalZese` does NOT contain `)`.
// But `resumen().totalApropiacion` contains `)`.
// The regex `formatCompact\(([^)]+)\)` stops at the FIRST `)`.
// So `formatCompact(resumen().totalApropiacion)` is matched as `formatCompact(resumen()` !
// We need to match everything inside formatCompact(...)
// Instead of a regex that is greedy or non-greedy, it's safer to just do simple string replacements.

content = content.replace("formatCompact(resumen().totalApropiacion)", "resumen().totalApropiacion | formatoMoneda");
content = content.replace("formatCompact(resumen().totalComprometido)", "resumen().totalComprometido | formatoMoneda");
content = content.replace("formatCompact(resumen().totalPagado)", "resumen().totalPagado | formatoMoneda");
content = content.replace("formatCompact(resumen().totalDisponible)", "resumen().totalDisponible | formatoMoneda");
content = content.replace("formatCompact(resumen()!.totalZese)", "resumen()!.totalZese | formatoMoneda");

// Replace formatCurrency
content = content.replace(/formatCurrency\(([^)]+\)[^)]*)\)/g, '$1 | formatoMoneda:false'); // This handles one nested set of parens.
// Wait, `formatCurrency(programa.totalApropiacion)` doesn't have parens inside.
// `formatCurrency(resumen().totalApropiacion)` has parens inside.
// Let's just use string replaces for all formatCurrency or a better regex.

content = content.replace(/formatCurrency\((.*?)\)/g, (match, p1) => {
    // If it's `resumen(`, it means we matched too little.
    return match;
});

// Let's just do a blanket regex for formatCurrency
content = content.replace(/formatCurrency\((resumen\(\)\.[a-zA-Z]+)\)/g, '$1 | formatoMoneda:false');
content = content.replace(/formatCurrency\((programa\.[a-zA-Z]+)\)/g, '$1 | formatoMoneda:false');
content = content.replace(/formatCurrency\((rubro\.[a-zA-Z]+)\)/g, '$1 | formatoMoneda:false');
content = content.replace(/formatCurrency\((a\.valor)\)/g, '$1 | formatoMoneda:false');
content = content.replace(/formatCurrency\((a\.saldoResultante)\)/g, '$1 | formatoMoneda:false');

// And replace getTipoBadgeStatus with getTipoConfig
content = content.replace('<restaurant-status-badge [status]="getTipoBadgeStatus(a.tipo)" [label]="a.tipo"></restaurant-status-badge>', 
    '<restaurant-status-badge [status]="getTipoConfig(a.tipo).status" [class]="getTipoConfig(a.tipo).cssClass" [label]="a.tipo"></restaurant-status-badge>');

fs.writeFileSync(filepath, content);
console.log("Done");
