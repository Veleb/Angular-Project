import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [ RouterLink ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

  constructor(private toastr: ToastrService) {}

  onRegister(emailInput: HTMLInputElement) {
    
    if (!emailInput.value.trim()) {
      this.toastr.error('You have to provide an email!', `Error Occurred`);
      return;
    }

    this.toastr.success('Successfully subscribed to newsletter!', `Success`);
  }

}
