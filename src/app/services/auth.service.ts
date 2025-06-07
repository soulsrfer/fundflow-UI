import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '@environments/environment';
import { PlatformService } from './platform.service';
import { ApiResponse } from '@interfaces/api-response.interface';

interface JwtPayload {
  SCOPE: string;
  USERID: number;
  sub: string;
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenKey = 'auth_token';
  private readonly apiUrl = environment.apiUrl; // 🔁 Replace with your actual backend API
  private currentUserSubject = new BehaviorSubject<JwtPayload | null>(null);
  private logoutTimeout: any;
  private platform = inject(PlatformService);

  constructor(private http: HttpClient) {
    if (this.platform.isbrowser()) {
      const token = this.getToken();
      if (token) {
        const decoded = this.decodeToken(token);
        this.currentUserSubject.next(decoded);
        this.startAutoLogout(decoded.exp);
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
            const payload = this.decodeToken(token);
            this.currentUserSubject.next(payload);
            this.startAutoLogout(payload.exp);
            observer.next(token);
            observer.complete();
          },
          error: (err) => observer.error(err),
        });
    });
  }

  logout(): void {
    this.deleteCookie(this.tokenKey);
    this.clearAutoLogout();
    this.currentUserSubject.next(null);
    window.location.href = '/login';
  }

  getToken(): string | null {
    if (!this.platform.isbrowser()) {
      return null;
    }
    const match = document.cookie.match(
      new RegExp('(^| )' + this.tokenKey + '=([^;]+)')
    );
    if (!match) {
      console.warn('No token found in cookies');
      return null;
    }
    return match ? decodeURIComponent(match[2]) : null;
  }

  setToken(token: string): void {
    // Set cookie with 1-hour expiry
    if (!this.platform.isbrowser()) {
      return;
    }
    console.warn('setToken called');
    const expires = new Date(Date.now() + 60 * 60 * 1000).toUTCString();
    document.cookie = `${this.tokenKey}=${encodeURIComponent(
      token
    )}; path=/; expires=${expires}; Secure; SameSite=Lax`;
  }

  getDecodedToken(): JwtPayload | null {
    const token = this.getToken();
    return token ? this.decodeToken(token) : null;
  }

  get currentUser(): Observable<JwtPayload | null> {
    return this.currentUserSubject.asObservable();
  }

  getRole(): string | null {
    return this.getDecodedToken()?.SCOPE?.toLowerCase() || null;
  }

  private decodeToken(token: string): JwtPayload {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (e) {
      console.error('Invalid JWT Token', e);
      return null!;
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    console.log('Checking authentication, token:', token);
    if (!token) return false;

    const decoded = this.decodeToken(token);
    console.log('Decoded token:', decoded);
    if (!decoded || typeof decoded.exp !== 'number') return false;

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp > currentTime;
  }

  private deleteCookie(name: string): void {
    document.cookie = `${name}=; Max-Age=0; path=/; Secure; SameSite=Lax`;
  }

  private startAutoLogout(exp: number): void {
    const now = Date.now();
    const expiry = exp * 1000; // `exp` is in seconds, JS uses milliseconds
    const timeout = expiry - now;

    if (timeout > 0) {
      this.logoutTimeout = setTimeout(() => this.logout(), timeout);
    }
  }

  private clearAutoLogout(): void {
    if (this.logoutTimeout) {
      clearTimeout(this.logoutTimeout);
    }
  }
}
