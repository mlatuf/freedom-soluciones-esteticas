import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { AppointmentPatient } from '../../../patients/classes/appointment-patient';
import { PatientService } from '../../../patients/services/patient.service';
import { AlertService } from '../../../core/services/alert/alert.service'
import { ApplicationStateService } from '../../../core/services/aplication-state/aplication-state.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'patient-appointment-history',
  templateUrl: './patient-appointment-history.component.html',
  styleUrls: ['./patient-appointment-history.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class PatientAppointmentHistoryComponent implements OnChanges {

  @Input() patientId: string;
  mobileView: Boolean = false;
  displayedColumns: string[] = ['date', 'areas', 'status', 'observations'];
  displayedMobileColumns: string[] = ['expand', 'date', 'areas'];
  dataSource: MatTableDataSource<AppointmentPatient>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private patientService: PatientService, 
    private spinner: NgxSpinnerService, 
    private alertService: AlertService,
    private aplicationStateService: ApplicationStateService ) { }

  ngOnChanges() {
    this.mobileView = this.aplicationStateService.getIsMobileResolution();
    if (this.patientId) {
      this.spinner.show();
      this.patientService.getPatientHistory$(this.patientId).subscribe(
        response => {
          this.dataSource = new MatTableDataSource(response);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.spinner.hide();
        },
        error => {
          this.spinner.hide();
          this.alertService.error(error);
        }
      );
    }
  }

}
