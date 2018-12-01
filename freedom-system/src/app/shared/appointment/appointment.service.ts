import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, retry, catchError }        from "rxjs/operators";

import { Appointment }       from '../../classes/appointment/appointment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  
  constructor(private _http: Http) { }

  getAppointments$(day: Date): Observable<Appointment[]> {  
    return this._http
      .get(`https://api.myjson.com/bins/1133ok`)
      .pipe(
        retry(3), 
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  getAppointmentData$(appointmentId: number): Observable<Appointment> {
    return this._http
      .get('https://api.myjson.com/bins/keb7u')
      .pipe(
        retry(3), 
        map((res: any) => res.json()),
        catchError(this.handleError)
      );
  }

  saveAppointment$(appointment: Appointment): Observable<any> {
    return this._http
    //TODO is a post method
    .get('https://api.myjson.com/bins/keb7u')
    .pipe(
      retry(3), 
      map((res: any) => res.json()),
      catchError(this.handleError)
    );
  }

  getAppointmentTimes$(day: Date): Observable<any> {
    return this._http
      .get(`https://api.myjson.com/bins/1133ok`)
      .pipe(
        retry(3), 
        map(this.extractDataTimes),
        catchError(this.handleError)
      );
  }

  public extractData(res: Response) {
    let body = res.json();
    let appointmentsArray = Object.keys(body).map(function(k) { return body[k] });
    let newAppointmentsList = [];
    if (appointmentsArray.length > 0) {
      //sort by time
      appointmentsArray.sort(function(a,b){
        return a.time - b.time;
      });
      //remove duplicated
      let appointmentsArrayUnique = appointmentsArray.reduce((x, y) => x.findIndex(e=>e.time==y.time)<0 ? [...x, y]: x, []);

      appointmentsArrayUnique.forEach((appointment) => {
        let newAppointment = {
          '_id': appointment._id,
          'time': appointment.time,
          'patient': appointment.patient,
          'areas': appointment.areas,
          'price': 0,
          'status': appointment.status,
          'observations': appointment.observations
        }
        newAppointmentsList.push(newAppointment);
      });
    }
    return newAppointmentsList;
  }

  public extractDataTimes(res: Response) {
    let body = res.json();
    const timeMinutes = Array.from(Array(52).keys());
    let occupiedTimes = []; 
    let freeTimes = [];
    let appointmentsTimes = Object.keys(body).map(function(k) { return body[k] });
    if (appointmentsTimes.length > 0) {
      //sort by time
      appointmentsTimes.sort(function(a,b){
        return a.time - b.time;
      });
      //remove duplicated
      let appointmentsTimesUnique = appointmentsTimes.reduce((x, y) => x.findIndex(e=>e.time==y.time)<0 ? [...x, y]: x, []);


      appointmentsTimesUnique.forEach((appointment) => {
        let newTime = {
          'time': appointment.time
        }
        occupiedTimes.push(newTime);
      });
    }
    freeTimes = timeMinutes.filter(e => !occupiedTimes.find(a => e == a.time));
    return freeTimes;
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


// JSON generator
// [
//   '{{repeat(10,20)}}',
//   {
//     _id: '{{index()}}',
//     date: 'Mon Oct 08 2018 00:00:00 GMT-0300 (hora estándar de Argentina)',
//     time: '{{integer(1, 52)}}',
//     appointment: {
//         _id: '{{integer(1, 48)}}',
//         name: '{{firstName()}} {{surname()}}'
//     },
//     areas: [
//       '{{repeat(1, 4)}}',
//       '{{integer(1, 10)}}'
//     ],
//     price: '{{floating(800, 1500, 0, "0")}}',
//     status: '{{integer(1, 6)}}',
//     observations: '{{lorem(1, "paragraphs")}}'
//   }
// ]