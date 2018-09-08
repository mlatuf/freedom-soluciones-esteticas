import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';
import { HttpHeaders, HttpErrorResponse }       from '@angular/common/http';
import { Observable } from 'rxjs';
import { Calendar }       from '../../classes/calendar/calendar';
import { map, retry, catchError }        from "rxjs/operators";
import { Day } from '../../classes/calendar/day';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Injectable({
  providedIn: 'root'
})

export class CalendarService {

  
  constructor(private _http: Http) { }

  getCalendar$(): Observable<Calendar> {
    return this._http
      .get(`https://api.myjson.com/bins/10tcg4`)
      .pipe(
        retry(3), 
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  getCalendarHistory$(): Observable<Calendar> {
    return this._http
      .get(`https://api.myjson.com/bins/jhmqs`)
      .pipe(
        retry(3), 
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  addDate$(date: Day): Observable<any> {
    return this._http
      .get(`https://api.myjson.com/bins/jhmqs`)
      //TODO correct post method
      // .post(`https://api.myjson.com/bins/jhmqs`, date)
      .pipe(
        retry(3), 
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  private extractData(res: Response) {
    let body = res.json();

    let daysArray = Object.keys(body).map(function(k) { return body[k] });
    let newDaysArray = [];
    if (daysArray[1].length > 0) {
      //Sort the response by date
      //TODO do this sort on Backend
      daysArray[1].sort(function(a,b){
        return +new Date(a.date) - +new Date(b.date);
      });

      daysArray[1].forEach((day) => {
        let addedMonth = newDaysArray.filter((obj) => {
          return ((obj.year === day.year) && (obj.month === day.month)) 
        });
        if (addedMonth.length > 0) {
          addedMonth[0].days.push(new Date(day.date));
          addedMonth[0].days.sort(function(a,b){
            return +new Date(a.date) - +new Date(b.date);
          });
        } else {
          let newDay = {
            'year': day.year,
            'month': day.month,
            'days': [new Date(day.date)]     
          }
          newDaysArray.push(newDay);
        }
      });
    }
    return {'_id': daysArray[0], 'days': newDaysArray};
  }

  private handleError(error: HttpErrorResponse) {

    let errorMsg: string;
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMsg = 'An error occurred:', error.error.message;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMsg =
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`;
    }
    // return an observable with a user-facing error message
    return Observable.throw(errorMsg);
  };

}