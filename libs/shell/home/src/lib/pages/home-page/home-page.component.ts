import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeroBannerComponent }          from '../../ui/hero-banner/hero-banner.component';
import { GeneralInfoSectionComponent }  from '../../ui/general-info-section/general-info-section.component';
import { MenuPreviewComponent }         from '../../ui/menu-preview/menu-preview.component';
import { RecipesSectionComponent }      from '../../ui/recipes-section/recipes-section.component';
import { MainDishesSectionComponent }   from '../../ui/main-dishes-section/main-dishes-section.component';
import { DessertsSectionComponent }     from '../../ui/desserts-section/desserts-section.component';
import { GastronomySectionComponent }   from '../../ui/gastronomy-section/gastronomy-section.component';
import { BarSectionComponent }          from '../../ui/bar-section/bar-section.component';
import { BarismoSectionComponent }      from '../../ui/barismo-section/barismo-section.component';

import { ContactSectionComponent }      from '../../ui/contact-section/contact-section.component';
import { CommentsFormComponent }        from '../../ui/comments-form/comments-form.component';

@Component({
  selector: 'restaurant-home-page',
  standalone: true,
  imports: [
    HeroBannerComponent,
    GeneralInfoSectionComponent,
    MenuPreviewComponent,
    RecipesSectionComponent,
    MainDishesSectionComponent,
    DessertsSectionComponent,
    GastronomySectionComponent,
    BarSectionComponent,
    BarismoSectionComponent,
    ContactSectionComponent,
    CommentsFormComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {}
