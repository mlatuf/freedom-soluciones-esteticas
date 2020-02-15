import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { RoutingModule } from '../routing.module';

import {
  MatButtonModule, MatCardModule, MatInputModule, MatToolbarModule, MatMenuModule, MatIconModule, MatSelectModule, MatDividerModule, MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS, MatDialogModule
} from '@angular/material';

import { ApplicationStateService } from './services/aplication-state/aplication-state.service';
import { PageTitleComponent } from './components/page-title/page-title.component';
import { AlertsComponent } from './components/alerts/alerts.component';
import { MenuComponent } from './components/menu/menu.component';
import { LoginComponent } from './components/login/login/login.component';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { ModalComponent } from './components/modal/modal.component';
import { AreasDescriptionPipe } from './pipes/areas-description.pipe';


@NgModule({
  declarations: [
    PageTitleComponent,
    AlertsComponent,
    MenuComponent,
    LoginComponent,
    ModalComponent,
    AreasDescriptionPipe
  ],
  exports: [
    PageTitleComponent,
    AlertsComponent,
    MenuComponent,
    AreasDescriptionPipe
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
    MatDividerModule,
    MatDialogModule
  ],
  providers: [ApplicationStateService, AngularFireAuthGuard,{provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}}]
})
export class CoreModule { }
