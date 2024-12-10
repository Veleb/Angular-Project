import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, switchMap, catchError, of } from 'rxjs';
import { RoomService } from '../chats/room.service';
import { AuthUser, Room } from '../types';
import { UserService } from '../user/user.service';
import { ToastrService } from 'ngx-toastr';

export const isChatUserGuard: CanActivateFn = (route, state) => {
  const roomId = route.params['roomId'];
  const roomService = inject(RoomService);
  const userService = inject(UserService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  return userService.getProfile().pipe(
    switchMap((user: AuthUser | null) => {
      if (!user) {
        router.navigate(['/login']);
        return of(false);
      }

      return roomService.getRoom(roomId).pipe(
        map((room: Room) => {
          const isUserInRoom = room.users.some(roomUser => 
            roomUser === user._id
          );

          if (!isUserInRoom) {
            toastr.error('You do not have access to this chat!', `Error Occurred`);
            router.navigate(['/home']);
            return false;
          }

          return true;
        }),
        catchError(() => {
          toastr.error('You do not have access to this chat!', `Error Occurred`);
          router.navigate(['/home']);
          return of(false);
        })
      );
    }),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};