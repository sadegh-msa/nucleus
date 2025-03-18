import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CookieService {

  setCookie(key: string, value: unknown, exMinutes?: number) {
    let expires = '';

    if (exMinutes) {
      const date = new Date();
      date.setTime(date.getTime() + (exMinutes * 60 * 1000));
      expires = 'expires=' + date.toUTCString();
    }

    document.cookie = `${key}=${value};${expires};path=/`;
  }

  getCookie(key: string) {
    const decodedCookie = decodeURIComponent(document.cookie);
    const pairs = decodedCookie.split(';').map(i => i.trim().split('=').map(v => v.trim()));

    return (pairs.find(([k, v]) => k === key) || [])[1] || '';
  }

  deleteCookie(key: string) {
    this.setCookie(key, '', -1);
  }
}
