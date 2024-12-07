import { Component, OnDestroy, OnInit } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../user/user.service';
import { AuthUser, Message } from '../../types';
import { ReplaySubject } from 'rxjs';
import { TimePipe } from "../../shared/pipes/time.pipe";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [TimePipe],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, OnDestroy {

  private message$$: ReplaySubject<Message> = new ReplaySubject();
  message$ = this.message$$.asObservable();
  
  messages: Message[] = [];


  roomId: string = '';
  user: AuthUser | null = null;

  constructor(private socketService: WebsocketService, private route: ActivatedRoute, private userService: UserService) {
    this.roomId = this.route.snapshot.params['roomId'];

    this.user = this.userService.getUser;
  }

  ngOnInit(): void {

    this.socketService.emit('join room', { roomId: this.roomId, userId: this.user?._id });

    this.socketService.listen('message sent').subscribe({
      next: (data) => {
        this.message$$.next(data);
      },
      error: (err) => {
        console.error('Error while listening for messages:', err);
      }
    })

    this.message$.subscribe({

      next: (data) => {
        const senderId = data.sentBy;
    
        if (senderId !== this.user?._id) {

          this.userService.fetchProfile(senderId).subscribe({

            next: (sender) => {

              const updatedData = { ...data, sender };
              this.messages.push(updatedData);
              
            },
            error: (err) => {
              console.error(`Error fetching sender profile:`, err);
            }

          });
        } else {

          const updatedData = { ...data, sender: this.user };
          
          this.messages.push(updatedData);

        }
      },
      error: (err) => {
        console.error('Error occurred:', err);
      }
    });

  }

  sendMessage(message: string) {
    this.socketService.emit('send message', { roomId: this.roomId, message, senderId: this.user?._id });
  }

  ngOnDestroy(): void {
    this.socketService.emit('leave room', { roomId: this.roomId, userId: this.user?._id });
  }

}
