import { Component, OnInit, Input } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { MatDialog } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";

import { Patient } from "../../models/patient";
import { PatientService } from "../../../patients/services/patient.service";
import { AlertService } from "../../../core/services/alert/alert.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ApplicationStateService } from "../../../core/services/aplication-state/aplication-state.service";
import { ModalComponent } from "src/app/core/components/modal/modal.component";
import { getMonthByKey, getMonths } from "src/app/core/constants/months.enum";
import { Month } from "src/app/core/models/month";

@Component({
  selector: "patient-details",
  templateUrl: "./patient-details.component.html",
  styleUrls: ["./patient-details.component.scss"],
})
export class PatientDetailsComponent implements OnInit {
  mobileView: Boolean;
  patient: Patient;
  patientId: string;
  patientForm: FormGroup = null;
  months: Month[];
  years: Number[];
  @Input() editionMode: Boolean;

  constructor(
    private route: ActivatedRoute,
    private aplicationStateService: ApplicationStateService,
    private router: Router,
    private fb: FormBuilder,
    private patientService: PatientService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.mobileView = this.aplicationStateService.getIsMobileResolution();
    this.patientId = this.route.snapshot.paramMap.get("id");
    this.patient = new Patient();
    this.editionMode = !this.patientId;
    this.months = getMonths();
    this.years = [new Date().getFullYear(), new Date().getFullYear() + 1];

    this.setFormValues();
    if (this.patientId) {
      this.spinner.show();
      this.patientService.getPatientData$(this.patientId).subscribe(
        (response) => {
          this.patient = response;
          this.setFormValues();
          this.spinner.hide();
        },
        (error) => {
          this.spinner.hide();
          this.alertService.error(error);
        }
      );
    }
  }

  public toggleEditionMode(): void {
    this.editionMode = !this.editionMode;
    if (this.editionMode) {
      this.patientForm.enable();
    } else {
      this.patientForm.disable();
    }
  }

  private setFormValues(): void {
    const nextSessionDate = this.patient.nextSession
      ? new Date(this.patient.nextSession)
      : new Date();
    const nextSessionMonth = getMonthByKey(
      nextSessionDate.getMonth() + 1
    ).label;
    const nextSessionYear = nextSessionDate.getFullYear();

    this.patientForm = this.fb.group({
      patientName: new FormControl(
        { value: this.patient.name || null, disabled: !this.editionMode },
        Validators.required
      ),
      patientLastName: new FormControl(
        { value: this.patient.lastName || null, disabled: !this.editionMode },
        Validators.required
      ),
      patientAge: new FormControl(
        { value: this.patient.age || null, disabled: !this.editionMode },
        Validators.required
      ),
      patientPhone: new FormControl(
        { value: this.patient.phone || null, disabled: !this.editionMode },
        Validators.required
      ),
      patientMedicines: new FormControl({
        value: this.patient.medicines || null,
        disabled: !this.editionMode,
      }),
      patientAllergies: new FormControl({
        value: this.patient.allergies || null,
        disabled: !this.editionMode,
      }),
      patientMoles: new FormControl({
        value: this.patient.moles || null,
        disabled: !this.editionMode,
      }),
      patientBodyMetals: new FormControl({
        value: this.patient.bodyMetals || null,
        disabled: !this.editionMode,
      }),
      patientTattoos: new FormControl({
        value: this.patient.tattoos || null,
        disabled: !this.editionMode,
      }),
      patientSkinCancer: new FormControl({
        value: this.patient.skinCancer || null,
        disabled: !this.editionMode,
      }),
      patientEpilepsy: new FormControl({
        value: this.patient.epilepsy || null,
        disabled: !this.editionMode,
      }),
      patientPregnant: new FormControl({
        value: this.patient.pregnant || null,
        disabled: !this.editionMode,
      }),
      patientPreviousTreatment: new FormControl({
        value: this.patient.previousTreatment || null,
        disabled: !this.editionMode,
      }),
      patientNextSessionYear: new FormControl({
        value: nextSessionYear,
        disabled: !this.editionMode,
      }),
      patientNextSessionMonth: new FormControl({
        value: nextSessionMonth,
        disabled: !this.editionMode,
      }),
    });

    this.onChangesForm();
  }

  private onChangesForm(): void {
    this.patientForm.get("patientName").valueChanges.subscribe((val) => {
      this.patient.name = val;
    });
    this.patientForm.get("patientLastName").valueChanges.subscribe((val) => {
      this.patient.lastName = val;
    });
    this.patientForm.get("patientAge").valueChanges.subscribe((val) => {
      this.patient.age = val;
    });
    this.patientForm.get("patientPhone").valueChanges.subscribe((val) => {
      this.patient.phone = val;
    });
    this.patientForm.get("patientMedicines").valueChanges.subscribe((val) => {
      this.patient.medicines = val;
    });
    this.patientForm.get("patientAllergies").valueChanges.subscribe((val) => {
      this.patient.allergies = val;
    });
    this.patientForm.get("patientBodyMetals").valueChanges.subscribe((val) => {
      this.patient.bodyMetals = val;
    });
    this.patientForm.get("patientMoles").valueChanges.subscribe((val) => {
      this.patient.moles = val;
    });
    this.patientForm.get("patientTattoos").valueChanges.subscribe((val) => {
      this.patient.tattoos = val;
    });
    this.patientForm.get("patientEpilepsy").valueChanges.subscribe((val) => {
      this.patient.epilepsy = val;
    });
    this.patientForm.get("patientSkinCancer").valueChanges.subscribe((val) => {
      this.patient.skinCancer = val;
    });
    this.patientForm.get("patientPregnant").valueChanges.subscribe((val) => {
      this.patient.pregnant = val;
    });
    this.patientForm
      .get("patientPreviousTreatment")
      .valueChanges.subscribe((val) => {
        this.patient.previousTreatment = val;
      });
    if (this.patient.nextSession) {
      this.patientForm
        .get("patientNextSessionYear")
        .valueChanges.subscribe((val) => {
          const month = this.patient.nextSession.split("/")[0];
          this.patient.nextSession = month + "/" + val;
        });
      this.patientForm
        .get("patientNextSessionMonth")
        .valueChanges.subscribe((val) => {
          const year = this.patient.nextSession.split("/")[1];
          this.patient.nextSession = val + "/" + year;
        });
    }
  }

  onSubmit() {
    this.spinner.show();
    this.patientService.savePatient$(this.patient).subscribe(
      (response) => {
        this.patient = response;
        this.spinner.hide();
        this.router.navigate(["/patients"]);
        this.alertService.success("Paciente creado con exito");
      },
      (error) => {
        this.spinner.hide();
        this.alertService.error(error);
      }
    );
  }

  public cancelEdition(formDirty): void {
    if (formDirty) {
      const dialogRef = this.dialog.open(ModalComponent, {
        data: {
          title: "Cancelar edicion",
          text: "Está seguro que desea cancelar la edicion? Se perderán todos los datos no guardados.",
          isConfirmationModal: true,
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.router.navigate(["/patients"]);
        }
      });
    } else {
      this.router.navigate(["/patients"]);
    }
  }
}
