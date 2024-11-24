import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../types';
import { environment } from '../../environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  API_LINK = environment.API_LINK

  constructor(private http: HttpClient) { }

  register(username: string, password: string): Observable<User> {
    const body = { username, password };
    return this.http.post<User>(`${this.API_LINK}/users/register`, body, { withCredentials: true }); 
  }

  login(username: string, password: string): Observable<User> {
    const body = { username, password };
    return this.http.post<User>(`${this.API_LINK}/users/login`, body, { withCredentials: true }); 
  }

  logout() {
    return this.http.get(`${environment.API_LINK}/users/logout`, { withCredentials: true });
  }
}
