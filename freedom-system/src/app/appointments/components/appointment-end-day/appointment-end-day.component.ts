import { Component, Inject, OnInit } from "@angular/core";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

import { Appointment } from "../../classes/appointment";
import { getPayments } from "../../constants/payments.enum";
import { Taking } from "../../classes/taking";

export interface ModalData {
  title: string;
  appointments: Appointment[];
}

@Component({
  selector: "appointment-end-day",
  templateUrl: "./appointment-end-day.component.html",
  styleUrls: ["./appointment-end-day.component.scss"],
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
export class AppointmentEndDayComponent implements OnInit {
  displayedColumns: string[] = ["label", "cost"];
  takings: Taking[] = getPayments().map((payment) => ({
    key: payment.key,
    label: payment.label,
    value: 0,
  }));

  constructor(
    public dialogRef: MatDialogRef<AppointmentEndDayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalData
  ) {}

  getTotalCost() {
    return this.takings
      .map((t) => t.value)
      .reduce((acc, value) => acc + value, 0);
  }

  ngOnInit(): void {
    this.data.appointments.forEach((appointment) => {
      this.takings[appointment.paymentMethod - 1].value += appointment.price;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public createCashMovement(): void {
    this.dialogRef.close({
      finished: true,
      takings: this.takings,
    });
  }
}
