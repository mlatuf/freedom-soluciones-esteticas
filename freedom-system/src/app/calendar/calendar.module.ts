import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import {
  MatButtonModule,
  MatIconModule,
  MatCardModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatNativeDateModule,
  MatInputModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatDividerModule,
  MatDialogModule,
} from "@angular/material";

import { CoreModule } from "../core/core.module";

import { CalendarComponent } from "./components/calendar.component";
import { CalendarHistoryComponent } from "./components/calendar-history/calendar-history.component";

import { AngularFireAuthGuard } from "@angular/fire/auth-guard";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDividerModule,
    MatDialogModule,
  ],
  declarations: [CalendarComponent, CalendarHistoryComponent],
  entryComponents: [CalendarHistoryComponent],
  providers: [AngularFireAuthGuard],
})
export class CalendarModule {}
