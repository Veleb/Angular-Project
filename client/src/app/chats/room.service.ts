import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Room } from '../types';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private http: HttpClient) { }

  createRoom(data: Room): Observable<Room> { // ✔️
    return this.http.post<Room>(`${environment.API_LINK}/rooms`, data);
  }

}
