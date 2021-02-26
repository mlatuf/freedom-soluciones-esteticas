import { Component, OnInit, ViewChild } from "@angular/core";
import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
  MatDialog,
} from "@angular/material";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";

import { Patient } from "../classes/patient";
import { PatientService } from "../services/patient.service";
import { AlertService } from "src/app/core/services/alert/alert.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ApplicationStateService } from "src/app/core/services/aplication-state/aplication-state.service";
import { ModalComponent } from "src/app/core/components/modal/modal.component";
import { PatientAppointmentHistoryComponent } from "../components/patient-appointment-history/patient-appointment-history.component";

@Component({
  selector: "patients",
  templateUrl: "./patients.component.html",
  styleUrls: ["./patients.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class PatientsComponent implements OnInit {
  mobileView: Boolean;
  patients: Patient[];
  patientSelected: number;
  patientNameSelected: string;

  displayedColumns: string[] = ["fullName", "phone", "nextSession", "actions"];
  displayedMobileColumns: string[] = ["expand", "fullName"];
  dataSource: MatTableDataSource<Patient>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private aplicationStateService: ApplicationStateService,
    private patientService: PatientService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.mobileView = this.aplicationStateService.getIsMobileResolution();
    this.patients = [];
    this.getPatientList();
  }

  private getPatientList() {
    this.spinner.show();
    this.patientService.getPatients$().subscribe(
      (response) => {
        this.patients = response;
        this.dataSource = new MatTableDataSource(this.patients);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
        this.alertService.error(error);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  showHistoryModal(patientId: string) {
    const dialogRef = this.dialog.open(PatientAppointmentHistoryComponent, {
      width: "80%",
      data: {
        title: "Historial de sesiones",
        patientId: patientId,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  deletePatient(patientName: string) {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        title: "Eliminar paciente " + patientName,
        text:
          "Esta seguro que desea eliminar el paciente? Se perderan todos los datos del mismo y su historial de sesiones",
        isConfirmationModal: true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.confirmDeletePatient();
      }
    });
  }

  confirmDeletePatient() {
    this.spinner.show();
    this.patientService.deletePatient$(this.patientSelected).subscribe(
      (response) => {
        this.spinner.hide();
        this.alertService.success("Paciente eliminado con exito");
        this.getPatientList();
      },
      (error) => {
        this.spinner.hide();
        this.alertService.error(error);
      }
    );
  }
}
