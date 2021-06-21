import { Injectable } from "@angular/core";
import { from, Observable } from "rxjs";
import { map, retry } from "rxjs/operators";
import {
  AngularFirestoreCollection,
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
import { Day, Movement } from "../classes";

interface IDay {
  _id: string;
  date: any;
}

let currentDate = new Date();
currentDate.setDate(currentDate.getDate() - 1);
@Injectable({
  providedIn: "root",
})
export class CashRegisterService {
  private daysCollection: AngularFirestoreCollection<Day>;
  private movementsCollection: AngularFirestoreCollection<Movement>;

  private movementDoc: AngularFirestoreDocument<Movement>;

  constructor(private afs: AngularFirestore, public afAuth: AngularFireAuth) {
    this.reloadCashRegisterDaysCollection();
  }

  getCashRegisterDays$(): Observable<Day[]> {
    this.reloadCashRegisterDaysCollection();
    const cashRegisterDays: Observable<Day[]> = this.daysCollection
      .snapshotChanges()
      .pipe(
        retry(3),
        map((actions) =>
          actions
            .filter((a) => {
              return a.payload.doc.data().date.toDate() <= currentDate;
            })
            .map((a) => {
              const _id = a.payload.doc.id;
              const data = a.payload.doc.data() as IDay;
              return { _id, ...data };
            })
        ),
        map(this.extractData)
      );
    return cashRegisterDays;
  }

  getMovements$(selectedDay: string): Observable<Movement[]> {
    this.movementsCollection = this.afs.collection<Movement>(
      "cash-movements",
      (ref) => ref.where("day", "==", selectedDay)
    );
    return this.movementsCollection.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
          const data = a.payload.doc.data() as Movement;
          const _id = a.payload.doc.id;
          return { _id, ...data };
        })
      )
    );
  }

  saveMovement$(movement: Movement) {
    if (movement._id) {
      this.movementDoc = this.afs.doc<Movement>(
        "cash-movements/" + movement._id
      );
      delete movement._id;
      return from(this.movementDoc.update(movement));
    }
    return from(this.movementsCollection.add({ ...movement }));
  }

  private extractData(data: any): Day[] {
    let newDaysArray = [];

    const isPresent = (day, selectedDay) =>
      day.year === selectedDay.toDate().getFullYear() &&
      day.month === selectedDay.toDate().getMonth();

    data.forEach((day) => {
      const selected = day.date;
      const addedMonth = newDaysArray.find((newDay) =>
        isPresent(newDay, selected)
      );
      if (addedMonth) {
        addedMonth.days.push({
          _id: day._id,
          date: day.date.toDate().getDate(),
        });
        addedMonth.days.sort(function (a, b) {
          return +new Date(a.date) - +new Date(b.date);
        });
      } else {
        const generatedDate = day.date.toDate();
        const newDay = {
          year: generatedDate.getFullYear(),
          month: generatedDate.getMonth(),
          days: [{ _id: day._id, date: generatedDate.getDate() }],
        };
        newDaysArray.push(newDay);
      }
    });
    return newDaysArray;
  }

  private reloadCashRegisterDaysCollection(): void {
    this.daysCollection = this.afs.collection<Day>("days", (ref) =>
      ref.where("uid", "==", this.afAuth.auth.currentUser.uid).orderBy("date")
    );
  }
}
