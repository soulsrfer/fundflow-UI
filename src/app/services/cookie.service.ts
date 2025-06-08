// src/app/cookie.service.ts
import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, Optional } from '@angular/core';
import { Request, Response } from 'express';
import { REQUEST, RESPONSE } from 'tokens';

@Injectable({
  providedIn: 'root',
})
export class CookieService {
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject(REQUEST) private request?: Request,
    @Optional() @Inject(RESPONSE) private response?: Response
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  setCookie(name: string, value: string, hours = 1): void {
    console.log('Setting cookie:', name, 'Value:', value, 'Expires in hours:', hours);
    try {
      const expires = new Date(Date.now() + hours * 60 * 60 * 1000);
      const cookieStr = `${name}=${encodeURIComponent(value)}; Path=/; Expires=${expires.toUTCString()}; SameSite=Lax${this.isBrowser ? '; Secure' : ''}`;

      if (this.isBrowser) {
        document.cookie = cookieStr;
      } else if (this.response) {
        this.response.cookie(name, value, {
          expires,
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          path: '/'
        });
      }
    } catch (error) {
      console.error('CookieService setCookie error:', error);
    }
  }

  getCookie(name: string): string | undefined {
    console.log('Getting cookie:', name);
    try {
      if (this.isBrowser) {
        return this.getBrowserCookie(name);
      } 
      return this.getServerCookie(name);
    } catch (error) {
      console.error('CookieService getCookie error:', error);
      return undefined;
    }
  }

  private getBrowserCookie(name: string): string | undefined {
    console.log('Getting cookie:', name);
    const match = document.cookie.match(
      new RegExp('(^| )' + name + '=([^;]+)')
    );
    return match ? decodeURIComponent(match[2]) : undefined;
  }

  private getServerCookie(name: string): string | undefined {
    if (!this.request?.cookies) return undefined;
    return this.request.cookies[name];
  }

  deleteCookie(name: string): void {
    console.log('Deleting cookie:', name);
    try {
      if (this.isBrowser) {
        document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
      } else if (this.response) {
        this.response.clearCookie(name, {
          path: '/',
          httpOnly: true,
          secure: true,
          sameSite: 'lax'
        });
      }
    } catch (error) {
      console.error('CookieService deleteCookie error:', error);
    }
  }
}