import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { environment } from '@environments/environment';
import { PlatformService } from './platform.service';
import { ApiResponse } from '@interfaces/api-response.interface';
import { jwtDecode } from 'jwt-decode';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenKey = 'auth_token';
  private readonly apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private platform = inject(PlatformService);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {
    if (this.platform.isbrowser()) {
      const token = this.getToken();
      token && this.currentUserSubject.next(this.getDecodedAccessToken(token));
    }
  }

  login(payload: { username: string; password: string }): Observable<string> {
    return this.http.post<ApiResponse<string>>(`${this.apiUrl}/user/login`, payload).pipe(
      tap(response => {
        const token = response.data;
        console.log('Login successful, token received:', token);
        this.setToken(token);
        this.currentUserSubject.next(this.getDecodedAccessToken(token));
      }),
      map(response => response.data),
      catchError(err => this.handleError(err))
    );
  }

  handleAuthentication(token: string | null) {
    if (!token) return null;
    
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
    } catch {
      return null;
    }
  }

  logout(): void {
    this.currentUserSubject.next(null);
    this.router.navigateByUrl('/login');
    localStorage.removeItem(this.tokenKey);
    
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

  private handleError(errorRes: HttpErrorResponse) {
    const errorMessage = errorRes.status === 401 
      ? 'username or password incorrect.' 
      : 'An unknown error occurred!';
      
    return throwError(() => new Error(errorMessage));
  }

  getToken(): string | null {
    return this.platform.isbrowser() 
      ? localStorage.getItem(this.tokenKey) 
      : null;
  }

  setToken(token: string): void {
    this.platform.isbrowser() && localStorage.setItem(this.tokenKey, token);
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
    localStorage.removeItem(this.tokenKey);
  }

  autoLogin() {
    const token = this.getToken();
    const user = this.handleAuthentication(token);
    
    if (user) {
      this.currentUserSubject.next(user);
      this.autoLogout(new Date(user.exp).getTime() - Date.now());
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      console.warn('[Auth] ❌ No token found - user not authenticated');
      return false;
    }

    const decoded = this.getDecodedAccessToken(token);
    if (!decoded?.exp) {
      console.error('[Auth] ❌ Invalid token structure - missing expiration or undecodable');
      return false;
    }

    const expirationDate = new Date(decoded.exp * 1000);
    const isValid = expirationDate > new Date();
    
    console.log(`[Auth] Token validity: ${isValid ? '✅ VALID' : '❌ EXPIRED'}`);
    return isValid;
  }
}