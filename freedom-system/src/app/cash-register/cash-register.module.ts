import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
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

import { CashRegisterComponent } from "./components/cash-register/cash-register.component";
import { CoreModule } from "../core/core.module";
import { AngularFireAuthGuard } from "@angular/fire/auth-guard";

@NgModule({
  declarations: [CashRegisterComponent],
  imports: [
    CommonModule,
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
  providers: [AngularFireAuthGuard],
})
export class CashRegisterModule {}
