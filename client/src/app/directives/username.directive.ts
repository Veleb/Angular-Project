import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { usernameValidator } from '../utils/username.validator';

@Directive({
  selector: '[appUsername]',
  standalone: true,
  providers: [{
    provide: NG_VALIDATORS,
    multi: true,
    useExisting: UsernameDirective
  }]
})
export class UsernameDirective implements Validator {

  constructor() { }

  validate(control: AbstractControl): ValidationErrors | null {
    const validatorFn = usernameValidator();

  
    return validatorFn(control);  
  }
}
