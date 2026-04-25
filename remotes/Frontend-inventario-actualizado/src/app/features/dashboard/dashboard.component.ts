import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideIconComponent } from '../../shared/components/lucide-icon.component';
import { InventarioService } from '../../infrastructure/services/inventario.service';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    imports: [CommonModule, LucideIconComponent, RouterModule],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private inventarioService = inject(InventarioService);
  // Getter signals from service
  public getters = this.inventarioService.getters;
  
  ngOnInit(): void {
    // Al cargar con backend, aquí iría el fetch de datos iniciales.
  }
}
