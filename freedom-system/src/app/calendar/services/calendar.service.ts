import { Injectable } from "@angular/core";
import { Observable, from } from "rxjs";
import { map, retry} from "rxjs/operators";
import { Day } from "../classes/day";
import {
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  AngularFirestore
} from "@angular/fire/firestore";

let currentDate = new Date();
currentDate.setDate(currentDate.getDate() - 1);
@Injectable({
  providedIn: "root"
})
export class CalendarService {
  private daysCollection: AngularFirestoreCollection<Day>;
  private daysHistoryCollection: AngularFirestoreCollection<Day>;
  private dayDoc: AngularFirestoreDocument<Day>;

  constructor(private afs: AngularFirestore) {
    this.daysCollection = this.afs.collection<Day>("days", ref =>
      ref.where("date", ">=", currentDate).orderBy("date")
    );
    this.daysHistoryCollection = this.afs.collection<Day>("days", ref =>
      ref.where("date", "<", currentDate).orderBy("date")
    ); 
  }

  getCalendar$(): Observable<Day[]> {
    let calendar = this.daysCollection.snapshotChanges().pipe(
      retry(3),
      map(actions =>
        actions.map(a => {
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
    this.dayDoc = this.afs.doc<Day>("days/" + dayId);
    return this.dayDoc.snapshotChanges().pipe(
      map(a => {
        const data = a.payload.data() as Day;
        const _id = a.payload.id;
        return { _id, ...data };
      })
    );
  }

  getDaysList$(): Observable<Day[]> {
    let calendar = this.daysCollection.snapshotChanges().pipe(
      retry(3),
      map(actions =>
        actions.map(a => {
          const _id = a.payload.doc.id;
          const data = a.payload.doc.data() as Day;
          return { _id, ...data };
        })
      )
    );
    return calendar;
  }

  getCalendarHistory$(): Observable<Day[]> {
    let calendar = this.daysHistoryCollection.snapshotChanges().pipe(
      retry(3),
      map(actions =>
        actions.map(a => {
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
    return from(this.daysCollection.add({ ...newDate }));
  }

  private extractData(data: any) {
    let newDaysArray = [];
    data.forEach(day => {
      let addedMonth = newDaysArray.filter(obj => {
        let selected = day.date.toDate();
        return (
          obj.year === selected.getFullYear() &&
          obj.month === selected.getMonth()
        );
      });
      if (addedMonth.length > 0) {
        addedMonth[0].days.push({_id: day._id, date:day.date.toDate()});
        addedMonth[0].days.sort(function(a, b) {
          return +new Date(a.date) - +new Date(b.date);
        });
      } else {
        let newDay = {
          year: day.date.toDate().getFullYear(),
          month: day.date.toDate().getMonth(),
          days: [{ _id: day._id, date: day.date.toDate() }]
        };
        newDaysArray.push(newDay);
      }
    });
    return newDaysArray;
  }

}
