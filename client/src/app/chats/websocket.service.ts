import { Injectable } from '@angular/core';
import * as socketIo from 'socket.io-client';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket: socketIo.Socket | null = null;

  constructor() {

    if (!this.socket && typeof window !== 'undefined') {
      const currentUrl = window.location.href;
      
      this.socket = socketIo.connect(environment.API_LINK, {
        query: { currentUrl }
      });      
    }

   }

   listen (event: string): Observable<any> {

    return new Observable((subscribe) => {

      this.socket?.on(event, (data) => {
        subscribe.next(data);
      })

    })

   }

   emit (event: string, data: any): void {
    this.socket?.emit(event, data);
   }
}
