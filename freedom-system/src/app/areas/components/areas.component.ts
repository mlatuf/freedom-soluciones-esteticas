import { Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { Router } from '@angular/router';

import { Area } from '../classes/area';
import { AreaService } from '../services/area.service';
import { AlertService } from '../../core/services/alert/alert.service'
import { NgxSpinnerService } from 'ngx-spinner';
import { ApplicationStateService } from '../../core/services/aplication-state/aplication-state.service';
import { ModalComponent } from 'src/app/core/components/modal/modal.component';

@Component({
  selector: 'areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.scss']
})
export class AreasComponent implements OnInit {

  pageTitle: string;
  areas: Area[];
  areaSelectedToDelete: string;
  areaSelectedToEdit: number;
  areaNameSelected: string;
  mobileView: boolean;
  showAreaDetails: boolean = false;

  displayedColumns: string[] = ['description', 'price', 'duration', 'actions'];
  dataSource: MatTableDataSource<Area>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private aplicationStateService: ApplicationStateService, 
    private areaService: AreaService, 
    private spinner: NgxSpinnerService, 
    public dialog: MatDialog,
    private router: Router,
    private alertService: AlertService) {  
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
        this.dataSource = new MatTableDataSource(this.areas);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        this.alertService.error(error);
      }
    );
  }

  deleteArea(areaId: string, areaName: string) {
    this.areaSelectedToDelete = areaId;
    this.areaNameSelected = areaName;
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        title: 'Eliminar zona ' + this.areaNameSelected, 
        text: "Esta seguro que desea eliminar la zona ?",
        isConfirmationModal: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.confirmDeleteArea();
      }
    });
  }

  confirmDeleteArea() {
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

  editArea(areaId: string = null) {
    if (!areaId) {
      this.router.navigate(['/area/details']);
    } else {
      this.router.navigate(['/area/details/', areaId]);
    }
    // this.areaSelectedToEdit = areaId;
    // this.showAreaDetails = true;
  }

  onCloseModal() {
    this.showAreaDetails = false;
    this.areaSelectedToEdit = this.areaSelectedToDelete = null;
    this.areaNameSelected = '';
    this.getAreaList();
  }

}
