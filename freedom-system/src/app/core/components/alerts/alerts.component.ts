import { Component, OnInit } from '@angular/core';
import { Alert, AlertType } from '../../classes/alert';
import { AlertService } from '../../services/alert/alert.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {

  alerts: Alert[] = [];
  snackbarDuration = 3;
 
  constructor(private alertService: AlertService, private _snackbar: MatSnackBar) { }

  ngOnInit() {
    this.alertService.getAlert().subscribe((alert: Alert) => {
      if (!alert) {
        // clear alerts when an empty alert is received
        this.alerts = [];
        return;
      }
      // add alert to array
      this.alerts.push(alert);
      if (alert.type === AlertType.Success) {
        this.openSnackbar(alert.message);
      }
    });
  }

  openSnackbar(message: string) {
    this._snackbar.open(message);
  }

  removeAlert(alert: Alert) {
    this.alerts = this.alerts.filter(x => x !== alert);
  }

  cssClass(alert: Alert) {
    if (!alert) {
      return;
    }
    // return css class based on alert type
    switch (alert.type) {
      case AlertType.Success:
        return 'success';
      case AlertType.Error:
        return 'danger';
      case AlertType.Info:
        return 'info';
      case AlertType.Warning:
        return 'warning';
    }
  }
  
}
