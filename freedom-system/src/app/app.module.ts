import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';

import {
  MatButtonModule, MatCardModule, MatDialogModule, MatInputModule, MatTableModule,
  MatToolbarModule, MatMenuModule,MatIconModule, MatProgressSpinnerModule
} from '@angular/material';

import { environment } from '../environments/environment';

import { ClarityModule } from '@clr/angular';
import { NgxSpinnerModule } from 'ngx-spinner';

import { CoreModule } from './core/core.module';
import { AreasModule } from './areas/areas.module';
import { CalendarModule } from './calendar/calendar.module';
import { PatientsModule } from './patients/patients.module';
import { AppointmentsModule } from './appointments/appointments.module';

import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { ModalComponent } from './core/components/modal/modal.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ClarityModule,
    NgxSpinnerModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    MatToolbarModule,
    MatButtonModule, 
    MatCardModule,
    MatInputModule,
    MatDialogModule,
    MatTableModule,
    MatMenuModule,
    MatIconModule,
    MatProgressSpinnerModule,
    CoreModule,
    AreasModule,
    CalendarModule,
    PatientsModule,
    AppointmentsModule
  ],
  bootstrap: [AppComponent],
  providers: [AngularFireAuthGuard],
  entryComponents: [ModalComponent]
})
export class AppModule { }
