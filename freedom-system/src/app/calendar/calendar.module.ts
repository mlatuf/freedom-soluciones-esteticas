import { NgModule } from '@angular/core';
import { ClarityModule } from '@clr/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';

import { MatButtonModule, MatIconModule, MatCardModule, MatDatepickerModule, MatFormFieldModule, MatNativeDateModule, MatInputModule, MatTableModule, MatPaginatorModule, MatSortModule } from '@angular/material';

import { CoreModule } from '../core/core.module';

import { CalendarComponent } from './components/calendar.component';
import { MonthNamePipe } from './pipes/month-name.pipe';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    ClarityModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  declarations: [
    CalendarComponent,
    MonthNamePipe
  ],
  providers: [AngularFireAuthGuard]
})
export class CalendarModule { }
