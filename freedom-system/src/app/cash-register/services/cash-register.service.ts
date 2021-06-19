import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, retry } from "rxjs/operators";
import {
  AngularFirestoreCollection,
  AngularFirestore,
} from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
import { Day } from "../classes/day";

interface IDay {
  _id: string;
  date: string;
}

interface IDaysListingData {
  year: string;
  month: string;
  days: IDay[];
}

let currentDate = new Date();
currentDate.setDate(currentDate.getDate() - 1);
@Injectable({
  providedIn: "root",
})
export class CashRegisterService {
  private daysCollection: AngularFirestoreCollection<Day>;

  constructor(private afs: AngularFirestore, public afAuth: AngularFireAuth) {
    this.reloadCashRegisterDaysCollection();
  }

  getCashRegisterDays$(): Observable<Day[]> {
    this.reloadCashRegisterDaysCollection();
    const cashRegisterDays = this.daysCollection.snapshotChanges().pipe(
      retry(3),
      map((actions) =>
        actions
          .filter((a) => {
            return a.payload.doc.data().date.toDate() <= currentDate;
          })
          .map((a) => {
            const _id = a.payload.doc.id;
            const data = a.payload.doc.data() as Day;
            return { _id, ...data };
          })
      ),
      map(this.extractData)
    );
    return cashRegisterDays;
  }

  private extractData(data: any) {
    let newDaysArray = [];

    const isPresent = (day, selectedDay) =>
      day.year === selectedDay.getFullYear() &&
      day.month === selectedDay.getMonth();

    data.forEach((day) => {
      const selected = day.date.toDate();
      const addedMonth = newDaysArray.find((newDay) =>
        isPresent(newDay, selected)
      );
      if (addedMonth) {
        addedMonth.days.push({ _id: day._id, date: day.date.toDate() });
        addedMonth.days.sort(function (a, b) {
          return +new Date(a.date) - +new Date(b.date);
        });
      } else {
        const newDay = {
          year: day.date.toDate().getFullYear(),
          month: day.date.toDate().getMonth(),
          days: [{ _id: day._id, date: day.date.toDate() }],
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
