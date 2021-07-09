import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource, MatPaginator, MatSort } from "@angular/material";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { AlertService } from "src/app/core/services/alert/alert.service";
import { ApplicationStateService } from "src/app/core/services/aplication-state/aplication-state.service";
import { Day } from "../../models/day";
import { CashRegisterService } from "../../services/cash-register.service";

@Component({
  selector: "cash-register",
  templateUrl: "./cash-register.component.html",
  styleUrls: ["./cash-register.component.scss"],
})
export class CashRegisterComponent implements OnInit {
  mobileView: Boolean;
  cashRegisters: Day[];

  displayedColumns: string[] = ["year", "month", "days"];
  displayedMobileColumns: string[] = ["expand", "year", "month"];
  dataSource: MatTableDataSource<Day>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private router: Router,
    private aplicationState: ApplicationStateService,
    private cashRegisterService: CashRegisterService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.cashRegisters = [];
    this.mobileView = this.aplicationState.getIsMobileResolution();
    this.getCashRegisters();
  }

  private getCashRegisters() {
    this.spinner.show();
    this.cashRegisterService.getCashRegisterDays$().subscribe(
      (response) => {
        this.cashRegisters = response;
        this.dataSource = new MatTableDataSource(this.cashRegisters);
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

  goToDayMovements(day: string): void {
    this.router.navigate(["/day-movements", day]);
  }
}
