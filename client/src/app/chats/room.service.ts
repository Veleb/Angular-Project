import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message, Room } from '../types';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private http: HttpClient) { }

  createRoom(data: Room): Observable<Room> { // ✔️
    return this.http.post<Room>(`/api/rooms`, data);
  }

  editRoom(data: Room, roomId: string): Observable<Room> {
    return this.http.put<Room>(`/api/rooms/${roomId}`, data);
  }

  getRoom(roomId: string): Observable<Room> {
    return this.http.get<Room>(`/api/rooms/${roomId}`);
  }
  
  getRoomMessages(roomId: string, limit: number, skip: number): Observable<Message[]> {
    return this.http.get<Message[]>(`/api/rooms/${roomId}/messages/?limit=${limit}&skip=${skip}`);
  }

}
