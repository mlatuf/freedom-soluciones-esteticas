import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Appointment } from '../../classes/appointment/appointment';

import { AlertService } from '../../shared/alert/alert.service'
import { NgxSpinnerService } from 'ngx-spinner';
import { AppointmentService } from '../../shared/appointment/appointment.service'
import { AreaService } from '../../shared/area/area.service';
import { Area } from '../../classes/area/area';

@Component({
  selector: 'appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit {

  pageTitle: string;
  mobileView: Boolean;
  appointmentsDate: Date;
  day: string;
  appointments: Appointment[];
  endedAppointments: Appointment[];
  areasData: Area[];
  paymentsArray: any[];
  openPaymentModal: Boolean;
  openConfirmationModal: Boolean;
  paymentMethodSelected: number;
  selectedAppointment: number;
  isFinished: Boolean;

  constructor(private route: ActivatedRoute, private router: Router,
    private spinner: NgxSpinnerService, 
    private alertService: AlertService,
    private appointmentService: AppointmentService,
    private areaService: AreaService) { 
      this.pageTitle = this.route.snapshot.data['title'];
      this.day = this.route.snapshot.paramMap.get('day');
      this.paymentsArray = [
        {id: 1, description: 'Efectivo'},
        {id: 2, description: 'Débito'},
        {id: 3, description: 'Crédito'}
      ];
      this.openPaymentModal = this.openConfirmationModal = false;
      this.paymentMethodSelected = 1;
      this.mobileView = (window.screen.width < 576);
      //TODO este campo viene en el modelo Day
      this.isFinished = false;
    }

  ngOnInit() {
    this.appointmentsDate = new Date(this.day);
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
      appointment.areas.forEach((areaId) => {
        areasNames.push(this.areasData[areaId-1].description);
        appointment.price += this.areasData[areaId-1].price;
      });
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
    this.isFinished = true;
    this.openConfirmationModal = false;
  }

  endDayDisabled(): Boolean {
    let filteredList = this.appointments.filter((obj) => {
      return (obj.status != 6 && obj.status != 4);
    });
    return (filteredList.length > 0);
  }
}
