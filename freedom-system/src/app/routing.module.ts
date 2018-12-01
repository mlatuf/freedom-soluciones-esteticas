import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarComponent } from './calendar/components/calendar.component';

import { AppointmentsComponent } from './appointments/components/appointments.component';
import { AppointmentDetailsComponent } from './appointments/components/appointment-details/appointment-details.component';

import { PatientsComponent } from './patients/components/patients.component';
import { PatientDetailsComponent } from './patients/components/patient-details/patient-details.component';

import { AreasComponent } from './areas/components/areas.component';

import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo:'calendar', pathMatch: 'full' },
  
  { path: 'calendar', component: CalendarComponent, data: { title: 'Calendario' } },
  
  { path: 'appointments/:day', component: AppointmentsComponent, data: { title: 'Turnos' } },
  { path: 'appointment/details/:day', component: AppointmentDetailsComponent, data: { title: 'Nuevo turno' } },
  { path: 'appointment/details/:day/:id', component: AppointmentDetailsComponent, data: { title: 'Detalles del turno' } },
  
  { path: 'patients', component: PatientsComponent, data: { title: 'Pacientes' }},
  { path: 'patient/details', component: PatientDetailsComponent, data: { title: 'Nuevo paciente' } },
  { path: 'patient/details/:id', component: PatientDetailsComponent, data: { title: 'Detalles del paciente' } },
  
  { path: 'areas', component: AreasComponent, data: { title: 'Zonas' } },
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
