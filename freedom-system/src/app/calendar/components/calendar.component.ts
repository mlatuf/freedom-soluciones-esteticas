import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService } from '../../core/services/alert/alert.service'
import { CalendarService } from '../services/calendar.service'
import { NgxSpinnerService } from 'ngx-spinner';

import { Day } from '../classes/day';
import { ApplicationStateService } from '../../core/services/aplication-state/aplication-state.service';

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

  constructor(private router: Router, private aplicationState: ApplicationStateService,
    private calendarService: CalendarService, 
    private spinner: NgxSpinnerService, 
    private alertService: AlertService) { 
    this.showNewDateForm = this.openHistory = false;
  }
  
  ngOnInit() {
    this.calendar = this.calendarHistory = [];
    this.mobileView = this.aplicationState.getIsMobileResolution();
    this.newDate = new Day;
    this.newDate.isFinished = false;
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
    this.calendarService.saveDate$(this.newDate).subscribe(
      response => {
        this.getCalendar();
        this.spinner.hide();
        this.showNewDateForm = false;
        this.newDate.date = null;
        this.alertService.success("La fecha fue agregada correctamente");
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
