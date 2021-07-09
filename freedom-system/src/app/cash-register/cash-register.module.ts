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
  MatSelectModule,
} from "@angular/material";

import { CoreModule } from "../core/core.module";
import { AngularFireAuthGuard } from "@angular/fire/auth-guard";
import { CashRegisterComponent } from "./components/cash-register/cash-register.component";
import { DayMovementsComponent } from "./components/day-movements/day-movements.component";
import { MovementDetailsComponent } from "./components/day-movements/movement-details/movement-details.component";

@NgModule({
  declarations: [
    CashRegisterComponent,
    DayMovementsComponent,
    MovementDetailsComponent,
  ],
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
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
    MatSelectModule,
  ],
  providers: [AngularFireAuthGuard],
  entryComponents: [MovementDetailsComponent],
})
export class CashRegisterModule {}
