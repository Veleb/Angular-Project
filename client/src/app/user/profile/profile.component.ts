import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../user.service';
import { AuthUser, Room, User } from '../../types';
import { RoomService } from '../../chats/room.service';
import { catchError, forkJoin, map, of, switchMap, tap, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ProductCardComponent } from '../../products/product-card/product-card.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { ErrorMsgService } from '../../core/error-msg/error-msg.service';
import { ProductService } from '../../products/product.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ RouterLink, ProductCardComponent, MatDialogModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @ViewChild('usernameInput') usernameInput!: ElementRef<HTMLInputElement>;

  user: AuthUser | User | null = null;

  isOwnProfile: boolean = false;
  isEditing: boolean = false;

  constructor(
    private userService: UserService,
    private roomService: RoomService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private errorMsgService: ErrorMsgService
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
        this.errorMsgService.setError('');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.toastr.error(`Error occurred while logging out!`, `Error`);
        console.error('Error during logout', err);
      },
    });
  }

  deleteProfile(): void {
    const dialogRef = this.dialog.open(DialogComponent);
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteProfile().pipe(
          switchMap(() => {
            return forkJoin([
              this.roomService.deleteUserRooms(),  
              this.roomService.deleteUserMessages(),
              this.productService.deleteUserProducts(),  
            ]);
          }),
          tap(() => {
            this.toastr.success('Successfully deleted profile and related data!', 'Success');
          }),
          catchError(err => {
            this.toastr.error('Error occurred while deleting profile and related data!', 'Error');
            console.error('Error deleting profile and related data:', err);
            return throwError(() => err);
          })
        ).subscribe({
          next: () => {
            this.userService.logout().subscribe({
              next: () => {
                this.router.navigate(['/home']);
              },
              error: (err) => {
                console.error('Error during logout:', err);
              }
            });
          },
          error: (err) => {
            this.toastr.error('Error during the deletion process!', 'Error');
            console.error('Error during profile deletion process:', err);
          }
        });
      }
    });
  }
    
  toggleEditProfile(): void {
    this.isEditing = !this.isEditing;
  }

  confirmEdit(): void {
    const newUsername = this.usernameInput.nativeElement.value;
    
    if (!newUsername.trim()) {
      this.toastr.warning('Username cannot be empty', `Warning`);
      return;
    }
  
    this.userService.updateProfile(newUsername).subscribe({
      next: (user: AuthUser) => {
        this.user = user; 
        
        this.user.username = newUsername;
        this.toastr.success('Successfully updated username!', `Success`);
        this.toggleEditProfile(); 
      },
      error: (error) => {
        this.toastr.error('Failed to update username!', `Error Occurred`);
        console.error('Failed to update username:', error);
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

    this.toastr.success(`Successfully left the chat!`, `Success!`)
  }

}
