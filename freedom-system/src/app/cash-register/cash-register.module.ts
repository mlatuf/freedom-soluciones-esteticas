import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CashRegisterComponent } from "./components/cash-register/cash-register.component";
import { CoreModule } from "../core/core.module";
import { AngularFireAuthGuard } from "@angular/fire/auth-guard";

@NgModule({
  declarations: [CashRegisterComponent],
  imports: [CommonModule, CoreModule],
  providers: [AngularFireAuthGuard],
})
export class CashRegisterModule {}
