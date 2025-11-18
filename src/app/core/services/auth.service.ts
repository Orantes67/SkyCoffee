// src/app/core/services/auth.service.ts
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/ usuario.model';
import { AuthResponse, LoginRequest } from '../models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api'; // Ajusta tu URL
  currentUser = signal<Usuario | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          if (response.user) {
            this.setCurrentUser(response.user);
          }
        })
      );
  }

  register(user: Usuario): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, user)
      .pipe(
        tap(response => {
          if (response.user) {
            this.setCurrentUser(response.user);
          }
        })
      );
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    return this.currentUser()?.rol === 'admin';
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  private setCurrentUser(user: Usuario): void {
    this.currentUser.set(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUser.set(user);
      } catch (e) {
        localStorage.removeItem('currentUser');
      }
    }
  }
}