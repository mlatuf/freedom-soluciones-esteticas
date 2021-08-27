import { Injectable } from "@angular/core";
import { Observable, from } from "rxjs";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
import { Patient } from "../models/patient";
import { map } from "rxjs/operators";
import { AppointmentPatient } from "../models/appointment-patient";

@Injectable({
  providedIn: "root",
})
export class PatientService {
  private patientsCollection: AngularFirestoreCollection<Patient>;
  private patientDoc: AngularFirestoreDocument<Patient>;

  constructor(private afs: AngularFirestore) {
    this.patientsCollection = this.afs.collection<Patient>("patients");
  }

  getPatients$(): Observable<Patient[]> {
    return this.patientsCollection.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
          const data = a.payload.doc.data() as Patient;
          const _id = a.payload.doc.id;
          const fullName =
            a.payload.doc.data().name + " " + a.payload.doc.data().lastName;
          return { _id, fullName, ...data };
        })
      )
    );
  }

  getPatientData$(patientId: string): Observable<Patient> {
    this.patientDoc = this.afs.doc<Patient>("patients/" + patientId);
    return this.patientDoc.snapshotChanges().pipe(
      map((a) => {
        const data = a.payload.data() as Patient;
        const _id = a.payload.id;
        return { _id, ...data };
      })
    );
  }

  getPatientHistory$(patientId: string): Observable<AppointmentPatient[]> {
    this.patientDoc = this.afs.doc<Patient>("patients/" + patientId);
    return this.patientDoc
      .collection<AppointmentPatient>("appointments")
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as AppointmentPatient;
            const _id = a.payload.doc.id;
            return { _id, ...data };
          })
        )
      );
  }

  savePatient$(patient: Patient): Observable<any> {
    if (patient._id) {
      this.patientDoc = this.afs.doc<Patient>("patients/" + patient._id);
      delete patient._id;
      return from(this.patientDoc.update(patient));
    }
    return from(this.patientsCollection.add({ ...patient }));
  }

  deletePatient$(patientId: string): Observable<any> {
    this.patientDoc = this.afs.doc<Patient>("patients/" + patientId);
    return from(this.patientDoc.delete());
  }
}
