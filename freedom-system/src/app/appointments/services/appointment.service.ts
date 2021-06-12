import { Injectable } from "@angular/core";
import { Observable, from } from "rxjs";
import { map, retry } from "rxjs/operators";

import { Appointment } from "src/app/appointments/classes/appointment";
import { Time } from "src/app/appointments/classes/time";
import { TimeSlot } from "src/app/appointments/classes/timeSlot";

import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
import { Patient } from "src/app/patients/classes/patient";

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
      )
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

  getInitialTimes$(
    appointments: Appointment[],
    currentAppointment: string
  ): Time[] {
    let initialTimes = [];
    for (let i = 8; i < 21; i++) {
      for (let j = 0; j < 4; j++) {
        initialTimes.push(i + ":" + (j === 0 ? "00" : 15 * j));
      }
    }
    initialTimes = initialTimes.map((value, index) => {
      return {
        _id: index,
        available: true,
        time: value,
      };
    });
    //to not take in consideration the currentAppointment
    const busyAppointments = currentAppointment
      ? appointments.filter((obj) => obj._id != currentAppointment)
      : appointments;
    if (busyAppointments) {
      busyAppointments.forEach((appointment) => {
        const duration = appointment.areas.reduce(
          (acc, area) => acc + area.duration,
          0
        );
        for (let index = 0; index < duration; index++) {
          initialTimes[appointment.time + index].available = false;
        }
      });
    }

    return initialTimes;
  }

  updateAvailableSlots$(
    initialTimes: Time[],
    duration: number = 1
  ): TimeSlot[] {
    let availableTimesUpdated: TimeSlot[] = [];
    let slots = Array.from(Array(initialTimes.length).keys());
    slots.forEach((slotElm, index) => {
      // TODO necesito todos los initialtimes para saber cuales estan available
      if (initialTimes[index].available) {
        let count = 0;
        for (
          let i = index;
          i < slots.length && count < duration && initialTimes[i].available;
          i++
        ) {
          count++;
          if (count === duration) {
            const newSlot = {
              _id: index,
              startTime: initialTimes[slotElm].time,
              slot: initialTimes
                .slice(slotElm, slotElm + duration)
                .map((t) => t._id),
            };
            availableTimesUpdated.push(newSlot);
          }
        }
      }
    });
    return availableTimesUpdated;
  }
}
