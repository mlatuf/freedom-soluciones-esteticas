import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';
import { HttpHeaders, HttpErrorResponse }       from '@angular/common/http';
import { Observable } from '../../../node_modules/rxjs';
import { AppointmentPatient }       from '../../app/classes/appointment-patient';
import { Patient }       from '../../app/classes/patient';
import { map, retry, catchError }        from "rxjs/operators";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token'
  })
};


@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(private _http: Http) { }
  
  getPatients$(): Observable<Patient[]> {
    return this._http
      .get(`https://api.myjson.com/bins/14s8l0`)
      .pipe(
        retry(3), 
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  getPatientData$(patientId: number): Observable<Patient> {
    return this._http
      .get('https://api.myjson.com/bins/1eyr10')
      .pipe(
        retry(3), 
        map((res: any) => res.json()),
        catchError(this.handleError)
      );
  }
  
  getAppoinmentsPatientData$(patientId: number): Observable<AppointmentPatient[]> {
    return this._http
      .get('https://api.myjson.com/bins/vtg7o')
      .pipe(
        retry(3), 
        map((res: any) => res.json()),
        catchError(this.handleError)
      );
  }

  savePatient$(patient: Patient): Observable<any> {
    return this._http
      // .post(`https://jsonplaceholder.typicode.com/patient/create`, patient)
      .get('https://api.myjson.com/bins/1eyr10')
      .pipe(
        retry(3), 
        map((res: any) => res.json()),
        catchError(this.handleError)
      );
  }

  deletePatient$(patientId: number): Observable<any> {
    return this._http
      .delete(`https://jsonplaceholder.typicode.com/patient/create`)
      .pipe(
        retry(3), 
        map((res: any) => res.json()),
        catchError(this.handleError)
      );
  }

  private extractData(res: Response) {
    let body = res.json();
    let patientsArray = Object.keys(body).map(function(k) { return body[k] });
    let newPatientsList = [];
    if (patientsArray.length > 0) {
      patientsArray.forEach((patient) => {
        let newPatient = {
          //TODO change to _id when BE is ready
          // '_id': patient._id,
          '_id': patient.id,
          'fullName': patient.name +' '+ patient.lastName,
          'phone': patient.phone
        }
        newPatientsList.push(newPatient);
      });
    }
    return newPatientsList;
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
