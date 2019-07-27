import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'appointment-actions',
  templateUrl: './appointment-actions.component.html',
  styleUrls: ['./appointment-actions.component.scss']
})
export class AppointmentActionsComponent implements OnChanges {
 
  @Input() currentStatus: number;
  @Input() selectedAppointment: string;
  actionsList: number[];
  @Output() onStatusChange = new EventEmitter<any>();

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.setActionsList();
  }

  changeStatus(newStatus: number) {
    this.onStatusChange.emit({'selectedAppointment': this.selectedAppointment,'newStatus': newStatus});
    this.setActionsList();
  }

  setActionsList(): void {
    switch (this.currentStatus) {
      case 1:
        this.actionsList = [2];
      break;
      case 2:
        this.actionsList = [3,7];
      break;
      case 3:
        this.actionsList = [4,5];
      break;
      case 4:
        this.actionsList = [1];
      break;
      case 5:
        this.actionsList = [6];
      break;
      case 6:
        this.actionsList = [1];
      break;
      default:
        this.actionsList = [2];
      break;
    }
  }
}
