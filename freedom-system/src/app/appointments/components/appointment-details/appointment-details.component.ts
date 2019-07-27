import { Component, OnInit, Input } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from "@angular/forms";
import { ApplicationStateService } from "src/app/core/services/aplication-state/aplication-state.service";
import { NgxSpinnerService } from "ngx-spinner";

import { AlertService } from "src/app/core/services/alert/alert.service";
import { AppointmentService } from "src/app/appointments/services/appointment.service";
import { AreaService } from "src/app/areas/services/area.service";
import { Area } from "src/app/areas/classes/area";
import { Patient } from "src/app/patients/classes/patient";
import { PatientService } from "src/app/patients/services/patient.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Appointment } from "src/app/appointments/classes/appointment";
import { CalendarService } from "src/app/calendar/services/calendar.service";
import { Day } from "src/app/calendar/classes/day";

@Component({
  selector: "appointment-details",
  templateUrl: "./appointment-details.component.html",
  styleUrls: ["./appointment-details.component.scss"]
})
export class AppointmentDetailsComponent implements OnInit {
  mobileView: Boolean;
  areas: Area[] = [];
  patients: Patient[] = [];
  appointmentId: string;
  selectedDay: Day;
  selectedAreas: any[];
  appointmentDuration: number;
  appointment: Appointment;
  busyAppointments: Appointment[];
  availableDays: any[];
  availableTimes: number[];
  initialTimes: number[];
  @Input() editionMode: Boolean;
  openConfirmation: Boolean;

  appointmentForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private aplicationState: ApplicationStateService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private calendarService: CalendarService,
    private appointmentService: AppointmentService,
    private areaService: AreaService,
    private patientService: PatientService
  ) {}
  
  ngOnInit() {
    this.mobileView = this.aplicationState.getIsMobileResolution();
    this.selectedDay = new Day();
    this.appointment = new Appointment();
    this.setSelectedDay(this.route.snapshot.paramMap.get("day"));
    this.selectedAreas = this.busyAppointments = [];
    this.openConfirmation = false;
    this.appointmentId = this.route.snapshot.paramMap.get("id");
    this.editionMode = true;
    this.getSelectorsData();

    this.appointmentForm = this.fb.group({
      appointmentDay: new FormControl(
        { value: this.selectedDay._id, disabled: !this.editionMode },
        Validators.required
      ),
      appointmentPatient: new FormControl(
        { value: null, disabled: !this.editionMode },
        Validators.required
      ),
      appointmentAreas: new FormControl(
        { value: [], disabled: !this.editionMode },
        Validators.required
      ),
      appointmentTime: new FormControl(
        { value: null, disabled: (!this.editionMode || !this.selectedDay._id) },
        Validators.required
      ),
      appointmentPrice: new FormControl(
        { value: 0, disabled: !this.editionMode },
        Validators.required
      )
    });  
    if (this.appointmentId) {
      this.presetAppointmentForm();
    } else {
      
    }
  }
  
  private setSelectedDay(dayId: string): void {
    this.spinner.show();
    this.calendarService.getDayToAppointment$(dayId).subscribe(
      response => {
        this.onChangeDay(response);
        this.appointmentForm.get('appointmentDay').patchValue(response._id);
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        this.alertService.error(error);
      }
    );
  }

  private presetAppointmentForm(): void {
    this.spinner.show();
    this.appointmentService.getAppointmentData$(this.appointmentId).subscribe(
      response => {
        this.appointment = response;
        this.appointmentForm.get('appointmentPatient').patchValue(this.appointment.patient._id);
        this.onChangeSelector(this.appointment.patient._id, 'patient');
        this.selectedAreas = this.appointment.areas.map(area => area._id );
        this.appointmentForm.get('appointmentAreas').patchValue(this.selectedAreas);
        this.onChangeSelector(this.appointment.time, 'time');
        this.appointmentForm.get('appointmentTime').patchValue(this.appointment.time);
        this.appointmentForm.get('appointmentPrice').patchValue(this.appointment.price);
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        this.alertService.error(error);
      }
    );
  }

  private getSelectorsData(): void {
    this.spinner.show();
    this.availableTimes = this.appointmentService.getInitialTimes$(this.busyAppointments);
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
  }

  private getBusyAppointments(selectedDay: any): void {
    this.spinner.show();
    this.appointmentService.getAppointments$(selectedDay).subscribe(
      response => {
        this.busyAppointments = response;
        this.initialTimes = this.appointmentService.getInitialTimes$(this.busyAppointments);
        this.availableTimes = this.initialTimes;
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        this.alertService.error(error);
      }
    );
  }

  onChangeDay(event): void {
    if (event) {
      this.selectedDay = event;
      this.appointment.day = this.selectedDay._id ? this.selectedDay._id : event;
      this.getBusyAppointments({_id: this.selectedDay._id, date: this.selectedDay.date});
      this.appointmentForm.get('appointmentTime').enable();
    } else {
      this.appointmentService.getInitialTimes$([]);
      this.appointmentForm.get('appointmentTime').disable();
    }
  }
  
  onChangeAreas(event): void {
    this.appointment.price = 0;
    this.appointmentDuration = 0;
    let selectedAreasObject = [];
    if (event) {
      let selectedIds = event;
      selectedAreasObject = this.areas.filter((area) => { if (selectedIds.includes(area._id)) return area;});
      selectedAreasObject.forEach(area => {
        this.appointment.price += area.price;
        this.appointmentDuration += area.duration;
      });
      this.appointmentForm.get('appointmentPrice').patchValue(this.appointment.price);
      this.availableTimes =
      selectedAreasObject.length > 0
      ? this.appointmentService.updateAvailableTimes$(this.appointmentDuration, this.availableTimes)
      : this.initialTimes;
      this.appointmentDuration = this.appointmentDuration * 15;
    }
    this.appointment.areas = selectedAreasObject;
  }

  onChangeSelector(event, field: string): void {
    if (event) {
      switch (field) {
        case 'patient':
          let patientObject = this.patients.filter(obj => obj._id === event);
          this.appointment.patient = patientObject.length > 0 ? { _id:event, fullName: patientObject[0].name + ' ' + patientObject[0].lastName} : null;
        break;
        case 'time':
          this.appointment.time = event;
        break;
        default:
          this.appointment = new Appointment();
        break;
      }
    }
  }

  onSubmit() {
    this.spinner.show();
    this.appointmentService.saveAppointment$(this.appointment, this.selectedDay._id).subscribe(
      response => {
        this.spinner.hide();
        this.router.navigate(["/appointments",this.selectedDay._id]);
        this.alertService.success("Turno guardado con éxito");      
      },
      error => {
        this.spinner.hide();
        this.alertService.error(error);
      }
    );
  }
  
  cancelEdition(formDirty) {
    this.openConfirmation = formDirty;
    if (!formDirty) {
      this.confirmCancelation();
    }
  }
  
  confirmCancelation() {
    if (this.selectedDay._id) {
      this.router.navigate(["/appointments",this.selectedDay._id]);
    } else {
      this.router.navigate(["/calendar"]);
    }
  }
}
