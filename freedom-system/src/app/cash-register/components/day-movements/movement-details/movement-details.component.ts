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
export interface IModalData {
  title: string;
  details: string;
  amount: number;
  type: string;
}
export interface IMovementType {
  key: number;
  label: string;
}
@Component({
  selector: "movement-details",
  templateUrl: "./movement-details.component.html",
  styleUrls: ["./movement-details.component.scss"],
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
export class MovementDetailsComponent implements OnInit {
  movementForm: FormGroup;
  types: IMovementType[];

  constructor(
    public dialogRef: MatDialogRef<MovementDetailsComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: IModalData
  ) {}

  ngOnInit() {
    this.types = [
      { key: 1, label: "Entrada" },
      { key: 2, label: "Salida" },
    ];
    this.movementForm = this.fb.group({
      details: new FormControl(this.data.details || "", Validators.required),
      amount: new FormControl(this.data.amount || 0, Validators.required),
      type: new FormControl(this.data.type, Validators.required),
    });
  }

  public onSubmit(): void {
    this.dialogRef.close(this.movementForm.value);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
