import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { MenuComponent } from './common/menu/menu.component';
import { AppointmentsComponent } from './pages/appointments/appointments.component';
import { RoutingModule } from './/routing.module';
import { ClarityModule } from '@clr/angular';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    AppointmentsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RoutingModule,
    ClarityModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
