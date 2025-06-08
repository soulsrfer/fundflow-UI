import { isPlatformBrowser } from '@angular/common';
import {
  Inject,
  Injectable,
  InjectionToken,
  Optional,
  PLATFORM_ID,
} from '@angular/core';
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
    const expires = new Date(Date.now() + hours * 60 * 60 * 1000).toUTCString();
    const cookieStr = `${name}=${encodeURIComponent(
      value
    )}; Path=/; Expires=${expires}; SameSite=Lax; Secure`;

    if (this.isBrowser) {
      document.cookie = cookieStr;
    } else if (this.response) {
      // Append to existing Set-Cookie headers
      const existing = this.response.getHeader('Set-Cookie');
      const existingCookies: string[] = Array.isArray(existing)
        ? existing
        : typeof existing === 'string'
        ? [existing]
        : [];

      this.response.setHeader('Set-Cookie', [...existingCookies, cookieStr]);
    }
  }

  getCookie(name: string): string | undefined {
    if (this.isBrowser) {
      const matches = document.cookie.match(
        new RegExp(`(?:^|; )${name}=([^;]*)`)
      );
      return matches ? decodeURIComponent(matches[1]) : undefined;
    } else if (this.request) {
      const raw = this.request.headers.cookie;
      if (!raw) return undefined;
      const cookies = Object.fromEntries(
        raw.split('; ').map((c) => c.split('='))
      );
      return decodeURIComponent(cookies[name] || '');
    }
    return undefined;
  }

  deleteCookie(name: string): void {
    const expires = new Date(0).toUTCString();
    const cookieStr = `${name}=; Path=/; Expires=${expires}; SameSite=Lax; Secure`;

    if (this.isBrowser) {
      document.cookie = cookieStr;
    } else if (this.response) {
      const existing = this.response.getHeader('Set-Cookie');
      const existingCookies: string[] = Array.isArray(existing)
        ? existing
        : typeof existing === 'string'
        ? [existing]
        : [];

      this.response.setHeader('Set-Cookie', [...existingCookies, cookieStr]);
    }
  }
}
