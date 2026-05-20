import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '@restaurant/shared/ui';
import { ComandaService } from '../../data-access/comanda.service';
import { ComandaBarYBarismo } from '../../models/comanda.model';

@Component({
    selector: 'app-comandas',
    standalone: true,
    imports: [CommonModule, FormsModule, PageHeaderComponent],
    templateUrl: './comandas-page.component.html',
    styleUrls: ['./comandas-page.component.scss']
})
export class ComandasComponent implements OnInit {
    // Inyección de servicios
    private service = inject(ComandaService);

    // Estado de datos
    listaComandas: ComandaBarYBarismo[] = [];

    // Estado de búsqueda
    terminoBusqueda: string = '';
    resultadoBusqueda: ComandaBarYBarismo | null = null;
    busquedaRealizada: boolean = false;

    // Estado del Modal
    modalAbierto: boolean = false;
    comandaDetalle: ComandaBarYBarismo | null = null;

    ngOnInit(): void {
        this.cargarDatos();
    }

    // --- MÉTODOS DE DATOS ---

    cargarDatos(): void {
        this.service.listarComandas().subscribe({
            next: (data) => this.listaComandas = data,
            error: (e) => console.error('Error de conexión:', e)
        });
    }

    comenzarPreparacion(idComanda: string): void {
        this.service.actualizarEstado(idComanda, 'PREPARANDO').subscribe({
            next: () => this.cargarDatos(),
            error: (e) => console.error('Error al actualizar a PREPARANDO:', e)
        });
    }

    marcarListo(idComanda: string): void {
        this.service.actualizarEstado(idComanda, 'TERMINADO').subscribe({
            next: () => {
                this.cargarDatos();
            },
            error: (e) => console.error('Error:', e)
        });
    }

    // --- MÉTODOS DE BÚSQUEDA ---

    buscarPorId(): void {
        if (!this.terminoBusqueda.trim()) return;
        this.busquedaRealizada = true;
        this.resultadoBusqueda = null;
        this.service.buscarPorId(this.terminoBusqueda.trim()).subscribe({
            next: (data) => this.resultadoBusqueda = data,
            error: () => this.resultadoBusqueda = null
        });
    }

    limpiarBusqueda(): void {
        this.terminoBusqueda = '';
        this.resultadoBusqueda = null;
        this.busquedaRealizada = false;
    }

    // --- CONTROL DEL MODAL (Corregido para evitar traslapes visuales) ---

    abrirDetalle(comanda: ComandaBarYBarismo): void {
        // Primero cerramos cualquier rastro previo para resetear el *ngIf en el HTML
        this.modalAbierto = false;
        this.comandaDetalle = null;

        // Pequeño delay para asegurar que el DOM se limpie antes de mostrar el nuevo contenido
        setTimeout(() => {
            this.comandaDetalle = { ...comanda }; // Clonamos para evitar mutaciones directas
            this.modalAbierto = true;
            document.body.style.overflow = 'hidden'; // Bloquea el scroll del fondo
        }, 10);
    }

    cerrarDetalle(): void {
        this.modalAbierto = false;
        // Limpiamos los datos después de que la animación de cierre (si existe) termine
        setTimeout(() => {
            this.comandaDetalle = null;
            document.body.style.overflow = ''; // Libera el scroll
        }, 200);
    }

    cerrarAlClickFondo(event: MouseEvent): void {
        if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
            this.cerrarDetalle();
        }
    }

    // --- GETTERS PARA FILTRADO DE COLUMNAS ---

    get comandasEspera(): ComandaBarYBarismo[] {
        return this.listaComandas.filter(c => c.estadoPreparacion === 'ESPERA');
    }

    get comandasPreparando(): ComandaBarYBarismo[] {
        return this.listaComandas.filter(c => c.estadoPreparacion === 'PREPARANDO');
    }

    get comandasListo(): ComandaBarYBarismo[] {
        return this.listaComandas.filter(c =>
            c.estadoPreparacion === 'TERMINADO' || c.estadoPreparacion === 'LISTO'
        );
    }

    // --- FORMATTERS Y LABELS ---

    formatHora(horaEntrada: string | undefined): string {
        if (!horaEntrada) return '--';
        // Extrae HH:mm del formato ISO
        return horaEntrada.substring(11, 16);
    }

    formatHoraCompleta(iso: string | undefined): string {
        if (!iso) return '--';
        return iso.substring(11, 19);
    }

    formatIdComanda(id: string): string {
        const num = parseInt(id, 10);
        if (!isNaN(num)) return `#B${String(num).padStart(3, '0')}`;
        return `#${id}`;
    }

    labelPrioridad(c: ComandaBarYBarismo): string {
        return c.prioridad ?? 'normal';
    }

    labelEstado(estado: string): string {
        const map: Record<string, string> = {
            'ESPERA': 'En Espera',
            'PREPARANDO': 'Preparando',
            'TERMINADO': 'Listo'
        };
        return map[estado] ?? estado;
    }
}