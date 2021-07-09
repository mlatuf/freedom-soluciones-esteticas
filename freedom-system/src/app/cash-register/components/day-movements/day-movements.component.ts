import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import {
  MatDialog,
  MatPaginator,
  MatSort,
  MatTableDataSource,
} from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { Movement } from "src/app/cash-register/models/movement";
import { CashRegisterService } from "src/app/cash-register/services/cash-register.service";
import { AlertService } from "src/app/core/services/alert/alert.service";
import { ApplicationStateService } from "src/app/core/services/aplication-state/aplication-state.service";
import { MovementDetailsComponent } from "./movement-details/movement-details.component";
import { ModalComponent } from "src/app/core/components/modal/modal.component";

@Component({
  selector: "app-day-movements",
  templateUrl: "./day-movements.component.html",
  styleUrls: ["./day-movements.component.scss"],
})
export class DayMovementsComponent implements OnInit {
  pageTitle: string;
  movements: Movement[];
  movement: Movement;
  selectedDay: string;
  mobileView: boolean;

  displayedColumns: string[] = ["type", "details", "amount", "actions"];
  dataSource: MatTableDataSource<Movement>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private route: ActivatedRoute,
    private aplicationStateService: ApplicationStateService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private alertService: AlertService,
    private cashRegisterService: CashRegisterService
  ) {}

  ngOnInit() {
    this.mobileView = this.aplicationStateService.getIsMobileResolution();
    this.selectedDay = this.route.snapshot.paramMap.get("day");
    this.movements = [];
    this.movement = new Movement();

    this.getMovementsList();
  }

  private getMovementsList() {
    this.spinner.show();
    this.cashRegisterService.getMovements$(this.selectedDay).subscribe(
      (response) => {
        this.movements = response;
        this.dataSource = new MatTableDataSource(this.movements);
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

  private saveMovement(): void {
    this.spinner.show();
    this.cashRegisterService.saveMovement$(this.movement).subscribe({
      next(response) {
        this.movement = response;
        this.spinner.hide();
      },
      error(error) {
        this.spinner.hide();
        this.alertService.error(error);
      },
    });
  }

  public editMovement(movementId: string = null): void {
    const selectedMovement = this.movements.find(
      (movement) => movement._id === movementId
    );

    const selectedType = selectedMovement
      ? this.isIncome(selectedMovement)
        ? 1
        : 2
      : 1;
    const selectedDetails = selectedMovement ? selectedMovement.details : "";
    const selectedAmount = selectedMovement
      ? Math.abs(selectedMovement.amount)
      : 0;

    const createdAt = selectedMovement
      ? selectedMovement.createdAt
      : new Date();
    const dialogRef = this.dialog.open(MovementDetailsComponent, {
      data: {
        title: "Editar movimiento",
        details: selectedDetails,
        amount: selectedAmount,
        type: selectedType,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.movement.amount =
          result.type === 2
            ? -Math.abs(result.amount)
            : Math.abs(result.amount);
        this.movement.details = result.details;
        this.movement.day = this.selectedDay;
        this.movement.createdAt = createdAt;
        this.saveMovement();
      }
    });
  }

  public deleteMovement(movementId: string): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        title: "Eliminar movimiento",
        text: "Está seguro que desea eliminar el movimiento? Esta accion es irreversible",
        isConfirmationModal: true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.spinner.show();
        this.cashRegisterService.deleteMovement$(movementId).subscribe({
          next(response) {
            this.spinner.hide();
          },
          error(error) {
            this.spinner.hide();
            this.alertService.error(error);
          },
        });
      }
    });
  }

  public isIncome(movement: Movement): boolean {
    return movement.amount >= 0;
  }

  public getTotalAmount(): number {
    return this.movements
      .map((movement) => movement.amount)
      .reduce((accumulator, amount) => accumulator + amount, 0);
  }
}
