import { NgModule } from '@angular/core';
import { ClarityModule,ClrFormsNextModule } from '@clr/angular';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { CoreModule } from '../core/core.module';

import { CalendarComponent } from './components/calendar.component';
import { MonthNamePipe } from './pipes/month-name.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CoreModule,
    ClarityModule,
    ClrFormsNextModule
  ],
  declarations: [
    CalendarComponent,
    MonthNamePipe
  ]
})
export class CalendarModule { }
