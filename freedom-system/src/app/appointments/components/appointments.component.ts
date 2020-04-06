import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';

import { Appointment } from 'src/app/appointments/classes/appointment';
import { Area } from 'src/app/areas/classes/area';
import { Day } from 'src/app/calendar/classes/day';

import { AppointmentService } from 'src/app/appointments/services/appointment.service'
import { CalendarService } from 'src/app/calendar/services/calendar.service';
import { AlertService } from 'src/app/core/services/alert/alert.service'
import { NgxSpinnerService } from 'ngx-spinner';
import { ApplicationStateService } from 'src/app/core/services/aplication-state/aplication-state.service';
import { ModalComponent } from 'src/app/core/components/modal/modal.component';
import { AppointmentEndDayComponent } from './appointment-end-day/appointment-end-day.component';

@Component({
  selector: 'appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class AppointmentsComponent implements OnInit {

  mobileView: Boolean;
  appointmentsDate: Day;
  day: string;
  appointments: Appointment[];
  endedAppointments: Appointment[];
  areasData: Area[];
  paymentsArray: any[];
  openPaymentModal: Boolean;
  openConfirmationModal: Boolean;
  paymentMethodSelected: number;
  selectedAppointment: Appointment;

  displayedColumns: string[] = ['time', 'patient', 'areas', 'price', 'status', 'observations', 'actions'];
  displayedMobileColumns: string[] = ['expand', 'time', 'patient'];
  dataSource: MatTableDataSource<Appointment>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private aplicationState: ApplicationStateService,
    private spinner: NgxSpinnerService, 
    private alertService: AlertService,
    private appointmentService: AppointmentService,
    private calendarService: CalendarService,
    public dialog: MatDialog) { 
      this.paymentsArray = [
        {id: 0, description: 'Impago'},
        {id: 1, description: 'Efectivo'},
        {id: 2, description: 'Débito'},
        {id: 3, description: 'Crédito'}
      ];
      this.openPaymentModal = this.openConfirmationModal = false;
      this.paymentMethodSelected = 1;
    }
    
  ngOnInit() {
    this.day = this.route.snapshot.paramMap.get('day');
    this.mobileView = this.aplicationState.getIsMobileResolution();
    this.appointmentsDate = new Day();
    this.appointments = this.areasData = this.endedAppointments = [];
    this.setAppointmentsDay();
  }
  
  private setAppointmentsDay(): void {
    this.spinner.show();
    this.calendarService.getDayToAppointment$(this.day).subscribe(
      response => {
        this.appointmentsDate = response;
        this.getAppointmentsList(this.appointmentsDate._id);
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        this.alertService.error(error);
      }
    );
  }

  private getAppointmentsList(selectedDay): void {
    this.spinner.show();
    this.appointmentService.getAppointments$(selectedDay).subscribe(
      response => {
        this.appointments = response.sort((a,b) => (a.time - b.time));
        this.dataSource = new MatTableDataSource(this.appointments);
        this.dataSource.paginator = this.paginator;
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        this.alertService.error(error);
      }
    );
  }

  public getAppointmentRowClass(status: number) {
    let returnedClass = '';
    switch (status) {
      case 1:
        returnedClass = 'new';
      break;
      case 2:
        returnedClass = 'waiting-confirmation';
      break;
      case 3:
        returnedClass =  'confirmed';
      break;
      case 4:
        returnedClass =  'missing';
      break;
      case 5:
        returnedClass =  'present';
      break;
      case 6:
        returnedClass =  'terminated';
      break;
      default:
        returnedClass =  'new';
      break;
    }
    return returnedClass;
  }

  onStatusChange(appointmentChanged: any): void {
    this.selectedAppointment = this.appointments.find((obj) => {
      return obj._id === appointmentChanged.selectedAppointment;
    });
    this.selectedAppointment.status = (appointmentChanged.newStatus != 6) ? appointmentChanged.newStatus : this.selectedAppointment.status;
    this.spinner.show();
    this.appointmentService.saveAppointment$(this.selectedAppointment, this.day).subscribe(
      response => {
        this.selectedAppointment = response;
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        this.alertService.error(error);
      }
    );
    this.openPaymentModal = (appointmentChanged.newStatus === 6);
  }

  onChangePayment(event): void {
    this.paymentMethodSelected = event;
  }

  onSubmitPayment(): void {
    this.selectedAppointment.paymentMethod = this.paymentMethodSelected;
    this.selectedAppointment.price = (this.paymentMethodSelected != 1) ? (this.selectedAppointment.price * 1.2) : this.selectedAppointment.price;
    this.selectedAppointment.status = 6;
    this.openPaymentModal = false;
  }

  showConfirmationModal(): void {
    this.endedAppointments = this.appointments.filter((obj) => {
      return (obj.status === 6);
    });
    const dialogRef = this.dialog.open(AppointmentEndDayComponent, {
      width: '80%',
      data: {
        title: 'Terminar dia',
        appointments: this.endedAppointments
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.appointmentsDate.isFinished = result;
    });
  }

  endDayDisabled(): Boolean {
    let filteredList = this.appointments.filter((obj) => {
      return (obj.status != 6 && obj.status != 4);
    });
    return (filteredList.length > 0);
  }

  goToAppointmentDetails(appointmentId: number = null) {
    let detailsUrl = (appointmentId) ? ['/appointment/details/', this.appointmentsDate._id, appointmentId ] 
    : ['/appointment/details/', this.appointmentsDate._id];
    this.router.navigate(detailsUrl);
  }

  deleteDay(): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        title: "Eliminar dia completo", 
        text: "Está seguro que desea eliminar el dia? Se perderán todos los datos de los turnos agendando para el dia. Esta accion es irreversible",
        isConfirmationModal: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.appointments.forEach(appointment => {
          this.spinner.show();
          this.appointmentService.deleteAppointment$(appointment._id).subscribe(
            response => {
              this.spinner.hide();
            },
            error => {
              this.spinner.hide();
              this.alertService.error(error);
            }
          );
        });
        this.spinner.show();
        this.calendarService.deleteCalendarDay$(this.appointmentsDate._id).subscribe(
          response => {
            this.spinner.hide();
            this.router.navigate(['/calendar']);
          },
          error => {
            this.spinner.hide();
            this.alertService.error(error);
          }
        )
      }
    });
  } 
}
