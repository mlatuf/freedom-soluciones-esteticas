import { Injectable } from "@angular/core";
import { Observable, from } from "rxjs";
import { map, retry } from "rxjs/operators";
import { Day } from "../classes/day";
import {
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  AngularFirestore,
} from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";

let currentDate = new Date();
currentDate.setDate(currentDate.getDate() - 1);
@Injectable({
  providedIn: "root",
})
export class CalendarService {
  private daysCollection: AngularFirestoreCollection<Day>;
  private dayDoc: AngularFirestoreDocument<Day>;

  constructor(private afs: AngularFirestore, public afAuth: AngularFireAuth) {
    this.reloadCalendarCollection();
  }

  getCalendar$(): Observable<Day[]> {
    this.reloadCalendarCollection();
    let calendar = this.daysCollection.snapshotChanges().pipe(
      retry(3),
      map((actions) =>
        actions
          .filter((a) => {
            return a.payload.doc.data().date.toDate() >= currentDate;
          })
          .map((a) => {
            const _id = a.payload.doc.id;
            const data = a.payload.doc.data() as Day;
            return { _id, ...data };
          })
      ),
      map(this.extractData)
    );
    return calendar;
  }

  getDayToAppointment$(dayId: string): Observable<Day> {
    this.reloadCalendarCollection();
    this.dayDoc = this.afs.doc<Day>("days/" + dayId);
    return this.dayDoc.snapshotChanges().pipe(
      map((a) => {
        const data = a.payload.data() as Day;
        const _id = a.payload.id;
        return { _id, ...data };
      })
    );
  }

  getDaysList$(): Observable<Day[]> {
    this.reloadCalendarCollection();
    let calendar = this.daysCollection.snapshotChanges().pipe(
      retry(3),
      map((actions) =>
        actions
          .filter((a) => {
            return a.payload.doc.data().date.toDate() > currentDate;
          })
          .map((a) => {
            const _id = a.payload.doc.id;
            const data = a.payload.doc.data() as Day;
            return { _id, ...data };
          })
      )
    );
    return calendar;
  }

  getCalendarHistory$(): Observable<Day[]> {
    this.reloadCalendarCollection();
    let calendar = this.daysCollection.snapshotChanges().pipe(
      retry(3),
      map((actions) =>
        actions
          .filter((a) => {
            return a.payload.doc.data().date.toDate() < currentDate;
          })
          .map((a) => {
            const _id = a.payload.doc.id;
            const data = a.payload.doc.data() as Day;
            return { _id, ...data };
          })
      ),
      map(this.extractData)
    );
    return calendar;
  }

  saveDate$(newDate: Day): Observable<any> {
    let toDate = new Date(newDate.date);
    newDate.date = toDate;
    newDate.uid = this.afAuth.auth.currentUser.uid;
    return from(this.daysCollection.add({ ...newDate }));
  }

  private extractData(data: any) {
    let newDaysArray = [];
    data.forEach((day) => {
      let addedMonth = newDaysArray.filter((obj) => {
        let selected = day.date.toDate();
        return (
          obj.year === selected.getFullYear() &&
          obj.month === selected.getMonth()
        );
      });
      if (addedMonth.length > 0) {
        addedMonth[0].days.push({ _id: day._id, date: day.date.toDate() });
        addedMonth[0].days.sort(function (a, b) {
          return +new Date(a.date) - +new Date(b.date);
        });
      } else {
        let newDay = {
          year: day.date.toDate().getFullYear(),
          month: day.date.toDate().getMonth(),
          days: [{ _id: day._id, date: day.date.toDate() }],
        };
        newDaysArray.push(newDay);
      }
    });
    return newDaysArray;
  }

  private reloadCalendarCollection(): void {
    this.daysCollection = this.afs.collection<Day>("days", (ref) =>
      ref.where("uid", "==", this.afAuth.auth.currentUser.uid).orderBy("date")
    );
  }

  deleteCalendarDay$(dayId: string): Observable<any> {
    this.dayDoc = this.afs.doc<Day>("days/" + dayId);
    return from(this.dayDoc.delete());
  }
}
