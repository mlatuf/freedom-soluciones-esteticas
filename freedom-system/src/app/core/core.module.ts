import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule,ClrFormsNextModule } from '@clr/angular';
import { RoutingModule } from '../routing.module';

import { ApplicationStateService } from './services/aplication-state/aplication-state.service';
import { PageTitleComponent } from './components/page-title/page-title.component';
import { AlertsComponent } from './components/alerts/alerts.component';
import { MenuComponent } from './components/menu/menu.component';


@NgModule({
  declarations: [
    PageTitleComponent,
    AlertsComponent,
    MenuComponent
  ],
  exports: [
    PageTitleComponent,
    AlertsComponent,
    MenuComponent
  ],
  imports: [
    CommonModule,
    ClarityModule,
    ClrFormsNextModule,
    RoutingModule
  ],
  providers: [ApplicationStateService]
})
export class CoreModule { }
