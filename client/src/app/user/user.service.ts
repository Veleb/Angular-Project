import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { AuthUser, User } from '../types';
import { BehaviorSubject, map, Observable, Subscription, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy {

  user$$ = new BehaviorSubject<AuthUser | null>(null);
  user$ = this.user$$.asObservable();

  user: AuthUser | null = null;
  userSubscription: Subscription | null = null;

  constructor(private http: HttpClient) {

    this.getProfile().subscribe({
      next: (user) => this.user$$.next(user),
      error: () => this.user$$.next(null),
    });
    
    this.userSubscription = this.user$.subscribe( (user) => {
      this.user = user;
    })

   }

  get isLogged(): boolean {
    return !!this.user
  }

  get getUser(): AuthUser | null {
    return this.user;
  }

  get getSavedProducts(): string[] | undefined {
    return this.user?.savedProducts;
  }

  register(username: string, password: string): Observable<AuthUser> {
    const body = { username, password };
    return this.http.post<AuthUser>(`/api/users/register`, body).pipe(
      tap((user) => this.user$$.next(user))
    ); 
  }

  login(username: string, password: string): Observable<AuthUser> {
    const body = { username, password };
    return this.http.post<AuthUser>(`/api/users/login`, body).pipe(
      tap((user) => this.user$$.next(user))
    ); 
  }

  logout() {
    return this.http.get(`/api/users/logout`).pipe(
      tap(() => this.user$$.next(null))
    );
  }

  getProfile(): Observable<AuthUser> {
    return this.http.get<AuthUser>(`/api/users/profile`).pipe(
      tap((user) => this.user$$.next(user))
    );
  }

  fetchProfile(userId: string): Observable<AuthUser> {
    return this.http.get<AuthUser>(`/api/users/profile/${userId}`);
  }

  fetchProfiles(): Observable<User[]> {
    return this.http.get<User[]>(`/api/users/profiles`);
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }
}
