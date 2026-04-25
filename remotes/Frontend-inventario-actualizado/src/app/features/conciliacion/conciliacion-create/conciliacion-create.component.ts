import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideIconComponent } from '../../../shared/components/lucide-icon.component';

@Component({
    selector: 'app-conciliacion-create',
    imports: [CommonModule, RouterModule, LucideIconComponent],
    templateUrl: './conciliacion-create.component.html',
    styleUrls: ['./conciliacion-create.component.scss']
})
export class ConciliacionCreateComponent {
  
}
