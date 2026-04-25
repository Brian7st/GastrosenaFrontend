import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideIconComponent } from '../../shared/components/lucide-icon.component';
import { FormsModule } from '@angular/forms';
import { InventarioService } from '../../infrastructure/services/inventario.service';

@Component({
    selector: 'app-alertas-stock',
    imports: [CommonModule, LucideIconComponent, FormsModule],
    templateUrl: './alertas-stock.component.html',
    styleUrls: ['./alertas-stock.component.scss']
})
export class AlertasStockComponent implements OnInit {
  private inventarioService = inject(InventarioService);
  public getters = this.inventarioService.getters;
  
  // Filters
  searchTerm = signal('');
  filtroPrioridad = signal('Prioridad');
  filtroEstado = signal('Estado');

  // Computed properties
  alertasFiltradas = computed(() => {
    let alertas = this.getters.alertasStock();
    const term = this.searchTerm().toLowerCase();
    
    if (term) {
      alertas = alertas.filter(a => a.bien.toLowerCase().includes(term) || a.codigoInterno.toLowerCase().includes(term));
    }
    
    if (this.filtroPrioridad() !== 'Prioridad') {
      alertas = alertas.filter(a => a.prioridad === this.filtroPrioridad());
    }
    
    if (this.filtroEstado() !== 'Estado') {
      alertas = alertas.filter(a => a.estado === this.filtroEstado());
    }
    
    return alertas;
  });

  alertasActivas = computed(() => this.getters.alertasStock().filter(a => a.estado === 'Activa'));
  alertasCriticas = computed(() => this.alertasActivas().filter(a => a.prioridad === 'Crítica'));
  alertasResueltas = computed(() => this.getters.alertasStock().filter(a => a.estado === 'Resuelta'));
  
  valorTotalEnRiesgo = computed(() => this.alertasActivas().reduce((acc, curr) => acc + curr.valorEnRiesgo, 0));
  tiempoPromedio = computed(() => {
    const activas = this.alertasActivas();
    if (activas.length === 0) return 0;
    return 2.4; 
  });

  mostrarHistorial = signal(false);

  ngOnInit(): void {}

  formatCurrency(value: number): string {
    return '$' + value.toLocaleString('es-CO');
  }

  toggleHistorial() {
    this.mostrarHistorial.update(v => !v);
  }

  resolverAlerta(id: number) {
    this.inventarioService.resolverAlerta(id, 'Resolución rápida desde panel');
  }
}
