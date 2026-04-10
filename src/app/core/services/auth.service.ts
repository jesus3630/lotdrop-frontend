import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<any>(null);

  constructor(private api: ApiService, private router: Router) {
    const stored = localStorage.getItem('user');
    if (stored) this.currentUser.set(JSON.parse(stored));
  }

  register(email: string, password: string, name: string) {
    return this.api.post<any>('/api/auth/register', { email, password, name }).pipe(
      tap(res => this.setSession(res))
    );
  }

  login(email: string, password: string) {
    return this.api.post<any>('/api/auth/login', { email, password }).pipe(
      tap(res => this.setSession(res))
    );
  }

  private setSession(res: { token: string; user: any }) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    this.currentUser.set(res.user);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }
}
