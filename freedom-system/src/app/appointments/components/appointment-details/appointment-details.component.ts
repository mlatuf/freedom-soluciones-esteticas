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
import { ModalComponent } from 'src/app/core/components/modal/modal.component';
import { CalendarService } from "src/app/calendar/services/calendar.service";
import { Day } from "src/app/calendar/classes/day";
import { MatDialog } from "@angular/material";

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
  appointmentDuration: number;
  appointment: Appointment;
  busyAppointments: Appointment[];
  availableDays: any[];
  availableTimes: number[];
  initialTimes: number[];
  @Input() editionMode: Boolean;
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
    private patientService: PatientService,
    public dialog: MatDialog
  ) {}
  
  ngOnInit() {
    this.mobileView = this.aplicationState.getIsMobileResolution();
    this.selectedDay = new Day();
    this.setSelectedDay(this.route.snapshot.paramMap.get("day"));
    this.appointmentId = this.route.snapshot.paramMap.get("id");
    this.editionMode = (!this.appointmentId);
    this.setFormValues();
    this.appointment = new Appointment();
    this.busyAppointments = [];
    this.getSelectorsData();
    if (this.appointmentId) {
      this.editionMode = false;
      this.presetAppointmentForm();
    }
  }

  private onChangesForm(): void {
    this.appointmentForm.get('appointmentPatient').valueChanges.subscribe(val => {
      let patientObject = this.patients.filter(obj => obj._id === val);
      this.appointment.patient = patientObject.length > 0 ? { _id:val, fullName: patientObject[0].name + ' ' + patientObject[0].lastName} : null;
    });

    this.appointmentForm.get('appointmentDay').valueChanges.subscribe(val => {
      this.setSelectedDay(val);
    });

    this.appointmentForm.get('appointmentTime').valueChanges.subscribe(val => {
      this.appointment.time = val;
    });

    this.appointmentForm.get('appointmentAreas').valueChanges.subscribe(val => {
      this.onChangeAreas(val);
    });

    this.appointmentForm.get('appointmentDuration').valueChanges.subscribe(val => {
      this.appointmentDuration = val;
    });

  }

  private setFormValues(day = null, patient = null, areas = [], time = null, price = 0, observations = '') {
    const areasToSet = areas.map((area) => area._id);
    const duration = areas.reduce((acc,area) =>  acc + area.duration, 0);
    day = day ? day : this.route.snapshot.paramMap.get("day");
    
    this.appointmentForm = this.fb.group({
      appointmentDay: new FormControl(
        { value: day, disabled: !this.editionMode },
        Validators.required
      ),
      appointmentPatient: new FormControl(
        { value: patient, disabled: !this.editionMode },
        Validators.required
      ),
      appointmentAreas: new FormControl(
        { value: areasToSet, disabled: !this.editionMode },
        Validators.required
      ),
      appointmentTime: new FormControl(
        { value: time, disabled: (!this.editionMode) },
        Validators.required
      ),
      appointmentDuration: new FormControl(
        { value: duration * 15, disabled: !this.editionMode }
      ),
      appointmentPrice: new FormControl(
        { value: price, disabled: !this.editionMode },
        Validators.required
      ), 
      appointmentObservations: new FormControl(
        { value: observations, disabled: !this.editionMode}
      )
    });
    this.onChangesForm();
  }

  public toggleEditionMode():void {
    this.editionMode = !this.editionMode;
    if (this.editionMode) {
      this.appointmentForm.enable();
    } else {
      this.appointmentForm.disable();
    }
  }
  
  private setSelectedDay(dayId: string): void {
    this.spinner.show();
    this.calendarService.getDayToAppointment$(dayId).subscribe(
      response => {
        this.selectedDay = response;
        this.appointment.day = this.selectedDay._id ? this.selectedDay._id : event;
        this.getBusyAppointments(this.selectedDay._id);
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
        this.setFormValues(this.appointment.day._id, this.appointment.patient._id, this.appointment.areas, this.appointment.time,this.appointment.price, this.appointment.observations);
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
    this.availableTimes = this.appointmentService.getInitialTimes$(this.busyAppointments, this.appointmentId);
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

  private getBusyAppointments(selectedDay: string): void {
    this.spinner.show();
    this.appointmentService.getAppointments$(selectedDay).subscribe(
      response => {
        this.busyAppointments = response;
        this.initialTimes = this.appointmentService.getInitialTimes$(this.busyAppointments, this.appointmentId);
        this.availableTimes = this.initialTimes;
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        this.alertService.error(error);
      }
    );
  }
  
  private onChangeAreas(event): void {
    this.appointment.price = 0;
    this.appointmentDuration = 0;
    let selectedAreasObject = [];
    if (event) {
      let selectedIds = event;
      selectedAreasObject = this.areas.filter((area) => { if (selectedIds.includes(area._id)) return area;});
      selectedAreasObject.forEach(area => {
        this.appointment.price += parseInt(area.price);
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
    this.appointmentForm.get('appointmentDuration').patchValue(this.appointmentDuration);
  }

  public onSubmit(): void {
    this.spinner.show();
    console.log(this.appointment);
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
  
  public cancelEdition(formDirty): void {
    if (formDirty) {
      const dialogRef = this.dialog.open(ModalComponent, {
        data: {
          title: "Cancelar edicion", 
          text: "Está seguro que desea cancelar la edicion? Se perderán todos los datos no guardados.",
          isConfirmationModal: true
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if(result) {
          this.confirmCancelation();
        }
      });
    } else {
      this.confirmCancelation();
    }
  }
  
  public confirmCancelation(): void {
    if (this.selectedDay._id) {
      this.router.navigate(["/appointments",this.selectedDay._id]);
    } else {
      this.router.navigate(["/calendar"]);
    }
  }
}
