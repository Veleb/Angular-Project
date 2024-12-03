import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorMsgService {

  errorMsg$$ = new BehaviorSubject<string | null>(null);
  errorMsg$ = this.errorMsg$$.asObservable();

  constructor() { }

  setError(value: string): void{
    this.errorMsg$$.next(value);
  }


}
