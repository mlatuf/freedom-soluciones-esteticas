import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatPaginator, MatTableDataSource, MatDialog } from "@angular/material";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";

import { Appointment } from "src/app/appointments/classes/appointment";
import { Area } from "src/app/areas/classes/area";
import { Day } from "src/app/calendar/classes/day";

import { AppointmentService } from "src/app/appointments/services/appointment.service";
import { CalendarService } from "src/app/calendar/services/calendar.service";
import { AlertService } from "src/app/core/services/alert/alert.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ApplicationStateService } from "src/app/core/services/aplication-state/aplication-state.service";
import { ModalComponent } from "src/app/core/components/modal/modal.component";
import { AppointmentEndDayComponent } from "./appointment-end-day/appointment-end-day.component";
import {
  getStatusByKey,
  StatusList,
} from "src/app/appointments/constants/status.enum";
import { PaymentList, Payments } from "../constants/payments.enum";
import { AppointmentPaymentComponent } from "./appointment-payment/appointment-payment.component";
import { PatientService } from "src/app/patients/services/patient.service";
import { Movement } from "src/app/cash-register/classes";
import { CashRegisterService } from "src/app/cash-register/services/cash-register.service";
import { Taking } from "../classes";

@Component({
  selector: "appointments",
  templateUrl: "./appointments.component.html",
  styleUrls: ["./appointments.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class AppointmentsComponent implements OnInit {
  mobileView: Boolean;
  appointmentsDate: Day;
  day: string;
  appointments: Appointment[];
  areasData: Area[];
  openPaymentModal: Boolean;
  openConfirmationModal: Boolean;
  paymentMethodSelected: number;
  selectedAppointment: Appointment;

  displayedColumns: string[] = [
    "time",
    "patient",
    "areas",
    "price",
    "status",
    "observations",
    "actions",
  ];
  displayedMobileColumns: string[] = ["expand", "time", "patient"];
  dataSource: MatTableDataSource<Appointment>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private aplicationState: ApplicationStateService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private calendarService: CalendarService,
    private cashRegisterService: CashRegisterService,
    public dialog: MatDialog
  ) {
    this.openPaymentModal = this.openConfirmationModal = false;
    this.paymentMethodSelected = PaymentList.NonPayment.key;
  }

  ngOnInit() {
    this.day = this.route.snapshot.paramMap.get("day");
    this.mobileView = this.aplicationState.getIsMobileResolution();
    this.appointmentsDate = new Day();
    this.appointments = this.areasData = [];
    this.setAppointmentsDay();
  }

  private setAppointmentsDay(): void {
    this.spinner.show();
    this.calendarService.getDayToAppointment$(this.day).subscribe(
      (response) => {
        this.appointmentsDate = response;
        this.getAppointmentsList(this.appointmentsDate._id);
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
        this.alertService.error(error);
      }
    );
  }

  private getAppointmentsList(selectedDay): void {
    this.spinner.show();
    this.appointmentService.getAppointments$(selectedDay).subscribe(
      (response) => {
        this.appointments = response.sort((a, b) => a.time - b.time);
        this.dataSource = new MatTableDataSource(this.appointments);
        this.dataSource.paginator = this.paginator;
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
        this.alertService.error(error);
      }
    );
  }

  private saveAppointment(): void {
    this.spinner.show();
    this.appointmentService
      .saveAppointment$(this.selectedAppointment, this.day)
      .subscribe(
        (response) => {
          this.selectedAppointment = response;
          this.spinner.hide();
        },
        (error) => {
          this.spinner.hide();
          this.alertService.error(error);
        }
      );
  }

  private savePatientNextSession(): void {
    this.spinner.show();
    this.patientService
      .savePatient$(this.selectedAppointment.patient)
      .subscribe({
        next(response) {
          this.selectedAppointment.patient = response;
          this.spinner.hide();
        },
        error(error) {
          this.spinner.hide();
          this.alertService.error(error);
        },
      });
  }

  public getAppointmentRowClass(status: number) {
    return getStatusByKey(status).classRow;
  }

  public onStatusChange(appointmentChanged: any): void {
    this.selectedAppointment = this.appointments.find(
      (obj) => obj._id === appointmentChanged.selectedAppointment
    );
    switch (appointmentChanged.newStatus) {
      case StatusList.Ended.key:
        this.endAppointment(this.selectedAppointment);
        break;
      case StatusList.Terminated.key:
        this.appointmentService
          .deleteAppointment$(this.selectedAppointment._id)
          .subscribe({
            next() {
              this.spinner.hide();
            },
            error(error) {
              this.spinner.hide();
              this.alertService.error(error);
            },
          });
        break;
      default:
        this.selectedAppointment.status = appointmentChanged.newStatus;
        this.saveAppointment();
        break;
    }
  }

  public showEndDayModal(): void {
    const billableAppointments = this.appointments.filter(
      (appointment) =>
        appointment.status === StatusList.Ended.key ||
        appointment.status === StatusList.Present.key
    );
    const dialogRef = this.dialog.open(AppointmentEndDayComponent, {
      width: "80%",
      data: {
        title: "Terminar dia",
        appointments: billableAppointments,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.appointmentsDate.isFinished = result.finished;
      this.createEndDayMovement(result.takings);
    });
  }

  public endDayDisabled(): Boolean {
    return (
      this.appointments.length === 0 ||
      this.appointments.filter((appointment) => {
        const statusObj = getStatusByKey(appointment.status);
        return statusObj != StatusList.Present && statusObj != StatusList.Ended;
      }).length > 0
    );
  }

  public goToAppointmentDetails(appointmentId: number = null): void {
    let detailsUrl = appointmentId
      ? ["/appointment/details/", this.appointmentsDate._id, appointmentId]
      : ["/appointment/details/", this.appointmentsDate._id];
    this.router.navigate(detailsUrl);
  }

  public deleteDay(): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        title: "Eliminar dia completo",
        text: "Está seguro que desea eliminar el dia? Se perderán todos los datos de los turnos agendando para el dia. Esta accion es irreversible",
        isConfirmationModal: true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.appointments.forEach((appointment) => {
          this.spinner.show();
          this.appointmentService
            .deleteAppointment$(appointment._id)
            .subscribe({
              next() {
                this.spinner.hide();
              },
              error(error) {
                this.spinner.hide();
                this.alertService.error(error);
              },
            });
        });
        this.spinner.show();
        this.calendarService
          .deleteCalendarDay$(this.appointmentsDate._id)
          .subscribe({
            next() {
              this.spinner.hide();
              this.router.navigate(["/calendar"]);
            },
            error(error) {
              this.spinner.hide();
              this.alertService.error(error);
            },
          });
      }
    });
  }

  public deleteAppointment(appointmentId: string): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        title: "Eliminar turno",
        text: "Está seguro que desea eliminar el turno? Se perderán todos los datos de los turnos agendando para el dia. Esta accion es irreversible",
        isConfirmationModal: true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.spinner.show();
        this.appointmentService.deleteAppointment$(appointmentId).subscribe({
          next() {
            this.spinner.hide();
          },
          error(error) {
            this.spinner.hide();
            this.alertService.error(error);
          },
        });
      }
    });
  }

  public endAppointment(selectedAppointment: Appointment): void {
    const dialogRef = this.dialog.open(AppointmentPaymentComponent, {
      data: {
        title: "Finalizar turno",
        price: selectedAppointment.price,
        method: selectedAppointment.paymentMethod,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.selectedAppointment.price = result.price;
        this.selectedAppointment.paymentMethod = result.paymentMethod;
        this.selectedAppointment.status = StatusList.Ended.key;
        this.selectedAppointment.patient.nextSession =
          result.nextSessionMonth + "/" + result.nextSessionYear;
        this.saveAppointment();
        this.savePatientNextSession();
      }
    });
  }

  public editionDisabled(status: number): Boolean {
    return status === StatusList.Ended.key;
  }

  private createEndDayMovement(takings: Taking[]): void {
    const endDayMovements = takings
      .filter((taking) => taking.value != 0)
      .map((taking) => ({
        _id: null,
        day: this.appointmentsDate._id,
        amount:
          taking.label != Payments.nonPayment
            ? Math.abs(taking.value)
            : -Math.abs(taking.value),
        details: `Total ${taking.label} del dia`,
        createdAt: new Date(),
      }));

    endDayMovements.forEach((movement) => {
      this.spinner.show();
      this.cashRegisterService.saveMovement$(movement).subscribe(
        (response) => {
          this.spinner.hide();
          this.router.navigate(["/day-movements", this.appointmentsDate._id]);
        },
        (error) => {
          this.spinner.hide();
          this.alertService.error(error);
        }
      );
    });
  }
}
