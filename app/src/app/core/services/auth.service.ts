import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, switchMap } from 'rxjs';
import { URLBASE } from '../../../environments/environment';

export interface User {
  id?: string;
  name: string;
  role?: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user';

  private http = inject(HttpClient);
  private router = inject(Router);

  // ---- Getters ----

  get accessToken(): string | null {
    return sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  get refreshToken(): string | null {
    return sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  get user(): User | null {
    const userStr = sessionStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  get isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  // ---- Session Storage ----

  private saveSession(response: LoginResponse): void {
    sessionStorage.setItem(this.ACCESS_TOKEN_KEY, response.access_token);
    sessionStorage.setItem(this.REFRESH_TOKEN_KEY, response.refresh_token);
  }

  private saveUser(user: User): void {
    sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private updateAccessToken(token: string): void {
    sessionStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  private clearSession(): void {
    sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(this.USER_KEY);
  }

  // ---- API Methods ----

  login(username: string, password: string): Observable<User> {
    return this.http.post<LoginResponse>(`${URLBASE}/users/login`, { username, password }).pipe(
      switchMap((response) => {
        this.saveSession(response);
        return this.getUserInfo();
      }),
      tap((user) => this.saveUser(user)),
      catchError((error) => {
        return throwError(() => error);
      }),
    );
  }

  getUserInfo(): Observable<User> {
    return this.http.get<User>(`${URLBASE}/users/info`);
  }

  refreshAccessToken(): Observable<RefreshTokenResponse> {
    const refreshToken = this.refreshToken;

    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http
      .post<RefreshTokenResponse>(`${URLBASE}/users/refresh-token`, {
        refresh_token: refreshToken,
      })
      .pipe(
        tap((response) => this.updateAccessToken(response.access_token)),
        catchError((error) => {
          this.logout();
          return throwError(() => error);
        }),
      );
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }
}
