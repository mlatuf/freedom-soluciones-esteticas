import { Component, Input, OnChanges, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { Area } from "../../models/area";

import { AreaService } from "../../services/area.service";
import { NgxSpinnerService } from "ngx-spinner";
import { AlertService } from "../../../core/services/alert/alert.service";
import { MatDialog } from "@angular/material";
import { ModalComponent } from "src/app/core/components/modal/modal.component";

export interface ModalData {
  title: String;
  areaId: number;
}

@Component({
  selector: "area-details",
  templateUrl: "./area-details.component.html",
  styleUrls: ["./area-details.component.scss"],
})
export class AreaDetailsComponent implements OnInit {
  areaId: string;
  areaModel: Area;
  durationsArray: Array<any>;
  openConfirmation: Boolean;
  areaForm: FormGroup = null;
  mobileView: Boolean;
  @Input() editionMode: Boolean;

  constructor(
    private areaService: AreaService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.durationsArray = [
      { id: 0, description: "0 minutos" },
      { id: 1, description: "15 minutos" },
      { id: 2, description: "30 minutos" },
      { id: 3, description: "45 minutos" },
      { id: 4, description: "60 minutos" },
    ];
    this.openConfirmation = false;
  }

  ngOnInit() {
    this.areaId = this.route.snapshot.paramMap.get("id");
    this.editionMode = !this.areaId;
    this.areaModel = new Area();
    if (this.areaId) {
      this.spinner.show();
      this.areaService.getAreaData$(this.areaId).subscribe(
        (response) => {
          this.areaModel = response;
          this.setFormValues(
            this.areaModel.description,
            this.areaModel.price,
            this.areaModel.duration
          );
          this.spinner.hide();
        },
        (error) => {
          this.spinner.hide();
          this.alertService.error(error);
        }
      );
    } else {
      this.setFormValues(
        this.areaModel.description,
        this.areaModel.price,
        this.areaModel.duration
      );
    }
  }

  private setFormValues(description = "", price = null, duration = null) {
    this.areaForm = this.fb.group({
      areaDescription: new FormControl(
        { value: description, disabled: !this.editionMode },
        Validators.required
      ),
      areaPrice: new FormControl(
        { value: price, disabled: !this.editionMode },
        Validators.required
      ),
      areaDuration: new FormControl(
        { value: duration, disabled: !this.editionMode },
        Validators.required
      ),
    });
  }

  toggleEditionMode(): void {
    this.editionMode = !this.editionMode;
    if (this.editionMode) {
      this.areaForm.enable();
    } else {
      this.areaForm.disable();
    }
  }

  onChange(event) {
    this.areaModel.duration = event;
  }

  onSubmit() {
    this.spinner.show();
    this.areaModel.description = this.areaForm.get("areaDescription").value;
    this.areaModel.price = this.areaForm.get("areaPrice").value;
    this.areaModel.duration = this.areaForm.get("areaDuration").value;
    this.areaService.saveArea$(this.areaModel).subscribe(
      (response) => {
        this.spinner.hide();
        this.alertService.success("Zona guardada con éxito");
        this.router.navigate(["/areas"]);
      },
      (error) => {
        this.spinner.hide();
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
          isConfirmationModal: true,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.router.navigate(["/areas"]);
        }
      });
    } else {
      this.router.navigate(["/areas"]);
    }
  }
}
