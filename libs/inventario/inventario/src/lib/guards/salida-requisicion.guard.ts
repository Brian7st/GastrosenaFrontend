import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RequisicionesFacade } from '../data-access/requisiciones.facade';

/**
 * Guard de ruta (UX) para la pantalla de salida de inventario.
 *
 * Si el store ya tiene datos cargados y ninguna requisición está en estado DESPACHADA,
 * redirige al usuario a la bandeja de requisiciones para que seleccione una válida.
 * Si el store está cargando o ya existe al menos una DESPACHADA, deja pasar.
 *
 * Este guard NO es un control de seguridad: la validación real (B-04) la aplica
 * el backend en RegistrarSalidaStockUseCase.
 */
export const salidaRequiereRequisicionGuard: CanActivateFn = () => {
  const facade = inject(RequisicionesFacade);
  const router = inject(Router);

  // Disparar carga proactiva de requisiciones en estado DESPACHADA
  facade.cargarPorEstado('DESPACHADA');

  const despachadas = facade.requisiciones().filter(r => r.estado === 'DESPACHADA');

  // Si ya terminó de cargar y no hay ninguna DESPACHADA → redirigir con feedback de UX
  if (!facade.loading() && despachadas.length === 0) {
    return router.createUrlTree(['/app/inventario/requisiciones']);
  }

  return true;
};
