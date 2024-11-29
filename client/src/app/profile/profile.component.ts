import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { SanitizedUser, User } from '../types';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  user: SanitizedUser | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getProfile().subscribe({
      next: (data) => {
        this.user = data;
      }
    })
  }
}
