import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface ModalData {
  title: String;
  hasError: Boolean;
  text: String;
  secondaryText: String;
  isConfirmationModal: Boolean;
  actions: Array<any>
}

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
