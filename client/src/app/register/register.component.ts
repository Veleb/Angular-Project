import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ RouterLink, FormsModule ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(private userService: UserService) {}

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
}
