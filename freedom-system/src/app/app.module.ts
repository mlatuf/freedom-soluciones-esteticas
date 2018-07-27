import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { MenuComponent } from './common/menu/menu.component';
import { RoutingModule } from './/routing.module';
import { ClarityModule } from '@clr/angular';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent
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
