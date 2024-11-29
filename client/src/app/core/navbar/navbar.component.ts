import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../user/user.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ RouterLink ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private userService: UserService, private router: Router) {}

  get isLogged(): boolean {
    return this.userService.isLogged;
  }

  onLogout(): void {
    this.userService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']); 
      },
      error: (err) => {
        console.error('Error during logout', err);
      },
    });
  }
}
