import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { AuthUser, User } from '../types';
import { BehaviorSubject, Observable, Subscription, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy{

  user$$ = new BehaviorSubject<AuthUser | null>(null);
  user$ = this.user$$.asObservable();

  user: AuthUser | null = null;
  userSubscription: Subscription | null = null;

  constructor(private http: HttpClient) {
    this.userSubscription = this.user$.subscribe( (user) => {
      this.user = user;
    })

    this.getProfile().subscribe({
      next: (user) => this.user$$.next(user),
      error: () => this.user$$.next(null),
    });
   }

  get isLogged(): boolean {
    return !!this.user;
  }

  get getUser(): AuthUser | null {
    return this.user;
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

  logout(): Observable<User> {
    return this.http.get<User>(`/api/users/logout`).pipe(
      tap(() => this.user$$.next(null))
    );
  }

  getProfile(): Observable<AuthUser> {
    return this.http.get<AuthUser>(`/api/users/profile`);
  }

  fetchProfile(userId: string): Observable<AuthUser> {
    return this.http.get<AuthUser>(`/api/users/profile/${userId}`);
  }

  fetchProfiles(): Observable<AuthUser[]> {
    return this.http.get<AuthUser[]>(`/api/users/profiles`);
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }
}
