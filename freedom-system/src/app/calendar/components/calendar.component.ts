import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService } from '../../core/services/alert/alert.service'
import { CalendarService } from '../services/calendar.service'
import { NgxSpinnerService } from 'ngx-spinner';

import { Day } from '../classes/day';
import { ApplicationStateService } from '../../core/services/aplication-state/aplication-state.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';

@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  
  mobileView: Boolean;
  showNewDateForm: Boolean;
  openHistory: Boolean;
  newDate: Day;
  calendar: Day[];
  calendarHistory: Day[];
  dateForm: FormGroup;

  displayedColumns: string[] = ['year', 'month', 'days'];
  dataSource: MatTableDataSource<Day>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private router: Router, private aplicationState: ApplicationStateService,
    private calendarService: CalendarService, 
    private spinner: NgxSpinnerService, 
    private alertService: AlertService,
    private fb: FormBuilder) { 
    this.showNewDateForm = this.openHistory = false;
  }
  
  ngOnInit() {
    this.calendar = this.calendarHistory = [];
    this.mobileView = this.aplicationState.getIsMobileResolution();
    this.newDate = new Day;
    this.newDate.isFinished = false;
    this.dateForm = this.fb.group({
      newDate: new FormControl(this.newDate.date, Validators.required)
    });
    this.getCalendar(); 
  }

  showCalendarHistory(): void {
    this.openHistory = !this.openHistory;
    this.spinner.show();
    this.calendarService.getCalendarHistory$().subscribe(
      response => {
        this.calendarHistory = response;
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        this.alertService.error(error);
      }
    );
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
