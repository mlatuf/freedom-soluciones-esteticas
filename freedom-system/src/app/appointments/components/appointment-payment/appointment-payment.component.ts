import { Component, OnInit, Inject } from "@angular/core";

import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

import { PaymentMethod } from "../../models/paymentMethod";
import { getPayments } from "../../constants/payments.enum";
import { Month } from "src/app/core/models/month";
import { getMonths } from "src/app/core/constants/months.enum";

export interface ModalData {
  title: string;
  price: number;
  method: number;
}

@Component({
  selector: "appointment-payment",
  templateUrl: "./appointment-payment.component.html",
  styleUrls: ["./appointment-payment.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class AppointmentPaymentComponent implements OnInit {
  paymentMethods: PaymentMethod[];
  months: Month[];
  years: Number[];
  paymentForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AppointmentPaymentComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: ModalData
  ) {}

  ngOnInit() {
    this.paymentMethods = getPayments().filter(
      (paymentMethod) => paymentMethod.key != 1
    );
    this.months = getMonths();
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    this.years = [currentYear, currentYear + 1];
    this.paymentForm = this.fb.group({
      price: new FormControl(this.data.price, Validators.required),
      paymentMethod: new FormControl(this.data.method, Validators.required),
      nextSessionMonth: new FormControl(currentMonth),
      nextSessionYear: new FormControl(currentYear),
    });
  }

  public onSubmit(): void {
    this.dialogRef.close(this.paymentForm.value);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}