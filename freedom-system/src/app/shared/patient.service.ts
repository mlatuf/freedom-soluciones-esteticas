import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';
import { Observable } from '../../../node_modules/rxjs';
import { AppointmentPatient }       from '../../app/classes/appointment-patient';
import { Patient }       from '../../app/classes/patient';
import { map }        from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(private _http: Http) { }
  
  getPatients$(): Observable<Patient[]> {
    return this._http
      // .get(`https://jsonplaceholder.typicode.com/patient/${patientId}`)
      .get(`https://api.myjson.com/bins/14s8l0`)
      // .pipe(map((res: any) => res.json()));
      .pipe(map(this.extractData));
  }

  getPatientData$(patientId: number): Observable<Patient> {
    return this._http
    // .get(`https://jsonplaceholder.typicode.com/patient/${patientId}`)
      .get('https://api.myjson.com/bins/1eyr10')
      .pipe(map((res: any) => res.json()));
  }
  
  getAppoinmentsPatientData$(patientId: number): Observable<AppointmentPatient[]> {
    return this._http
      // .get(`https://jsonplaceholder.typicode.com/patient/${patientId}/appointments`)
      .get('https://api.myjson.com/bins/vtg7o')
      .pipe(map((res: any) => res.json()));
  }

  savePatient$(patient: Patient): Observable<any> {
    return this._http
      .post(`https://jsonplaceholder.typicode.com/patient/create`, patient)
      .pipe(map((res: any) => res.json()));
  }

  private extractData(res: Response) {
    let body = res.json();
    let patientsArray = Object.keys(body).map(function(k) { return body[k] });
    let newPatientsList = [];
    if (patientsArray.length > 0) {
      patientsArray.forEach((patient) => {
        let newPatient = {
          '_id': patient._id,
          'fullName': patient.name +' '+ patient.lastName,
          'phone': patient.phone
        // 'age': patient.age,
        // 'hasMedicines': patient.hasMedicines,
        // 'medicines': patient.medicines,
        // 'hasAllergies': patient.hasAllergies,
        // allergies: string;
        // pregnancy: Boolean;
        // hasBodyMetals: Boolean;
        // bodyMetalsPlace: string;
        // hasMoles: Boolean;
        // molesPlace: string;
        // hasTattoos: Boolean;
        // tattoosPlace: string;
        // hasSkinCancer: Boolean;
        // hasEpilepsy: Boolean;
        // hasPreviousTreatment: Boolean;
        // previousTreatment: string;
        }
        newPatientsList.push(newPatient);
      });
    }
    return newPatientsList;
  }
}
