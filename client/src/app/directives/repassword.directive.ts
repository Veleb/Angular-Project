import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { repasswordValidator } from '../utils/repassword.validator';

@Directive({
  selector: '[appRepassword]',
  standalone: true,
  providers: [{
    provide: NG_VALIDATORS,
    multi: true,
    useExisting: RepasswordDirective
  }]
})
export class RepasswordDirective implements Validator {

  constructor() { }

  validate(control: AbstractControl): ValidationErrors | null {
    
    const validatorFn = repasswordValidator();
    
    return validatorFn(control);  
  }
}
