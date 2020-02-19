import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { AlertService } from 'src/app/core/services/alert/alert.service'
import { CalendarService } from 'src/app/calendar/services/calendar.service'
import { ApplicationStateService } from 'src/app/core/services/aplication-state/aplication-state.service';
import { NgxSpinnerService } from 'ngx-spinner';

import { Day } from '../classes/day';
import { CalendarHistoryComponent } from 'src/app/calendar/components/calendar-history/calendar-history.component'

@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class CalendarComponent implements OnInit {
  
  mobileView: Boolean;
  showNewDateForm: Boolean;
  newDate: Day;
  calendar: Day[];
  dateForm: FormGroup;

  displayedColumns: string[] = ['year', 'month', 'days'];
  displayedMobileColumns: string[] = ['expand', 'year', 'month'];
  dataSource: MatTableDataSource<Day>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private router: Router, private aplicationState: ApplicationStateService,
    private calendarService: CalendarService, 
    private spinner: NgxSpinnerService, 
    private alertService: AlertService,
    private fb: FormBuilder,
    public dialog: MatDialog) { 
    this.showNewDateForm  = false;
  }
  
  ngOnInit() {
    this.calendar = [];
    this.mobileView = this.aplicationState.getIsMobileResolution();
    this.newDate = new Day;
    this.newDate.isFinished = false;
    this.dateForm = this.fb.group({
      newDate: new FormControl(this.newDate.date, Validators.required)
    });
    this.getCalendar(); 
  }

  showCalendarHistory() {
    const dialogRef = this.dialog.open(CalendarHistoryComponent, {
      width: '80%',
      data: {
        title: 'Historial de dias',
      }
    });
    dialogRef.afterClosed().subscribe(result => {});
  }

  private getCalendar() {
    this.spinner.show();
    this.calendarService.getCalendar$().subscribe(
      response => {
        this.calendar = response;
        this.dataSource = new MatTableDataSource(this.calendar);
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

  onSubmit() {
    this.spinner.show();
    this.newDate.date = this.dateForm.get('newDate').value;
    this.calendarService.saveDate$(this.newDate).subscribe(
      response => {
        this.spinner.hide();
        this.showNewDateForm = false;
        this.newDate.date = null;
        this.dateForm.reset();
        this.alertService.success("La fecha fue agregada correctamente");
        this.getCalendar();
      },
      error => {
        this.spinner.hide();
        this.alertService.error(error);
      }
    );
  }

  goToAppointment(day: string): void {
    this.router.navigate(['/appointments', day]);
  }
}
