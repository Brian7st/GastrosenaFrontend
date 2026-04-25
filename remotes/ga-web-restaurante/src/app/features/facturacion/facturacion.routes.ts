import { Routes } from '@angular/router';
import { FacturacionComponent } from './facturacion.component';
import { NuevaFacturaComponent } from './nueva-factura/nueva-factura.component';
import { BuscarFacturaComponent } from './buscar-factura/buscar-factura.component';
import { RegistrarPagoComponent } from './registrar-pago/registrar-pago.component';

export const FACTURACION_ROUTES: Routes = [
  { path: '', component: FacturacionComponent }, // Ruta principal del módulo
  { path: 'nueva', component: NuevaFacturaComponent }, // Ruta para el formulario
  { path: 'buscar', component: BuscarFacturaComponent },
  { path: 'registrar-pago', component: RegistrarPagoComponent },
];