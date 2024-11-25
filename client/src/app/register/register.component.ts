import { Component } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';
import { UsernameDirective } from '../directives/username.directive';
import { PasswordDirective } from '../directives/password.directive';
import { RepasswordDirective } from '../directives/repassword.directive';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ RouterLink, FormsModule, UsernameDirective, PasswordDirective, RepasswordDirective ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(private userService: UserService) {}

  passwordVisible: boolean = false;
  rePasswordVisible: boolean = false;

  onSubmit(formElement: NgForm): void {
    const formData = formElement.value;
    
    const { username, password, repass } = formData;
    
    if (password !== repass) {
      alert('Passwords do not match!');
      return;
    }

    this.userService.register(username, password).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log({error});
        
        console.error(`Error registering user: ${{error}}`);
      }
    })

    formElement.reset();

  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleRepasswordVisibility(): void {
    this.rePasswordVisible = !this.rePasswordVisible;
  }

  onPasswordChange(repass: NgModel) {

    if (repass) {
      repass.control.updateValueAndValidity();
    }
  }

  blockEvent(event: Event) {
    event.preventDefault();
  }
}
