import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { environment } from '@environments/environment';
import { PlatformService } from './platform.service';
import { ApiResponse } from '@interfaces/api-response.interface';
import { jwtDecode } from 'jwt-decode';
import { User } from '../models/user.model';
import { CookieService } from './cookie.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenKey = 'auth_token';
  private readonly apiUrl = environment.apiUrl; // 🔁 Replace with your actual backend API
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private platform = inject(PlatformService);
  private cookieService = inject(CookieService);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient) {
    if (this.platform.isbrowser()) {
      const token = this.getToken();
      if (token) {
        const decoded = this.getDecodedAccessToken(token);
        this.currentUserSubject.next(decoded);
      }
    }
  }

  login(payload: { username: string; password: string }): Observable<string> {
    return new Observable((observer) => {
      this.http
        .post<ApiResponse<string>>(`${this.apiUrl}/user/login`, payload)
        .subscribe({
          next: (response) => {
            const token = response.data;
            console.log('Login successful, token received:', token);
            this.setToken(token);
            const payload = this.getDecodedAccessToken(token);
            this.currentUserSubject.next(payload);
            observer.next(token);
            observer.complete();
          },
          error: (err) => this.handleError(err),
        });
    });
  }

  handleAuthentication(token: string | null) {
    if (token === null || token === '') return null;
    const decodedToken = this.getDecodedAccessToken(token);
    const user = new User(
      decodedToken.SCOPE,
      decodedToken.USERID,
      decodedToken.sub,
      token,
      new Date(decodedToken.exp * 1000),
      new Date(decodedToken.iat * 1000)
    );
    this.currentUserSubject.next(user);
    this.setToken(token);
    return user;
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (Error) {
      return null;
    }
  }

  logout(): void {
    this.currentUserSubject.next(null);
    window.location.href = '/login';
    this.deleteCookie(this.tokenKey);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error) {
      console.log(errorRes);
      return throwError(() => new Error(errorMessage));
    }
    switch (errorRes.status) {
      case 401:
        errorMessage = 'username or password incorrect.';
    }
    return throwError(() => new Error(errorMessage));
  }

  getToken(): string | null {
    if (!this.platform.isbrowser()) {
      return null;
    }

    const cookieValue = this.cookieService.getCookie(this.tokenKey);
    if (cookieValue) {
      return cookieValue;
    }
    return null;
    // const match = document.cookie.match(
    //   new RegExp('(^| )' + this.tokenKey + '=([^;]+)')
    // );
    // if (!match) {
    //   console.warn('No token found in cookies');
    //   return null;
    // }
    // return match ? decodeURIComponent(match[2]) : null;
  }

  setToken(token: string): void {
    // Set cookie with 1-hour expiry
    if (!this.platform.isbrowser()) {
      return;
    }

    this.cookieService.setCookie(this.tokenKey, token, 1);
    // const expires = new Date(Date.now() + 60 * 60 * 1000).toUTCString();
    // document.cookie = `${this.tokenKey}=${encodeURIComponent(
    //   token
    // )}; path=/; expires=${expires}; Secure; SameSite=Lax`;
  }

  getDecodedToken(): User | null {
    const token = this.getToken();
    return token ? this.getDecodedAccessToken(token) : null;
  }

  get currentUser(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  getRole(): string | null {
    return this.getDecodedToken()?.SCOPE?.toLowerCase() || null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      console.log('Logging out');
      this.logout();
    }, expirationDuration);
    this.deleteCookie(this.tokenKey);
  }

  private deleteCookie(name: string): void {
    document.cookie = `${name}=; Max-Age=0; path=/; Secure; SameSite=Lax`;
  }

  autoLogin() {
    const token = this.getToken();
    const user = this.handleAuthentication(token);
    if (user) {
      this.currentUserSubject.next(user);
      const expirationDuration =
        new Date(user.exp).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    } else {
      return;
    }
  }

  isAuthenticated(): boolean {
    console.log('[Auth] Checking authentication status...');

    // Step 1: Get token from storage
    const token = this.getToken();
    console.log(
      '[Auth] Token retrieved from storage:',
      token ? `${token.substring(0, 15)}...` : 'NULL'
    );

    // Step 2: Check if token exists
    if (!token) {
      console.warn('[Auth] ❌ No token found - user not authenticated');
      return false;
    }

    // Step 3: Decode token
    const decoded = this.getDecodedAccessToken(token);
    console.log('[Auth] Decoded token:', decoded);

    // Step 4: Verify token structure
    if (!decoded || !decoded.exp) {
      console.error(
        '[Auth] ❌ Invalid token structure - missing expiration or undecodable'
      );
      return false;
    }

    // Step 5: Calculate expiration time
    const expirationDate = new Date(decoded.exp * 1000);
    const currentDate = new Date();

    console.log('[Auth] Token expiration:', expirationDate.toUTCString());
    console.log('[Auth] Current server time:', currentDate.toUTCString());
    console.log(
      `[Auth] Token expires in: ${Math.floor(
        (expirationDate.getTime() - currentDate.getTime()) / 1000
      )} seconds`
    );

    // Step 6: Check expiration validity
    const isValid = expirationDate > currentDate;
    console.log(
      `[Auth] Token validity: ${isValid ? '✅ VALID' : '❌ EXPIRED'}`
    );

    return isValid;
  }
}
