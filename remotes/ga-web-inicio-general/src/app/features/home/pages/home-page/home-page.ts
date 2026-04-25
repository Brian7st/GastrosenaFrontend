import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeroBannerComponent }         from '../../components/hero-banner/hero-banner';
import { GeneralInfoSectionComponent } from '../../components/general-info-section/general-info-section';
import { MenuPreviewComponent }        from '../../components/menu-preview/menu-preview';
import { RecipesSectionComponent }     from '../../components/recipes-section/recipes-section';
import { MainDishesSectionComponent }  from '../../components/main-dishes-section/main-dishes-section';
import { DessertsSectionComponent }    from '../../components/desserts-section/desserts-section';
import { GastronomySectionComponent }  from '../../components/gastronomy-section/gastronomy-section';
import { BarSectionComponent }         from '../../components/bar-section/bar-section';
import { BarismoSectionComponent }     from '../../components/barismo-section/barismo-section';
import { ContactSectionComponent }     from '../../components/contact-section/contact-section';
import { ChatbotWidgetComponent }      from '../../components/chatbot-widget/chatbot-widget';
import { CommentsFormComponent }       from '../../components/comments-form/comments-form';

@Component({
  selector: 'app-home-page',
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
    ChatbotWidgetComponent,
    CommentsFormComponent,
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {}
