import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { AuthUser, User } from '../../types';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: AuthUser | User | null = null;
  isOwnProfile: boolean = false;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if (id) {
        this.userService.fetchProfile(id).subscribe({
          next: (data) => {
            this.user = data;
            this.isOwnProfile = id === this.userService.getUser?._id ? true : false;
          },
          error: () => {
            console.error("Failed to fetch user profile.");
          }
        });

      } else {
        this.userService.getProfile().subscribe({
          next: (data) => {
            this.user = data;
            this.isOwnProfile = true;
          },
          error: () => {
            console.error("Failed to fetch own profile.");
          }
        });
      }
    });
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
