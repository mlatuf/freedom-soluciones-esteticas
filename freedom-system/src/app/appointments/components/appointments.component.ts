import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Appointment } from 'src/app/appointments/classes/appointment';
import { Area } from 'src/app/areas/classes/area';
import { Day } from 'src/app/calendar/classes/day';

import { AppointmentService } from 'src/app/appointments/services/appointment.service'
import { AreaService } from 'src/app/areas/services/area.service';
import { CalendarService } from 'src/app/calendar/services/calendar.service';
import { AlertService } from 'src/app/core/services/alert/alert.service'
import { NgxSpinnerService } from 'ngx-spinner';
import { ApplicationStateService } from 'src/app/core/services/aplication-state/aplication-state.service';

@Component({
  selector: 'appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
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
  selectedAppointment: string;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private aplicationState: ApplicationStateService,
    private spinner: NgxSpinnerService, 
    private alertService: AlertService,
    private appointmentService: AppointmentService,
    private areaService: AreaService,
    private calendarService: CalendarService) { 
      this.paymentsArray = [
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
    this.setAppointmentsDay();
    this.appointments = this.areasData = this.endedAppointments = [];
    this.getAppointmentsList();
  }

  private getAreasList() {    
    this.areaService.getAreas$().subscribe(
      response => {
        this.areasData = response;
        this.getAreasInformation();
      },
      error => {
        this.alertService.error(error);
      }
      );
    }
    
    private setAppointmentsDay(): void {
      this.spinner.show();
      this.calendarService.getDayToAppointment$(this.day).subscribe(
        response => {
          this.appointmentsDate = response;
          this.spinner.hide();
        },
        error => {
        this.spinner.hide();
        this.alertService.error(error);
      }
    );
  }

  private getAppointmentsList(): void {
    this.spinner.show();
    this.appointmentService.getAppointments$(this.appointmentsDate).subscribe(
      response => {
        this.appointments = response;
        this.getAreasList();
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        this.alertService.error(error);
      }
    );
  }

  private getAreasInformation(): void {
    this.appointments.forEach((appointment) => {
      let areasNames = [];
      // appointment.areas.forEach((areaId) => {
      //   areasNames.push(this.areasData[areaId-1].description);
      //   appointment.price += this.areasData[areaId-1].price;
      // });
      appointment.areas = areasNames;
    });
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
    let appointment = this.appointments.find((obj) => {
      return obj._id === appointmentChanged.selectedAppointment;
    });
    appointment.status = (appointmentChanged.newStatus != 6) ? appointmentChanged.newStatus : appointment.status;
    this.selectedAppointment = appointmentChanged.selectedAppointment;
    this.openPaymentModal = (appointmentChanged.newStatus === 6);
  }

  onChangePayment(event): void {
    this.paymentMethodSelected = event;
  }

  onSubmitPayment(): void {
    let appointment = this.appointments.find((obj) => {
      return obj._id === this.selectedAppointment;
    });
    appointment.paymentMethod = this.paymentMethodSelected;
    appointment.price = (this.paymentMethodSelected != 1) ? (appointment.price * 1.2) : appointment.price;
    appointment.status = 6;
    this.openPaymentModal = false;
  }

  showConfirmationModal(): void {
    this.endedAppointments = this.appointments.filter((obj) => {
      return (obj.status === 6);
    });
    this.openConfirmationModal = !this.openConfirmationModal;
  }

  onEndDay(): void {
    this.appointmentsDate.isFinished = true;
    this.openConfirmationModal = false;
  }

  endDayDisabled(): Boolean {
    let filteredList = this.appointments.filter((obj) => {
      return (obj.status != 6 && obj.status != 4);
    });
    return (filteredList.length > 0);
  }

  goToAppointmentDetails(appointmentId: number = null) {
    let detailsUrl = (appointmentId) ? ['/appointment/details/', this.day, appointmentId] 
    : ['/appointment/details/',this.day ];
    this.router.navigate(detailsUrl);
  }
}
