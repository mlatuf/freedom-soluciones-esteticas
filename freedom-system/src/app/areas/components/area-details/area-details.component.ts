import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { Area } from '../../classes/area';

import { AreaService } from '../../services/area.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from '../../../core/services/alert/alert.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ModalComponent } from 'src/app/core/components/modal/modal.component';

@Component({
  selector: 'area-details',
  templateUrl: './area-details.component.html',
  styleUrls: ['./area-details.component.scss']
})
export class AreaDetailsComponent implements OnChanges {

  @Input() areaId: number;
  areaModel: Area;
  durationsArray: Array<any>;
  @Output() closeModal: EventEmitter<any>;
  openConfirmation: Boolean;
  areaForm: FormGroup;

  constructor(private areaService: AreaService, private fb: FormBuilder, private spinner: NgxSpinnerService, 
    private alertService: AlertService,
    public dialog: MatDialog,
    private _snackbar: MatSnackBar) {
      this.durationsArray = [
        {id: 1, description: '15 minutos'},
        {id: 2, description: '30 minutos'},
        {id: 3, description: '45 minutos'},
        {id: 4, description: '60 minutos'}
      ];
      this.closeModal = new EventEmitter();
      this.openConfirmation = false;
  }
  
  ngOnChanges() {
    this.areaModel = new Area;
    if (this.areaId) {
      this.spinner.show();
      this.areaService.getAreaData$(this.areaId).subscribe(
        response => {
          this.areaModel = response;
          this.setFormValues(this.areaModel.description, this.areaModel.price, this.areaModel.duration);
          this.spinner.hide();
        },
        error => {
          this.spinner.hide();
          this.alertService.error(error);
        }
      );
    } else {
      this.setFormValues();
    }
  }

  private setFormValues(description = '', price = null, duration = null) {
    this.areaForm = this.fb.group({
      areaDescription: new FormControl(description, Validators.required),
      areaPrice: new FormControl(price, Validators.required),
      areaDuration: new FormControl(duration, Validators.required)
    });
  }

  onChange(event) {
    this.areaModel.duration = event;
  }

  onSubmit() {
    this.spinner.show();
    this.areaService.saveArea$(this.areaModel).subscribe(
      response => {
        this.spinner.hide();
        this.closeModal.emit();
        this._snackbar.open("Zona guardada con éxito","OK", {
          duration: 2000,
          panelClass: 'snackbar-container'
        });      
      },
      error => {
        this.spinner.hide();
        this.closeModal.emit();
        this.alertService.error(error);
      }
    );
  }

  cancelEditionModal(formDirty) {
    if (formDirty) {
      const dialogRef = this.dialog.open(ModalComponent, {
        data: {
          title: "Cancelar edición", 
          text: "Está seguro que desea cancelar la edición ?",
          isConfirmationModal: true
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result) {
          this.closeModal.emit();
        }
      });
    } else {
      this.closeModal.emit();
    }
  }
}
