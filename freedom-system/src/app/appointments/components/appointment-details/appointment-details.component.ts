import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApplicationStateService } from 'src/app/core/services/aplication-state/aplication-state.service';
import { NgxSpinnerService } from 'ngx-spinner';

import { AlertService } from 'src/app/core/services/alert/alert.service';
import { AppointmentService } from 'src/app/appointments/services/appointment.service';
import { AreaService } from 'src/app/areas/services/area.service';
import { Area } from 'src/app/areas/classes/area';
import { Patient } from 'src/app/patients/classes/patient';
import { PatientService } from 'src/app/patients/services/patient.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Appointment } from 'src/app/appointments/classes/appointment';
import { CalendarService } from 'src/app/calendar/services/calendar.service';

@Component({
  selector: 'appointment-details',
  templateUrl: './appointment-details.component.html',
  styleUrls: ['./appointment-details.component.scss']
})
export class AppointmentDetailsComponent implements OnInit {

  mobileView: Boolean;
  areas: Area[];
  patients: Patient[];
  appointmentId: number;
  selectedDay: any;
  appointmentDuration: number;
  appointment: Appointment;
  availableDays: any[];
  availableTimes: any[];
  times: any[];
  @Input() editionMode: Boolean;
  openConfirmation: Boolean;

  appointmentForm: FormGroup;

  
  constructor(private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private aplicationState: ApplicationStateService,
    private spinner: NgxSpinnerService, 
    private alertService: AlertService,
    private calendarService: CalendarService,
    private appointmentService: AppointmentService,
    private areaService: AreaService,
    private patientService: PatientService) { }

  ngOnInit() {

    this.appointmentForm = this.fb.group({
      appointmentDay: new FormControl(null, Validators.required),
      appointmentPatient: new FormControl(null, Validators.required),
      appointmentAreas: new FormControl(null, Validators.required),
      appointmentTime: new FormControl(null, Validators.required)
    });

    this.openConfirmation = false;
    this.appointment = new Appointment();
    this.appointmentId = +this.route.snapshot.paramMap.get('id');
    let paramDay = this.route.snapshot.paramMap.get('day');
    this.selectedDay = paramDay;
    this.mobileView = this.aplicationState.getIsMobileResolution();
    this.editionMode = (this.appointmentId === 0);
    this.getSelectorsData();
    if (this.appointmentId) {
      this.spinner.show();
      this.appointmentService.getAppointmentData$(this.appointmentId).subscribe(
        response => {
          this.appointment = response;
          this.spinner.hide();
        },
        error => {
          this.spinner.hide();
          this.alertService.error(error);
        }
      );
    }
  }
  
  private getSelectorsData(): void {
    this.spinner.show();
    this.calendarService.getDaysList$().subscribe(
      response => {
        this.availableDays = response;
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        this.alertService.error(error);
      }
    );
    
    this.spinner.show();
    this.areaService.getAreas$().subscribe(
      response => {
        this.areas = response;
        this.spinner.hide();
      },
      error => {
        this.alertService.error(error);
      }
    );
      
    this.spinner.show();
    this.patientService.getPatients$().subscribe(
      response => {
        this.patients = response;
        this.spinner.hide();
      },
      error => {
        this.alertService.error(error);
      }
    );
    
    this.spinner.show();
    //TODO params day id
    this.appointmentService.getAppointmentTimes$(new Date(this.selectedDay)).subscribe(
      response => {
        this.times = this.availableTimes = response;
        this.spinner.hide();
      },
      error => {
        this.alertService.error(error);
      }
    )
  }

  onSubmit() {
    this.appointment.day = new Date(this.selectedDay);
    console.log(this.availableDays);
    console.log(this.selectedDay);
    // this.spinner.show();
    // this.appointmentService.saveAppointment$(this.appointment).subscribe(
    //   response => {
    //     this.appointment = response;
    //     this.spinner.hide();
    //     this.alertService.success("Turno cargado con exito");
    //   },
    //   error => {
    //     this.spinner.hide();
    //     this.alertService.error(error);
    //   }
    // );
  }

  cancelEdition(formDirty) {
    this.openConfirmation = formDirty;
    if (!formDirty) {
      this.confirmCancelation();
    }
  }
  
  confirmCancelation() {
    if (this.appointment.day) {
      let dayToString = [this.appointment.day.getFullYear(), this.appointment.day.getMonth(), this.appointment.day.getDate()].join('-');
      this.router.navigate(['/appointments', dayToString]);
    } else {
      this.router.navigate(['/calendar']);
    }
  }

  onChangeAreas(event): void {
    this.appointment.price = 0;
    this.appointmentDuration = 0;
    if (event) {
      event.forEach((area) => {
        this.appointment.price += area.price;
        this.appointmentDuration += area.duration
      });
      this.availableTimes = (this.appointment.areas.length > 0) ? this.updateAvailableTimes(this.appointmentDuration) : this.times;
      this.appointmentDuration = this.appointmentDuration *15;
    }
  }

  updateAvailableTimes(duration: number): any[] {
    let availableTimesUpdated = [];
    for (let index = 0; index < (this.availableTimes.length - duration); index++) {
      let possibleTime = true;
      for (let pos = index; (possibleTime && pos < (index + duration - 1)); pos++) {
        possibleTime = (this.availableTimes[pos + 1] === this.availableTimes[pos] + 1);
      }
      if (possibleTime) {
        availableTimesUpdated.push(this.availableTimes[index]); 
      }
    }
    return availableTimesUpdated;
  }
}
