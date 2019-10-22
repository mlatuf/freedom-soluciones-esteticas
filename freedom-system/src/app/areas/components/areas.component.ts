import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatSnackBar } from '@angular/material';

import { Area } from '../classes/area';
import { AreaService } from '../services/area.service';
import { AlertService } from '../../core/services/alert/alert.service'
import { NgxSpinnerService } from 'ngx-spinner';
import { ApplicationStateService } from '../../core/services/aplication-state/aplication-state.service';
import { ModalComponent } from 'src/app/core/components/modal/modal.component';
import { ErrorService } from 'src/app/core/services/alert/error.service';

@Component({
  selector: 'areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.scss']
})
export class AreasComponent implements OnInit {

  pageTitle: string;
  areas: Area[];
  openEditionModal: Boolean;
  areaSelectedToDelete: number;
  areaSelectedToEdit: number;
  areaNameSelected: string;
  mobileView: boolean;

  displayedColumns: string[] = ['description', 'price', 'duration', 'actions'];
  dataSource: MatTableDataSource<Area>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private aplicationStateService: ApplicationStateService, 
    private areaService: AreaService, 
    private spinner: NgxSpinnerService, 
    private errorService: ErrorService,
    public dialog: MatDialog,
    private _snackbar: MatSnackBar) {
    this.openEditionModal = false;  
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
        const dialogRef = this.dialog.open(ModalComponent, {
          data: {
            title: 'Ops! Al parecer tenemos problemas', 
            text: this.errorService.getErrorText(error),
            hasError: true
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if(result) {
            console.log(result);
          }
        });
      }
    );
  }

  deleteArea(areaId: number, areaName: string) {
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
        this._snackbar.open("Zona eliminada con exito","OK", {
          duration: 2000,
          panelClass: 'snackbar-container'
        });
        this.getAreaList();
      },
      error => {
        this.spinner.hide();
        const dialogRef = this.dialog.open(ModalComponent, {
          data: {
            title: 'Ops! Al parecer tenemos problemas', 
            text: this.errorService.getErrorText(error),
            hasError: true
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if(result) {
            console.log(result);
          }
        });
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
