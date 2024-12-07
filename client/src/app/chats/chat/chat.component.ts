import { Component, OnDestroy, OnInit } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../user/user.service';
import { AuthUser, Message } from '../../types';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [],
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
        this.messages.push(data);
      },
      error: (err) => {
        console.error('Error with ReplaySubject:', err);
      }
    });

  }

  sendMessage(message: string) {
    this.socketService.emit('send message', { roomId: this.roomId, message, sender: this.user });
  }

  ngOnDestroy(): void {
    this.socketService.emit('leave room', { roomId: this.roomId, userId: this.user?._id });
  }

}
