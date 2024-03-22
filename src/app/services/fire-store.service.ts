import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, setDoc } from '@angular/fire/firestore';
import { ExpenseModal } from '../model/common.interface';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FireStoreService {

  constructor(private firestore:Firestore) { }
  expenseCollection = collection(this.firestore,"expense")

  addExpense(expense:ExpenseModal):Observable<void>
  {
    const promise = addDoc(this.expenseCollection,expense).then((res)=>{
    })
    return from(promise)
  }

  getExpense():Observable<ExpenseModal[]>
  {
    return collectionData(this.expenseCollection,{
      'idField':'id'
    }) as Observable<ExpenseModal[]>;
  }

  updateExpense(id:string,dataToUpdate:ExpenseModal):Observable<void>
  {
      const docRef = doc(this.firestore,'expense/'+id)
      const promise = setDoc(docRef,dataToUpdate)
      return from(promise)
    
  }
  dltExpense(id:string):Observable<void>
  {
    const docRef = doc(this.firestore,'expense/'+id)
    const promise = deleteDoc(docRef)
    return from(promise)
  }
}
