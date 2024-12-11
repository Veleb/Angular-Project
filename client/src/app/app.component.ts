import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./core/navbar/navbar.component";
import { AuthenticateComponent } from "./authenticate/authenticate.component";
import { ErrorMsgComponent } from "./core/error-msg/error-msg.component";
import { FooterComponent } from "./core/footer/footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, AuthenticateComponent, ErrorMsgComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Angular-Project';
}
