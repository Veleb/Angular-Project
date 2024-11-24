import { ValidatorFn } from "@angular/forms";

export function usernameValidator(): ValidatorFn {
  return (control) => {
    const usernameValue = control.value;
    const regExp = new RegExp(`^[A-Za-z0-9._]{6,20}$`);

    const isValid = usernameValue === '' || regExp.test(usernameValue);
    
    return isValid ? null : { usernameValidator: true };
  }
}