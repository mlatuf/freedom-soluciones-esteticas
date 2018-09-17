import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarComponent } from './pages/calendar/calendar.component';

import { AppointmentsComponent } from './pages/appointments/appointments.component';

import { PatientsComponent } from './pages/patients/patients.component';
import { PatientDetailsComponent } from './pages/patients/patient-details/patient-details.component';

import { AreasComponent } from './pages/areas/areas.component';

import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo:'calendar', pathMatch: 'full' },
  { path: 'appointments', component: AppointmentsComponent },
  
  { path: 'calendar', component: CalendarComponent, data: { title: 'Calendario' } },
  
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
