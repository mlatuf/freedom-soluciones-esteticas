import { Component, ViewChild, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { CalendarService } from 'src/app/calendar/services/calendar.service';
import { AlertService } from 'src/app/core/services/alert/alert.service'
import { ApplicationStateService } from 'src/app/core/services/aplication-state/aplication-state.service';
import { NgxSpinnerService } from 'ngx-spinner';

import { Day } from 'src/app/calendar/classes/day';

export interface ModalData {
  title: string;
}

@Component({
  selector: 'calendar-history',
  templateUrl: './calendar-history.component.html',
  styleUrls: ['./calendar-history.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class CalendarHistoryComponent implements OnInit {

  mobileView: Boolean = false;
  displayedColumns: string[] = ['year', 'month', 'days'];
  displayedMobileColumns: string[] = ['expand', 'year', 'month'];
  dataSource: MatTableDataSource<Day>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private calendarService: CalendarService,
    private router: Router,
    private spinner: NgxSpinnerService, 
    private alertService: AlertService,
    private aplicationStateService: ApplicationStateService,
    public dialogRef: MatDialogRef<CalendarHistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalData) {}

  ngOnInit() {
    this.mobileView = this.aplicationStateService.getIsMobileResolution();
    this.calendarService.getCalendarHistory$().subscribe(
      response => {
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => {
        this.alertService.error(error);
      }
    );
  }

  goToAppointment(day: string): void {
    this.dialogRef.close();
    this.router.navigate(['/appointments', day]);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
