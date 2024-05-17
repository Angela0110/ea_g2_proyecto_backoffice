import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LogIn } from '../models/logIn';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authTokenKey = 'authToken'; // Clave para el token en localStorage

  constructor(private http: HttpClient) {}

  getAuthToken(): string | null {
    return localStorage.getItem(this.authTokenKey);
  }

  signIn(logIn: LogIn): Observable<any> {
    return this.http.post<any>('http://127.0.0.1:3000/signin', logIn);
  }

  setAuthToken(token: string): void {
    localStorage.setItem(this.authTokenKey, token);
  }
}
