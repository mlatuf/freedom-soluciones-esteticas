import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { RoutingModule } from '../routing.module';

import {
  MatButtonModule, MatCardModule, MatInputModule, MatToolbarModule, MatMenuModule, MatIconModule, MatSelectModule, MatDividerModule, MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS
} from '@angular/material';

import { ApplicationStateService } from './services/aplication-state/aplication-state.service';
import { PageTitleComponent } from './components/page-title/page-title.component';
import { AlertsComponent } from './components/alerts/alerts.component';
import { MenuComponent } from './components/menu/menu.component';
import { LoginComponent } from './components/login/login/login.component';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';


@NgModule({
  declarations: [
    PageTitleComponent,
    AlertsComponent,
    MenuComponent,
    LoginComponent
  ],
  exports: [
    PageTitleComponent,
    AlertsComponent,
    MenuComponent
  ],
  imports: [
    CommonModule,
    ClarityModule,
    RoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule, 
    MatCardModule,
    MatInputModule,
    MatMenuModule,
    MatIconModule,
    MatSnackBarModule,
    MatSelectModule,
    MatDividerModule
  ],
  providers: [ApplicationStateService, AngularFireAuthGuard,{provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}}]
})
export class CoreModule { }
