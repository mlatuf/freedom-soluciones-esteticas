import { Component, OnInit } from '@angular/core';

import { Area } from '../classes/area';
import { AreaService } from '../services/area.service';
import { AlertService } from '../../core/services/alert/alert.service'
import { NgxSpinnerService } from 'ngx-spinner';
import { ApplicationStateService } from '../../core/services/aplication-state/aplication-state.service';
 

@Component({
  selector: 'areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.scss']
})
export class AreasComponent implements OnInit {

  pageTitle: string;
  areas: Area[];
  openConfirmation: Boolean;
  openEditionModal: Boolean;
  areaSelectedToDelete: number;
  areaSelectedToEdit: number;
  areaNameSelected: string;
  mobileView: boolean;

  constructor(private aplicationStateService: ApplicationStateService, 
    private areaService: AreaService, 
    private spinner: NgxSpinnerService, 
    private alertService: AlertService) {
    this.openConfirmation = this.openEditionModal = false;
    
  }
  
  ngOnInit() {
    this.mobileView = this.aplicationStateService.getIsMobileResolution();
    this.areas = [];
    this.getAreaList();
  }

  private getAreaList() {    
    this.spinner.show();
    this.areaService.getAreas$().subscribe(
      response => {
        this.areas = response;
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        this.alertService.error(error);
      }
    );
  }

  deleteArea(areaId: number, areaName: string) {
    this.areaSelectedToDelete = areaId;
    this.areaNameSelected = areaName;
    this.openConfirmation = true;
  }

  confirmDeleteArea() {
    this.openConfirmation = false;
    this.spinner.show();    
    this.areaService.deleteArea$(this.areaSelectedToDelete).subscribe(
      response => {
        this.spinner.hide();
        this.alertService.success("Zona eliminada con exito");
        this.getAreaList();
      },
      error => {
        this.spinner.hide();
        this.alertService.error(error);
      }
    );
  }

  showAreaModal(areaId: number) {
    this.areaSelectedToEdit = areaId;
    this.openEditionModal = true;
  }

  onCloseModal() {
    this.openEditionModal = !this.openEditionModal;
    this.areaSelectedToEdit = this.areaSelectedToDelete = null;
    this.areaNameSelected = '';
    this.getAreaList();
  }

}
