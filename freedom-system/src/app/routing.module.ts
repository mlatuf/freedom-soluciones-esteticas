import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AngularFireAuthGuard } from "@angular/fire/auth-guard";

import { CalendarComponent } from "./calendar/components/calendar.component";
import { LoginComponent } from "./core/components/login/login/login.component";
import { AppointmentsComponent } from "./appointments/components/appointments.component";
import { AppointmentDetailsComponent } from "./appointments/components/appointment-details/appointment-details.component";
import { PatientsComponent } from "./patients/components/patients.component";
import { PatientDetailsComponent } from "./patients/components/patient-details/patient-details.component";
import { AreasComponent } from "./areas/components/areas.component";
import { AreaDetailsComponent } from "./areas/components/area-details/area-details.component";
import { RouterModule, Routes } from "@angular/router";
import { CashRegisterComponent } from "./cash-register/components/cash-register/cash-register.component";
import { DayMovementsComponent } from "./cash-register/components/day-movements/day-movements.component";

// const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
// const redirectLoggedInToCalendar = () => redirectLoggedInTo(['calendar']);

const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },

  {
    path: "login",
    component: LoginComponent,
    data: { title: "Ingresar" },
  },

  {
    path: "calendar",
    component: CalendarComponent,
    canActivate: [AngularFireAuthGuard],
    data: { title: "Calendario" },
  },

  {
    path: "appointments/:day",
    component: AppointmentsComponent,
    canActivate: [AngularFireAuthGuard],
    data: { title: "Turnos" },
  },
  {
    path: "appointment/details/:day",
    component: AppointmentDetailsComponent,
    canActivate: [AngularFireAuthGuard],
    data: { title: "Nuevo turno" },
  },
  {
    path: "appointment/details/:day/:id",
    component: AppointmentDetailsComponent,
    canActivate: [AngularFireAuthGuard],
    data: { title: "Detalles del turno" },
  },

  {
    path: "patients",
    component: PatientsComponent,
    canActivate: [AngularFireAuthGuard],
    data: { title: "Pacientes" },
  },
  {
    path: "patient/details",
    component: PatientDetailsComponent,
    canActivate: [AngularFireAuthGuard],
    data: { title: "Nuevo paciente" },
  },
  {
    path: "patient/details/:id",
    component: PatientDetailsComponent,
    canActivate: [AngularFireAuthGuard],
    data: { title: "Detalles del paciente" },
  },

  {
    path: "areas",
    component: AreasComponent,
    canActivate: [AngularFireAuthGuard],
    data: { title: "Zonas" },
  },
  {
    path: "area/details",
    component: AreaDetailsComponent,
    canActivate: [AngularFireAuthGuard],
    data: { title: "Nueva Zona" },
  },
  {
    path: "area/details/:id",
    component: AreaDetailsComponent,
    canActivate: [AngularFireAuthGuard],
    data: { title: "Detalles de la zona" },
  },

  {
    path: "cash-register",
    component: CashRegisterComponent,
    canActivate: [AngularFireAuthGuard],
    data: { title: "Cajas" },
  },
  {
    path: "day-movements/:day",
    component: DayMovementsComponent,
    canActivate: [AngularFireAuthGuard],
    data: { title: "Movimientos del dia" },
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class RoutingModule {}
