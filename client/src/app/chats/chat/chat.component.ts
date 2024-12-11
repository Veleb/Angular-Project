import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../../user/user.service';
import { AuthUser, Message, Room } from '../../types';
import { ReplaySubject, Subscription, of } from 'rxjs';
import { TimePipe } from "../../shared/pipes/time.pipe";
import { RoomService } from '../room.service';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { switchMap, take } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [TimePipe, LoaderComponent, RouterLink],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, OnDestroy {

  @ViewChild('editMessageInput') editMessageInput!: ElementRef<HTMLInputElement>;

  private subscriptions = new Subscription();

  private message$$: ReplaySubject<Message> = new ReplaySubject();
  message$ = this.message$$.asObservable();
  messages: Message[] = [];

  roomId: string = '';
  room: Room | null = null;

  user: AuthUser | null = null;

  hoveringId: string | null = null;
  editingId: string | null = null;

  isLoadingMessages: boolean = false;
  isEditing: boolean = false;

  editingMessageId: string | null = null;
  isEditingMessage: boolean = false;

  private messagesLimit: number = 50;
  private messagesSkip: number = 0;

  constructor(
    private socketService: WebsocketService,
    private route: ActivatedRoute,
    private userService: UserService,
    private roomService: RoomService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.userService.getProfile().pipe(
        switchMap(user => {
          this.user = user;
          return this.route.paramMap;
        })
      ).subscribe(params => {
        this.roomId = params.get('roomId')!;
        this.resetAndLoadRoom();
      })
    );

    this.subscriptions.add(
      this.socketService.listen('message sent').subscribe({
        next: (data) => {
          this.message$$.next(data);
        },
        error: (err) => {
          console.error('Error while listening for messages:', err);
        }
      })
    );

    this.subscriptions.add(
      this.socketService.listen('message deleted').subscribe({
        next: (messageId: string) => {

          this.messages = this.messages.filter(msg => msg._id !== messageId);

        },
        error: (err) => {
          console.error('Error while listening for deleted message:', err);
        }
      })
    );

    this.subscriptions.add(
      this.socketService.listen('message edited').subscribe({
        next: (editedMessage: Message) => {
          const index = this.messages.findIndex(msg => msg._id === editedMessage._id);
          if (index !== -1) {
            this.messages[index] = { ...this.messages[index], ...editedMessage };
          }

          this.toastr.success(`Successfully edited the message!`, `Success`);

        },
        error: (err) => {
          console.error('Error while listening for edited message:', err);
        }
      })
    );
    
  }

  private resetAndLoadRoom(): void {
    this.leaveCurrentRoom();
    this.messages = [];
    this.messagesSkip = 0;

    if (this.user && this.roomId) {
      this.joinNewRoom();
      this.loadRoomData();
    }
  }

  private loadRoomData(): void {
    this.fetchRoomData();
    this.getInitialMessages();
  }

  private getInitialMessages(): void {
    if (this.isLoadingMessages || !this.roomId) return;
    this.isLoadingMessages = true;

    this.roomService.getRoomMessages(this.roomId, this.messagesLimit, this.messagesSkip).subscribe({
      next: (data) => {
        this.messages = [];
        
        data.forEach(message => {
          this.processIncomingMessage(message);
        });

        this.isLoadingMessages = false;
      },
      error: (err) => {
        console.error('Error loading room messages:', err);
        this.isLoadingMessages = false;
      }
    });
  }

  private processIncomingMessage(data: Message) {
    const isDuplicate = this.messages.some((msg) => msg._id === data._id);

    if (isDuplicate) {
      return;
    }

    const senderId = data.sentBy;
    const sender$ = senderId !== this.user?._id
      ? this.userService.fetchProfile(senderId)
      : of(this.user);

    sender$.pipe(take(1)).subscribe({
      next: (sender) => {
        const updatedMessage = { ...data, sender };
        this.messages.push(updatedMessage);
        
        this.messages.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateA - dateB;
        });
      },
      error: (err) => console.error('Error fetching sender profile:', err)
    });
  }

  private fetchRoomData(): void {
    this.roomService.getRoom(this.roomId).subscribe({
      next: (data) => {
        this.room = data;
      },
      error: (err) => {
        console.error('Error fetching room data:', err);
      }
    });
  }

  private leaveCurrentRoom(): void {
    if (this.user && this.roomId) {
      this.socketService.emit('leave room', { roomId: this.roomId, userId: this.user._id });
    }
  }

  private joinNewRoom(): void {
    if (this.user && this.roomId) {
      this.socketService.emit('join room', { roomId: this.roomId, userId: this.user._id });
    }
  }

  handleHover(messageId: string, isHovering: boolean): void {
    this.hoveringId = isHovering ? messageId : null;
  }

  toggleEditMode(roomId: string | undefined): void {
    this.isEditing = !this.isEditing;
    this.editingId = roomId ? roomId : null;
  }

  confirmEdit(chatName: string, roomId: string): void {
    if (!this.room) {
      console.error('No room data available');
      return;
    }
  
    this.roomService.getRoom(roomId).subscribe({
      next: (data: Room) => {
        const updatedRoom = { ...data, name: chatName };
  
        this.roomService.editRoom(updatedRoom, roomId).subscribe({
          next: () => {
            this.userService.getProfile().subscribe({
              next: () => {
                this.isEditing = false;
                this.toastr.success('Successfully updated the room name!', 'Room Updated');
              },
              error: (err) => {
                console.error('Error refreshing user profile:', err);
                this.toastr.error('Failed to update rooms list', 'Error');
              }
            });
          },
          error: (err) => {
            this.isEditing = false;
            console.error('Error updating room name:', err);
            this.toastr.error('Failed to update the room name!', 'Error');
          }
        });
      },
      error: (err) => console.error('Error fetching room for editing:', err)
    });
  }

  sendMessage(messageInput: HTMLInputElement) {

    const message = messageInput.value;

    if (message.trim() === '') {
      this.toastr.warning('Message cannot be empty!', 'Warning');
      return;
    }

    messageInput.value = '';

    if (this.user) {
      this.socketService.emit('send message', { roomId: this.roomId, message, senderId: this.user._id });
    } else {
      this.toastr.error('User not authenticated!', `Error Occurred`);
    }
  }

  deleteMessage(messageId: string) {
    if (messageId) {
      this.socketService.emit('delete message', { messageId, roomId: this.roomId });
    } else {
      this.toastr.error("An error occurred while deleting message!", `Error Occurred`);
    }
  }

  editMessage(messageId: string) {
    this.editingMessageId = messageId;
    this.isEditingMessage = true;
  }

  confirmEditMessage(messageId: string) {
    const newText = this.editMessageInput.nativeElement.value;

    if (newText.trim() === '') {
      this.toastr.warning(`Message can't be empty!`, `Error Occurred`);
      return;
    }

    this.socketService.emit('edit message', { roomId: this.roomId, messageId, newMessage: newText  });

    this.cancelEditMessage();
  }

  cancelEditMessage() {
    this.editingMessageId = null;
    this.isEditingMessage = false;
  }

  ngOnDestroy(): void {
    this.leaveCurrentRoom();
    this.subscriptions.unsubscribe();
  }
}