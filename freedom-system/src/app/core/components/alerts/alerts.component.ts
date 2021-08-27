import { Component, OnInit } from "@angular/core";
import { Alert, AlertType } from "../../models/alert";
import { AlertService } from "../../services/alert/alert.service";
import { MatSnackBar, MatDialog } from "@angular/material";
import { ModalComponent } from "../modal/modal.component";
import { ErrorService } from "../../services/alert/error.service";

@Component({
  selector: "alerts",
  templateUrl: "./alerts.component.html",
  styleUrls: ["./alerts.component.scss"],
})
export class AlertsComponent implements OnInit {
  alerts: Alert[] = [];

  constructor(
    private alertService: AlertService,
    public dialog: MatDialog,
    private _snackbar: MatSnackBar,
    private errorService: ErrorService
  ) {}

  ngOnInit() {
    this.alertService.getAlert().subscribe((alert: Alert) => {
      if (!alert) {
        // clear alerts when an empty alert is received
        this.alerts = [];
        return;
      }
      // add alert to array
      this.alerts.push(alert);
      if (alert.type === AlertType.Error) {
        const dialogRef = this.dialog.open(ModalComponent, {
          disableClose: true,
          data: {
            title: "Ops! Al parecer tenemos problemas",
            text: this.errorService.getErrorText(alert.message),
            hasError: true,
          },
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            return;
          }
        });
      } else {
        this._snackbar.open(alert.message, "OK", {
          duration: 2000,
          panelClass: "snackbar-container",
        });
      }
    });
  }

  removeAlert(alert: Alert) {
    this.alerts = this.alerts.filter((x) => x !== alert);
  }

  cssClass(alert: Alert) {
    if (!alert) {
      return;
    }
    // return css class based on alert type
    switch (alert.type) {
      case AlertType.Success:
        return "success";
      case AlertType.Error:
        return "danger";
      case AlertType.Info:
        return "info";
      case AlertType.Warning:
        return "warning";
    }
  }
}
