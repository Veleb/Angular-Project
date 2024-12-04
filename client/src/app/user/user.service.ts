import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { AuthUser, User } from '../types';
import { BehaviorSubject, catchError, map, Observable, of, Subscription, tap } from 'rxjs';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy {

  user$$ = new BehaviorSubject<AuthUser | null>(null);
  user$ = this.user$$.asObservable();

  user: AuthUser | null = null;
  userSubscription: Subscription | null = null;

  constructor(private http: HttpClient, private storageService: StorageService) {
  
    const storedUser = this.storageService.getItem<AuthUser>('user');
    
    if (storedUser) {
      this.user = storedUser;
      this.user$$.next(this.user);
    }

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
      tap((user) => {
        this.user$$.next(user);
        this.storageService.saveItem('user', JSON.stringify(user));
      })
    ); 
  }

  login(username: string, password: string): Observable<AuthUser> {
    const body = { username, password };
    return this.http.post<AuthUser>(`/api/users/login`, body).pipe(
      tap((user) => {
        this.user$$.next(user);
        this.storageService.saveItem('user', JSON.stringify(user));
      })
    ); 
  }

  logout() {
    return this.http.get(`/api/users/logout`).pipe(
      tap(() => {
        this.user$$.next(null);
        this.storageService.removeItem('user');
      })
    );
  }

  getProfile(): Observable<AuthUser | null> {
    return this.http.get<AuthUser>('/api/users/profile').pipe(
      tap((user) => this.user$$.next(user)),
      catchError(() => {
        return of(null);
      })
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
