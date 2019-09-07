import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo, AngularFireAuthGuard} from '@angular/fire/auth-guard';

import { CalendarComponent } from './calendar/components/calendar.component';
import { LoginComponent } from './core/components/login/login/login.component';
import { AppointmentsComponent } from './appointments/components/appointments.component';
import { AppointmentDetailsComponent } from './appointments/components/appointment-details/appointment-details.component';
import { PatientsComponent } from './patients/components/patients.component';
import { PatientDetailsComponent } from './patients/components/patient-details/patient-details.component';
import { AreasComponent } from './areas/components/areas.component';
import { RouterModule, Routes } from '@angular/router';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToCalendar = () => redirectLoggedInTo(['calendar']);

const routes: Routes = [
  { path: '', redirectTo:'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent, canActivate: [AngularFireAuthGuard], data: { title: 'Ingresar a Freedom System', authGuardPipe: redirectLoggedInToCalendar }},
  
  { path: 'calendar', component: CalendarComponent, canActivate: [AngularFireAuthGuard], data: { title: 'Calendario', authGuardPipe: redirectUnauthorizedToLogin }},
  
  { path: 'appointments/:day', component: AppointmentsComponent, canActivate: [AngularFireAuthGuard], data: { title: 'Turnos', authGuardPipe: redirectUnauthorizedToLogin  }},
  { path: 'appointment/details/:day', component: AppointmentDetailsComponent, canActivate: [AngularFireAuthGuard], data: { title: 'Nuevo turno', authGuardPipe: redirectUnauthorizedToLogin }},
  { path: 'appointment/details/:day/:id', component: AppointmentDetailsComponent, canActivate: [AngularFireAuthGuard], data: { title: 'Detalles del turno',authGuardPipe: redirectUnauthorizedToLogin }},
  
  { path: 'patients', component: PatientsComponent, canActivate: [AngularFireAuthGuard],data: { title: 'Pacientes', authGuardPipe: redirectUnauthorizedToLogin }},
  { path: 'patient/details', component: PatientDetailsComponent, canActivate: [AngularFireAuthGuard],data: { title: 'Nuevo paciente', authGuardPipe: redirectUnauthorizedToLogin }},
  { path: 'patient/details/:id', component: PatientDetailsComponent, canActivate: [AngularFireAuthGuard],data: { title: 'Detalles del paciente', authGuardPipe: redirectUnauthorizedToLogin }},
  
  { path: 'areas', component: AreasComponent, canActivate: [AngularFireAuthGuard],data: { title: 'Zonas', authGuardPipe: redirectUnauthorizedToLogin }},
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class RoutingModule { }
