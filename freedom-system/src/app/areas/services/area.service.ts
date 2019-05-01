import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';
import { HttpHeaders, HttpErrorResponse }       from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Area }       from '../classes/area';
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

  private areasCollection: AngularFirestoreCollection<Area>;
  private areaDoc: AngularFirestoreDocument<Area>;

  constructor(private _http: Http, private afs: AngularFirestore) { 
    this.areasCollection = this.afs.collection<Area>('areas');
  }

  getAreas$(): Observable<Area[]> {
    return this.areasCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Area;
        const _id = a.payload.doc.id;
        return { _id, ...data };
      }))
    );
  }

  getAreaData$(areaId: number): Observable<Area> {
    this.areaDoc = this.afs.doc<Area>('areas/' + areaId);
    return this.areaDoc.snapshotChanges().pipe(
      map(a => {
        const data = a.payload.data() as Area;
        const _id = a.payload.id;
        return { _id, ...data };
      })
    );
  }

  deleteArea$(areaId: number): Observable<any> {
    this.areaDoc = this.afs.doc<Area>('areas/' + areaId);
    return from(this.areaDoc.delete());
  }


  saveArea$(area: Area): Observable<any> {
    if (area._id) {
      this.areaDoc = this.afs.doc<Area>('areas/' + area._id);
      delete area._id;
      return from(this.areaDoc.update(area))
    }
    return from(this.areasCollection.add({...area}));
  }

}
