import { Injectable } from "@angular/core";
import { Observable, from } from "rxjs";
import { map, retry } from "rxjs/operators";

import { Appointment } from "src/app/appointments/classes/appointment";

import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from "@angular/fire/firestore";

@Injectable({
  providedIn: "root"
})
export class AppointmentService {

  private appointmentsCollection: AngularFirestoreCollection<Appointment>;
  private appointmentDoc: AngularFirestoreDocument<Appointment>;

  constructor(private afs: AngularFirestore) {}

  getAppointments$(selectedDay: any): Observable<Appointment[]> {
    this.appointmentsCollection = this.afs.collection<Appointment>("appointments", ref =>
      ref.where("day", "==", selectedDay)
    );
    return this.appointmentsCollection.snapshotChanges().pipe(
      retry(3),
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Appointment;
        const _id = a.payload.doc.id;
        return { _id, ...data };
      }))
    );
  }

  getAppointmentData$(appointmentId: string): Observable<any> {
    this.appointmentDoc = this.afs.doc<Appointment>('appointments/'+ appointmentId);
    return this.appointmentDoc.snapshotChanges().pipe(
      retry(3),
      map(a => {
        const data = a.payload.data() as Appointment;
        const _id = a.payload.id;
        return { _id, ...data };
      })
    );
  }

  saveAppointment$(appointment: Appointment, dayId: string): Observable<any> {
    this.appointmentsCollection = this.afs.collection<Appointment>("appointments", ref =>
      ref.where("day", "==", dayId)
    );
    if (appointment._id) {
      this.appointmentDoc = this.afs.doc<Appointment>('/appointments/' + appointment._id);
      delete appointment._id;
      return from(this.appointmentDoc.update(appointment))
    }
    appointment.status = 1;
    return from(this.appointmentsCollection.add({...appointment}));
  }

  deleteAppointment$(appointmentId: string): Observable<any> {
    const appointmentDoc = this.afs.doc<Appointment>('appointments/'+ appointmentId);
    return from(appointmentDoc.delete());
  }

  getInitialTimes$(appointments: Appointment[], currentAppointment: string): number[] {
    let initialTimes = Array.from(Array(52).keys());
    //to not take in consideration the currentAppointment
    const busyAppointments = currentAppointment ? appointments.filter(obj => obj._id != currentAppointment) : appointments;
    if (busyAppointments) {
      busyAppointments.forEach((appointment) => {
        const duration = appointment.areas.reduce((acc, area) => area.duration, 0);
        initialTimes.splice(appointment.time, duration);
      });
    }
    return initialTimes;
  }

  updateAvailableTimes$(duration: number, availableTimes: number[]): number[] {
    let availableTimesUpdated = [];
    for (let index = 0; index < availableTimes.length - duration; index++) {
      let possibleTime = true;
      for (let pos = index; possibleTime && pos < index + duration - 1; pos++) {
        possibleTime =
          availableTimes[pos + 1] === availableTimes[pos] + 1;
      }
      if (possibleTime) {
        availableTimesUpdated.push(availableTimes[index]);
      }
    }
    return availableTimesUpdated;
  }
}
