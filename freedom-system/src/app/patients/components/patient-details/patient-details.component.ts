import { Component, OnInit, Input } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { Patient } from "../../../patients/classes/patient";
import { PatientService } from "../../../patients/services/patient.service";
import { AlertService } from "../../../core/services/alert/alert.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ApplicationStateService } from "../../../core/services/aplication-state/aplication-state.service";

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
  @Input() editionMode: Boolean;
  openConfirmation: Boolean;

  constructor(
    private route: ActivatedRoute,
    private aplicationStateService: ApplicationStateService,
    private router: Router,
    private fb: FormBuilder,
    private patientService: PatientService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService
  ) {
    this.openConfirmation = false;
  }

  ngOnInit() {
    this.mobileView = this.aplicationStateService.getIsMobileResolution();
    this.patientId = this.route.snapshot.paramMap.get("id");
    this.patient = new Patient();
    this.editionMode = !this.patientId;
    this.setFormValues();
    if (this.patientId) {
      this.spinner.show();
      this.patientService.getPatientData$(this.patientId).subscribe(
        (response) => {
          this.patient = response;
          this.setFormValues(
            this.patient.name,
            this.patient.lastName,
            this.patient.age,
            this.patient.phone,
            this.patient.medicines,
            this.patient.allergies,
            this.patient.moles,
            this.patient.bodyMetals,
            this.patient.tattoos,
            this.patient.skinCancer,
            this.patient.epilepsy,
            this.patient.pregnant,
            this.patient.previousTreatment,
            this.patient.nextSession
          );
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

  private setFormValues(
    name = null,
    lastName = null,
    age = null,
    phone = null,
    medicines = null,
    allergies = null,
    moles = null,
    bodyMetals = null,
    tattoos = null,
    skinCancer = false,
    epilepsy = false,
    pregnant = false,
    previousTreatment = null,
    nextAppointment = null
  ): void {
    this.patientForm = this.fb.group({
      patientName: new FormControl(
        { value: name, disabled: !this.editionMode },
        Validators.required
      ),
      patientLastName: new FormControl(
        { value: lastName, disabled: !this.editionMode },
        Validators.required
      ),
      patientAge: new FormControl(
        { value: age, disabled: !this.editionMode },
        Validators.required
      ),
      patientPhone: new FormControl(
        { value: phone, disabled: !this.editionMode },
        Validators.required
      ),
      patientMedicines: new FormControl({
        value: medicines,
        disabled: !this.editionMode,
      }),
      patientAllergies: new FormControl({
        value: allergies,
        disabled: !this.editionMode,
      }),
      patientMoles: new FormControl({
        value: moles,
        disabled: !this.editionMode,
      }),
      patientBodyMetals: new FormControl({
        value: bodyMetals,
        disabled: !this.editionMode,
      }),
      patientTattoos: new FormControl({
        value: tattoos,
        disabled: !this.editionMode,
      }),
      patientSkinCancer: new FormControl({
        value: skinCancer,
        disabled: !this.editionMode,
      }),
      patientEpilepsy: new FormControl({
        value: epilepsy,
        disabled: !this.editionMode,
      }),
      patientPregnant: new FormControl({
        value: pregnant,
        disabled: !this.editionMode,
      }),
      patientPreviousTreatment: new FormControl({
        value: previousTreatment,
        disabled: !this.editionMode,
      }),
      patientNextAppointment: new FormControl({
        value: nextAppointment,
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
    this.patientForm
      .get("patientNextAppointment")
      .valueChanges.subscribe((val) => {
        this.patient.nextSession = val;
      });
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

  cancelEdition(formDirty) {
    this.openConfirmation = formDirty;
    if (!formDirty) {
      this.router.navigate(["/patients"]);
    }
  }

  confirmCancelation() {
    this.router.navigate(["/patients"]);
  }
}
