import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AlertService } from '../../shared/alert/alert.service'
import { CalendarService } from '../../shared/calendar/calendar.service'
import { NgxSpinnerService } from 'ngx-spinner';

import { Day } from '../../classes/calendar/day';
import { Calendar } from '../../classes/calendar/calendar';
import { ApplicationStateService } from 'src/app/shared/aplication-state/aplication-state.service';

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
  calendar: Calendar;
  calendarHistory: Calendar;

  constructor(private router: Router, private aplicationState: ApplicationStateService,
    private calendarService: CalendarService, 
    private spinner: NgxSpinnerService, 
    private alertService: AlertService) { 
    this.showNewDateForm = this.openHistory = false;
    this.calendar = new Calendar;
    this.calendarHistory = new Calendar;
  }

  ngOnInit() {
    this.mobileView = this.aplicationState.getIsMobileResolution();
    this.newDate = new Day;
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

  onSubmit() {
    this.spinner.show();
    this.calendarService.addDate$(this.newDate).subscribe(
      response => {
        this.calendar = response;
        this.spinner.hide();
        this.alertService.success("La fecha fue agregada correctamente");
      },
      error => {
        this.spinner.hide();
        this.alertService.error(error);
      }
    );
  }

  goToAppointment(day: Date): void {
    let dayToString = [day.getFullYear(), day.getMonth() + 1, day.getDate()].join('-');
    this.router.navigate(['/appointments', dayToString]);
  }
}
