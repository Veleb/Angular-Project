import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../user.service';
import { AuthUser, Room, User } from '../../types';
import { RoomService } from '../../chats/room.service';
import { catchError, forkJoin, map, of, switchMap, tap, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ RouterLink ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: AuthUser | User | null = null;
  isOwnProfile: boolean = false;

  constructor(
    private userService: UserService,
    private roomService: RoomService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
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
        this.toastr.success(`Successful logout!`, `Success`);
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1000);
      },
      error: (err) => {
        console.error('Error during logout', err);
      },
    });
  }

  leaveRoom(roomId: string | undefined): void {
    if (!roomId || !this.user) return;
  
    this.userService.removeRoom(roomId).pipe(
      switchMap((data: any) => {
        if (!data.rooms || data.rooms.length === 0) {
          return of([]);
        }
        
        return forkJoin(
          data.rooms.map((id: any) => 
            this.roomService.getRoom(id).pipe(
              catchError(err => {
                console.error(`Error fetching room details for ${id}`, err);
                return of(null);
              })
            )
          )
        ).pipe(
          map((rooms: any) => rooms.filter((room: Room) => room !== null))
        );
      }),
      tap(updatedRooms => {
        if (this.user) {
          this.user.rooms = updatedRooms;
        }
      }),
      catchError(err => {
        console.error('Error while leaving the room', err);
        return throwError(err);
      })
    ).subscribe();
  }

}
