import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { getNextStatus } from '../../constants/status.enum';

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

  ngOnChanges(): void {
    this.setActionsList();
  }

  changeStatus(newStatus: number) {
    this.onStatusChange.emit({'selectedAppointment': this.selectedAppointment,'newStatus': newStatus});
    this.setActionsList();
  }

  setActionsList(): void {
    this.actionsList = getNextStatus(this.currentStatus);
  }
}
