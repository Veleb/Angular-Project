import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorMsgService {

  errorMsg$$ = new BehaviorSubject<string | null>(null);
  errorMsg$ = this.errorMsg$$.asObservable();

  constructor(private toastr: ToastrService) { }

  setError(value: string): void{
    this.errorMsg$$.next(value);

    this.toastr.error(value, `Error Occurred`);

    setTimeout(() => {
      this.clearError();
    }, 5000);
  }

  clearError(): void {
    this.errorMsg$$.next(null);
  }

}
