import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { Observable, from } from "rxjs";
import { Calendar } from "../classes/calendar";
import { map, retry, catchError } from "rxjs/operators";
import { Day } from "../classes/day";
import {
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  AngularFirestore
} from "@angular/fire/firestore";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: "my-auth-token"
  })
};

let currentDate = new Date();
currentDate.setDate(currentDate.getDate() - 1); 
@Injectable({
  providedIn: "root"
})
export class CalendarService {
  private daysCollection: AngularFirestoreCollection<Day>;
  private daysHistoryCollection: AngularFirestoreCollection<Day>;
  private dayDoc: AngularFirestoreDocument<Day>;

  constructor(private _http: Http, private afs: AngularFirestore) {
    this.daysCollection = this.afs.collection<Day>("days", ref =>
      ref.where("date", ">=", currentDate).orderBy('date')
    );
    this.daysHistoryCollection = this.afs.collection<Day>("days", ref =>
    ref.where("date", "<", currentDate).orderBy('date')
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
    this.dayDoc = this.afs.doc<Day>('days/' + dayId);
    return this.dayDoc.snapshotChanges().pipe(
      map(a => {
        const data = a.payload.data() as Day;
        const _id = a.payload.id;
        return { _id, ...data };
      })
    );
  }
  getDaysList$(): Observable<any> {
    return this._http.get(`https://api.myjson.com/bins/10tcg4`).pipe(
      retry(3),
      map(this.extractDaysList),
      catchError(this.handleError)
    );
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

  saveDate$(newDate: Date): Observable<any> {
    let date = new Date(newDate);
    const _id = this.afs.createId();
    const item  = { date };
    return from(this.daysCollection.doc(_id).set(item));
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
        addedMonth[0].days.push(day.date.toDate());
        addedMonth[0].days.sort(function(a, b) {
          return +new Date(a) - +new Date(b);
        });
      } else {
        let newDay = {
          year: day.date.toDate().getFullYear(),
          month: day.date.toDate().getMonth(),
          days: [{_id: day._id, date:day.date.toDate()}]
        };
        newDaysArray.push(newDay);
      }
    });
    return newDaysArray;
  }

  private extractDaysList(res: Response) {
    let body = res.json();

    let daysArray = Object.keys(body).map(function(k) {
      return body[k];
    });
    let newDaysArray = [];
    if (daysArray[1].length > 0) {
      //Sort the response by date
      //TODO do this sort on Backend
      daysArray[1].sort(function(a, b) {
        return +new Date(a.date) - +new Date(b.date);
      });

      daysArray[1].forEach(day => {
        let newDay = {
          _id: day.date,
          date: new Date(day.date)
        };
        newDaysArray.push(newDay);
      });
    }
    return newDaysArray;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMsg: string;
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      (errorMsg = "An error occurred:"), error.error.message;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMsg =
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`;
    }
    // return an observable with a user-facing error message
    return Observable.throw(errorMsg);
  }
}
