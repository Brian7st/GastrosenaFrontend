import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { HomeService } from '../../services/home.service';
import { ContactInfo } from '../../models/home.models';

@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [],
  templateUrl: './contact-section.html',
  styleUrl: './contact-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactSectionComponent implements OnInit {
  private homeService = inject(HomeService);

  contactInfo = signal<ContactInfo | null>(null);

  ngOnInit(): void {
    this.homeService.getContactInfo().subscribe(info => this.contactInfo.set(info));
  }
}
