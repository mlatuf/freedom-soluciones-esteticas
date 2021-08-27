import { Injectable } from "@angular/core";
import { Observable, from } from "rxjs";
import { map, retry, tap } from "rxjs/operators";

import { Appointment } from "src/app/appointments/models/appointment";
import { Time } from "src/app/appointments/models/time";
import { TimeSlot } from "src/app/appointments/models/timeSlot";

import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";

@Injectable({
  providedIn: "root",
})
export class AppointmentService {
  private appointmentsCollection: AngularFirestoreCollection<Appointment>;
  private appointmentDoc: AngularFirestoreDocument<Appointment>;

  constructor(private afs: AngularFirestore) {}

  getAppointments$(selectedDay: any): Observable<Appointment[]> {
    this.appointmentsCollection = this.afs.collection<Appointment>(
      "appointments",
      (ref) => ref.where("day", "==", selectedDay)
    );
    return this.appointmentsCollection.snapshotChanges().pipe(
      retry(3),
      map((actions) =>
        actions.map((a) => {
          const data = a.payload.doc.data() as Appointment;
          const _id = a.payload.doc.id;
          return { _id, ...data };
        })
      ),
      tap((results) => {
        results.sort(
          (appointmentA, appointmentB) => appointmentA.time - appointmentB.time
        );
      })
    );
  }

  getAppointmentData$(appointmentId: string): Observable<any> {
    this.appointmentDoc = this.afs.doc<Appointment>(
      "appointments/" + appointmentId
    );
    return this.appointmentDoc.snapshotChanges().pipe(
      retry(3),
      map((a) => {
        const data = a.payload.data() as Appointment;
        const _id = a.payload.id;
        return { _id, ...data };
      })
    );
  }

  saveAppointment$(appointment: Appointment, dayId: string): Observable<any> {
    this.appointmentsCollection = this.afs.collection<Appointment>(
      "appointments",
      (ref) => ref.where("day", "==", dayId)
    );
    if (appointment._id) {
      this.appointmentDoc = this.afs.doc<Appointment>(
        "/appointments/" + appointment._id
      );
      delete appointment._id;
      return from(this.appointmentDoc.update(appointment));
    }
    appointment.status = 1;
    return from(this.appointmentsCollection.add({ ...appointment }));
  }

  deleteAppointment$(appointmentId: string): Observable<any> {
    const appointmentDoc = this.afs.doc<Appointment>(
      "appointments/" + appointmentId
    );
    return from(appointmentDoc.delete());
  }
}
