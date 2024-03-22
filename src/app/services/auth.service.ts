import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { ExpenseModal } from '../model/common.interface';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  firebaseAuth = inject(Auth)
 

  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password).then(() => { })
    return from(promise)
  }

  register(email: string, userName: string, password: string): Observable<void> {
    const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password).then((res) => updateProfile(res.user, { displayName: userName }))
    return from(promise)
  }

  logout():Observable<void> {
    const promise = signOut(this.firebaseAuth)
    return from(promise)
  }
  

}
