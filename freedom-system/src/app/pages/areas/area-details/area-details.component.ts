import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';

import { Area } from '../../../classes/area/area';

import { AreaService } from '../../../shared/area/area.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from '../../../shared/alert/alert.service';

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

  constructor(private areaService: AreaService, private spinner: NgxSpinnerService, 
    private alertService: AlertService) {
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
    if (this.areaId != 0) {
      this.spinner.show();
      this.areaService.getAreaData$(this.areaId).subscribe(
        response => {
          this.areaModel = response;
          this.spinner.hide();
        },
        error => {
          this.spinner.hide();
          this.alertService.error(error);
        }
      );
    }
  }

  onChange(event) {
    this.areaModel.duration = event;
  }

  onSubmit() {
    this.spinner.show();
    this.areaService.saveArea$(this.areaModel).subscribe(
      response => {
        this.areaModel = response;
        this.spinner.hide();
        this.closeModal.emit();
        this.alertService.success("Zona creada con éxito");      
      },
      error => {
        this.spinner.hide();
        this.closeModal.emit();
        this.alertService.error(error);
      }
    );
  }

  cancelEditionModal(formDirty : Boolean) {
    this.openConfirmation = formDirty;
    if (!formDirty) {
      this.closeModal.emit();
    }
  }
}
