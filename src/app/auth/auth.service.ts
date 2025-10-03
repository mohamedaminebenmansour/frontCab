import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginDto } from '../models/login-dto';
import { TokenResponseDto } from '../models/token-response-dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(loginData: LoginDto): Observable<TokenResponseDto> {
    return this.http.post<TokenResponseDto>(`${this.apiUrl}/auth/login`, loginData).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('authToken', response.token);
          console.log('Login successful! Token stored:', response.token);
          this.logTokenDetails(response.token);
        } else {
          console.error('No token in response');
        }
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/logout`, {}).pipe(
      tap(() => {
        localStorage.removeItem('authToken');
        console.log('Logout successful! Token removed from localStorage');
      })
    );
  }

  getToken(): string | null {
    const token = localStorage.getItem('authToken');
    console.log('Retrieved token:', token ? 'Exists' : 'None');
    return token;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const isExpired = this.isTokenExpired(token);
      console.log('Token status:', isExpired ? 'Expired' : 'Valid');
      if (isExpired) {
        localStorage.removeItem('authToken');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error checking token:', error);
      return false;
    }
  }

  private isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) return true;
    return Date.now() >= payload.exp * 1000;
  }

  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Token decoding failed:', error);
      return null;
    }
  }

  private logTokenDetails(token: string): void {
    const payload = this.decodeToken(token);
    console.log('Decoded token payload for testing:', payload);
  }
}