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
import { Movement } from "src/app/cash-register/classes/movement";
import { CashRegisterService } from "src/app/cash-register/services/cash-register.service";
import { AlertService } from "src/app/core/services/alert/alert.service";
import { ApplicationStateService } from "src/app/core/services/aplication-state/aplication-state.service";

@Component({
  selector: "app-day-movements",
  templateUrl: "./day-movements.component.html",
  styleUrls: ["./day-movements.component.scss"],
})
export class DayMovementsComponent implements OnInit {
  pageTitle: string;
  movements: Movement[];
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

  public isIncome(movement: Movement): boolean {
    return movement.amount >= 0;
  }

  public getTotalAmount(): number {
    return this.movements
      .map((movement) => movement.amount)
      .reduce((accumulator, amount) => accumulator + amount, 0);
  }
}
