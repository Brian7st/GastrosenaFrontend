import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { ReportesService, ReporteCard, ReporteReciente, FiltroReporte } from '../../services/reportes.service';

@Component({
  selector: 'app-reportes-list',
  imports: [FormsModule, TitleCasePipe],
  templateUrl: './reportes-list.html',
  styleUrl: './reportes-list.scss'
})
export class ReportesList implements OnInit {

  reportes:  ReporteCard[]     = [];
  recientes: ReporteReciente[] = [];
  loading    = false;

  filtro: FiltroReporte = { tipo: '', periodicidad: '' };

  tiposReporte   = ['ventas', 'inventario', 'financiero', 'cocina', 'usuarios'];
  periodicidades = ['Mensual', 'Trimestral'];

  // Estado de interacción
  generandoFiltro    = false;
  alertaExito:         string | null = null;
  generandoTarjeta   = new Set<string>();
  descargandoPDF     = new Set<string>();
  descargandoReciente = new Set<string>();

  constructor(private svc: ReportesService) {}

  ngOnInit(): void {
    this.loading = true;
    this.svc.getReportes().subscribe({
      next: data => { this.reportes  = data; this.loading = false; },
      error: ()  => { this.loading = false; }
    });
    this.svc.getRecientes().subscribe({
      next: data => { this.recientes = data; }
    });
  }

  get reportesContadora(): ReporteCard[] {
    return this.reportesPorRol('CONTADORA');
  }

  get reportesAdministrador(): ReporteCard[] {
    return this.reportesPorRol('ADMINISTRADOR');
  }

  get reportesChef(): ReporteCard[] {
    return this.reportesPorRol('CHEF');
  }

  private reportesPorRol(rol: ReporteCard['rol']): ReporteCard[] {
    return this.reportes.filter(r => {
      const matchRol  = r.rol === rol;
      const matchTipo = !this.filtro.tipo || r.tipo === this.filtro.tipo;
      return matchRol && matchTipo;
    });
  }

  // ── Botón "Generar Reporte" del filtro superior ──
  aplicarFiltros(): void {
    if (this.generandoFiltro) return;
    this.generandoFiltro = true;

    setTimeout(() => {
      this.generandoFiltro = false;
      this.alertaExito = 'Reporte generado correctamente';

      const tipo      = this.filtro.tipo        || 'general';
      const periodo   = this.filtro.periodicidad || 'Mensual';
      const fechaHoy  = new Date().toISOString().split('T')[0];
      const etiqueta  = tipo.charAt(0).toUpperCase() + tipo.slice(1);

      const nuevo: ReporteReciente = {
        id:     Date.now().toString(),
        nombre: `Reporte ${etiqueta} – ${periodo} ${fechaHoy}`,
        fecha:  fechaHoy,
        estado: 'Completado',
        tipo
      };
      this.recientes = [nuevo, ...this.recientes];

      setTimeout(() => { this.alertaExito = null; }, 3000);
    }, 1500);
  }

  // ── Botón "Generar" de cada tarjeta ──
  generarReporte(reporte: ReporteCard): void {
    if (this.generandoTarjeta.has(reporte.id)) return;
    this.generandoTarjeta = new Set(this.generandoTarjeta).add(reporte.id);

    console.log('Generar reporte:', reporte.nombre, '| Filtro:', this.filtro);

    setTimeout(() => {
      const s = new Set(this.generandoTarjeta);
      s.delete(reporte.id);
      this.generandoTarjeta = s;

      const periodo  = this.filtro.periodicidad || 'Mensual';
      const fechaHoy = new Date().toISOString().split('T')[0];

      const nuevo: ReporteReciente = {
        id:     Date.now().toString(),
        nombre: `${reporte.nombre} – ${periodo} ${fechaHoy}`,
        fecha:  fechaHoy,
        estado: 'Completado',
        tipo:   reporte.tipo
      };
      this.recientes = [nuevo, ...this.recientes];
    }, 1500);
  }

  // ── Botón "PDF" de cada tarjeta ──
  descargarPDF(reporte: ReporteCard): void {
    if (this.descargandoPDF.has(reporte.id)) return;
    this.descargandoPDF = new Set(this.descargandoPDF).add(reporte.id);
    console.log('Descargar PDF:', reporte.nombre);

    setTimeout(() => {
      const s = new Set(this.descargandoPDF);
      s.delete(reporte.id);
      this.descargandoPDF = s;
    }, 1500);
  }

  // ── Botón "Descargar" de Reportes Recientes ──
  descargarReciente(reciente: ReporteReciente): void {
    if (this.descargandoReciente.has(reciente.id)) return;
    this.descargandoReciente = new Set(this.descargandoReciente).add(reciente.id);
    console.log('Descargar reciente:', reciente.nombre, reciente.fecha);

    setTimeout(() => {
      const s = new Set(this.descargandoReciente);
      s.delete(reciente.id);
      this.descargandoReciente = s;
    }, 1500);
  }
}
