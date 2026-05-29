import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComandaService, EstadisticasKpi, PromedioBebida } from '../../data-access/comanda.service';
import { ComandaBarYBarismo } from '../../models/comanda.model';
import { Chart, registerables, ChartConfiguration } from 'chart.js';
import {
  LucideIconComponent
} from '@restaurant/shared/ui';

@Component({
  selector: 'restaurant-bar-estadisticas-page',
  standalone: true,
  imports: [CommonModule, LucideIconComponent],
  templateUrl: './estadisticas-page.component.html',
  styleUrl: './estadisticas-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EstadisticasPageComponent implements OnInit, AfterViewInit, OnDestroy {
  private comandaService = inject(ComandaService);

  // ── KPIs ──────────────────────────────────────────────────────────────────
  kpis = signal<EstadisticasKpi | null>(null);
  promedioFormateado = signal('');

  // ── Charts ────────────────────────────────────────────────────────────────
  @ViewChild('graficoPromedios') graficoPromedios!: ElementRef<HTMLCanvasElement>;

  private chartPromedios: Chart | null = null;
  private promediosData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };

  // ── Helpers ───────────────────────────────────────────────────────────────
  private minutosAMMSS(mins: number): string {
    if (!mins || isNaN(mins)) return '00:00';
    const m = Math.floor(mins);
    const s = Math.round((mins - m) * 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    // ── 1. Promedios por bebida ────────────────────────────────────────────
    this.comandaService.getEstadisticasPromedios().subscribe({
      next: data => {
        let stats: PromedioBebida[] = [...(data || [])];

        if (stats.length === 0) {
          stats = [
            { nombreReceta: 'Capuchino Italiano',  promedioMinutos: 4.2 },
            { nombreReceta: 'Mojito Tradicional',  promedioMinutos: 5.8 },
            { nombreReceta: 'Limonada de Coco',    promedioMinutos: 3.5 },
            { nombreReceta: 'Café Espresso',        promedioMinutos: 2.1 },
            { nombreReceta: 'Cold Brew Latte',      promedioMinutos: 4.9 },
          ];
        }

        this.actualizarKpisPromedios(stats);
        this.promediosData = this.buildPromediosChartData(stats);
        this.renderChartPromedios();
      },
      error: () => {
        const stats: PromedioBebida[] = [
          { nombreReceta: 'Capuchino Italiano', promedioMinutos: 4.2 },
          { nombreReceta: 'Mojito Tradicional', promedioMinutos: 5.8 },
          { nombreReceta: 'Limonada de Coco',   promedioMinutos: 3.5 },
          { nombreReceta: 'Café Espresso',       promedioMinutos: 2.1 },
          { nombreReceta: 'Cold Brew Latte',     promedioMinutos: 4.9 },
        ];
        this.actualizarKpisPromedios(stats);
        this.promediosData = this.buildPromediosChartData(stats);
        this.renderChartPromedios();
      }
    });

    // ── 2. Comandas reales → Bebidas preparadas ────────────────────────────
    this.comandaService.listarComandas().subscribe({
      next: (comandas: ComandaBarYBarismo[]) => {
        const listos = comandas.filter(c => c.estadoPreparacion === 'LISTO').length;

        this.kpis.update(k => k
          ? { ...k, totalBebidasDespachadosHoy: listos }
          : { promedioDemoraGeneral: 0, bebidaMasRapida: '—', totalBebidasDespachadosHoy: listos }
        );
      },
      error: () => {
        // no-op
      }
    });
  }

  // ── Helpers internos ──────────────────────────────────────────────────────
  private actualizarKpisPromedios(stats: PromedioBebida[]) {
    const tiempos = stats.map(d => d.promedioMinutos);
    const promedioGeneral = Math.round(tiempos.reduce((a, b) => a + b, 0) / tiempos.length * 10) / 10;
    const minTiempo = Math.min(...tiempos);
    const bebidaMasRapida = stats.find(d => d.promedioMinutos === minTiempo)?.nombreReceta || '—';

    this.promedioFormateado.set(this.minutosAMMSS(promedioGeneral));
    const currentKpis = this.kpis();
    this.kpis.set({
      promedioDemoraGeneral: promedioGeneral,
      bebidaMasRapida,
      totalBebidasDespachadosHoy: currentKpis?.totalBebidasDespachadosHoy || 0
    });
  }

  private buildPromediosChartData(stats: PromedioBebida[]): ChartConfiguration<'bar'>['data'] {
    return {
      labels: stats.map(d => d.nombreReceta),
      datasets: [{
        label: 'Tiempo Promedio (min)',
        data: stats.map(d => Math.min(d.promedioMinutos, 60)),
        backgroundColor: '#39a900',
        borderRadius: 4,
        maxBarThickness: 32
      }]
    };
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngAfterViewInit(): void {
    this.renderChartPromedios();
  }

  ngOnDestroy(): void {
    if (this.chartPromedios) {
      this.chartPromedios.destroy();
    }
  }

  // ── Render charts ─────────────────────────────────────────────────────────
  private renderChartPromedios() {
    if (!this.graficoPromedios?.nativeElement || (this.promediosData.labels as unknown[])?.length === 0) return;

    if (this.chartPromedios) {
      this.chartPromedios.data = this.promediosData;
      this.chartPromedios.update();
    } else {
      const config: ChartConfiguration<'bar'> = {
        type: 'bar',
        data: this.promediosData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => `${ctx.parsed.y.toFixed(1)} min`
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 60,
              ticks: {
                stepSize: 10,
                callback: (val) => `${val} min`
              },
              grid: { color: 'rgba(0,0,0,0.05)' }
            },
            x: { grid: { display: false } }
          }
        }
      };
      this.chartPromedios = new Chart(this.graficoPromedios.nativeElement, config);
    }
  }
}
