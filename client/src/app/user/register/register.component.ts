import { Component } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../user.service';
import { UsernameDirective } from '../../directives/username.directive';
import { PasswordDirective } from '../../directives/password.directive';
import { RepasswordDirective } from '../../directives/repassword.directive';
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ RouterLink, FormsModule, UsernameDirective, PasswordDirective, RepasswordDirective ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(private userService: UserService, private router: Router, private toastr: ToastrService) {}

  passwordVisible: boolean = false;
  rePasswordVisible: boolean = false;

  onSubmit(formElement: NgForm): void {
    const formData = formElement.value;
    
    const { username, password, repass } = formData;
    
    if (password !== repass) {
      this.toastr.error("Passwords don't match!", "Error!");
      return;
    }

    this.userService.register(username, password).subscribe({
      next: (response) => {
        this.toastr.success("Successful register!", "Success!")
        this.router.navigate(['catalog']);
      },
      error: (error) => {
        console.error(`Error registering user: ${error}`);
        this.toastr.error(`Error registering user`, `Error!`);
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
