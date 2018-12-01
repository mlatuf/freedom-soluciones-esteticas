import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';
import { HttpHeaders, HttpErrorResponse }       from '@angular/common/http';
import { Observable } from 'rxjs';
import { Area }       from '../../classes/area/area';
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
export class AreaService {

  constructor(private _http: Http) { }

  getAreas$(): Observable<Area[]> {
    return this._http
      .get(`https://api.myjson.com/bins/1e9yig`)
      .pipe(
        retry(3), 
        map((res: any) => res.json()),
        catchError(this.handleError)
      );
  }

  getAreaData$(areaId: number): Observable<Area> {
    return this._http
      .get('https://api.myjson.com/bins/1cytr4')
      .pipe(
        retry(3), 
        map((res: any) => res.json()),
        catchError(this.handleError)
      );
  }

  deleteArea$(areaId: number): Observable<any> {
    return this._http
      .delete(`https://jsonplaceholder.typicode.com/patient/create`)
      .pipe(
        retry(3), 
        map((res: any) => res.json()),
        catchError(this.handleError)
      );
  }


  saveArea$(area: Area): Observable<any> {
    return this._http
      // .post(`https://jsonplaceholder.typicode.com/patient/create`, area)
      .get(`https://api.myjson.com/bins/1cytr4`)
      .pipe(
        retry(3), 
        map((res: any) => res.json()),
        catchError(this.handleError)
      );
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
