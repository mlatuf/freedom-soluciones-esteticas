import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'src/app/core/classes/user';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(public afAuth: AngularFireAuth) { }

  loginUser$(user: User): Observable<any> {
    return from(this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password));
  }
  
  logout$(): Observable<any> {
    return from(this.afAuth.auth.signOut());
  }
}
