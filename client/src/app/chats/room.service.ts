import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message, Room } from '../types';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private http: HttpClient) { }

  createRoom(data: Room): Observable<Room> { // ✔️
    return this.http.post<Room>(`${environment.API_LINK}/rooms`, data);
  }

  editRoom(data: Room, roomId: string): Observable<Room> {
    return this.http.put<Room>(`${environment.API_LINK}/rooms/${roomId}`, data);
  }

  getRoom(roomId: string): Observable<Room> {
    return this.http.get<Room>(`${environment.API_LINK}/rooms/${roomId}`);
  }
  
  getRoomMessages(roomId: string, limit: number, skip: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${environment.API_LINK}/rooms/${roomId}/messages/?limit=${limit}&skip=${skip}`);
  }

}
