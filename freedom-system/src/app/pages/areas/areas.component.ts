import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Area } from '../../classes/area/area';
import { AreaService } from '../../shared/area/area.service';
import { AlertService } from '../../shared/alert/alert.service'
import { NgxSpinnerService } from 'ngx-spinner';

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
  areaSelected: number;
  areaNameSelected: string;
  mobileView: boolean;

  constructor(route: ActivatedRoute, private areaService: AreaService, 
    private spinner:   NgxSpinnerService, private alertService: AlertService) {
    this.pageTitle = route.snapshot.data['title'];
    this.mobileView = (window.screen.width < 576);
    this.openConfirmation = this.openEditionModal = false;
  }

  ngOnInit() {
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
    this.areaSelected = areaId;
    this.areaNameSelected = areaName;
    this.openConfirmation = true;
  }

  confirmDeleteArea() {
    this.openConfirmation = false;
    this.spinner.show();    
    this.areaService.deleteArea$(this.areaSelected).subscribe(
      response => {
        this.spinner.hide();
        this.alertService.success(response);
        this.getAreaList();
      },
      error => {
        this.spinner.hide();
        this.alertService.error(error);
      }
    );
  }

  showAreaModal(areaId: number) {
    this.areaSelected = areaId;
    this.openEditionModal = true;
  }

}
