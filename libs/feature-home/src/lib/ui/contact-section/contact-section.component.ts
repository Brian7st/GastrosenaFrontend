import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { HomeService }  from '../../data-access/home.service';
import { ContactInfo }  from '../../models/home.models';

@Component({
  selector: 'restaurant-contact-section',
  standalone: true,
  imports: [],
  templateUrl: './contact-section.component.html',
  styleUrl: './contact-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactSectionComponent implements OnInit {
  private homeService = inject(HomeService);
  contactInfo = signal<ContactInfo | null>(null);

  ngOnInit(): void {
    this.homeService.getContactInfo().subscribe(info => this.contactInfo.set(info));
  }
}
