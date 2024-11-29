import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SanitizedUser, User } from '../types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  register(username: string, password: string): Observable<User> {
    const body = { username, password };
    return this.http.post<User>(`/api/users/register`, body); 
  }

  login(username: string, password: string): Observable<User> {
    const body = { username, password };
    return this.http.post<User>(`/api/users/login`, body); 
  }

  logout() {
    return this.http.get(`/api/users/logout`);
  }

  getProfile() {
    return this.http.get<SanitizedUser>(`/api/users/profile`);
  }
}
