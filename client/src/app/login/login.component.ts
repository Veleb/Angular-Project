import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';
import { UsernameDirective } from '../directives/username.directive';
import { PasswordDirective } from '../directives/password.directive';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ RouterLink, FormsModule, UsernameDirective, PasswordDirective ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private userService: UserService) {}

  passwordVisible: boolean = false;

  onSubmit(formElement: NgForm): void {
    const formData = formElement.value;
    
    const { username, password } = formData;

    this.userService.login(username, password).subscribe({
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
}
