import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthUser, User } from '../types';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user$$ = new BehaviorSubject<AuthUser | null>(null);
  user$ = this.user$$.asObservable();
  user: AuthUser | null = null;

  constructor(private http: HttpClient) {
    this.user$.subscribe( (user) => {
      this.user = user;
    })
   }

  get isLogged(): boolean {
    return !!this.user;
  }

  register(username: string, password: string): Observable<User> {
    const body = { username, password };
    return this.http.post<User>(`/api/users/register`, body).pipe(
      tap((user) => this.user$$.next(user))
    ); 
  }

  login(username: string, password: string): Observable<User> {
    const body = { username, password };
    return this.http.post<User>(`/api/users/login`, body).pipe(
      tap((user) => this.user$$.next(user))
    ); 
  }

  logout() {
    return this.http.get(`/api/users/logout`).pipe(
      tap(() => this.user$$.next(null))
    );
  }

  getProfile() {
    return this.http.get<AuthUser>(`/api/users/profile`).pipe(
      tap((user) => this.user$$.next(user))
    );
  }
}
