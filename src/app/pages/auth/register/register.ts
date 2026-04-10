import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatInputModule, MatButtonModule, MatCardModule, MatFormFieldModule],
  template: `
    <div class="auth-page">
      <mat-card class="auth-card">
        <div class="brand">LotDrop</div>
        <h2>Create account</h2>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Full Name</mat-label>
            <input matInput formControlName="name">
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email">
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Password</mat-label>
            <input matInput type="password" formControlName="password">
          </mat-form-field>
          <p class="error" *ngIf="error">{{ error }}</p>
          <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || loading" class="full-width">
            {{ loading ? 'Creating...' : 'Create Account' }}
          </button>
        </form>
        <p class="link">Already have an account? <a routerLink="/login">Sign in</a></p>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-page { height:100vh; display:flex; align-items:center; justify-content:center; background:#f5f7fa; }
    .auth-card { padding:32px; width:380px; }
    .brand { font-size:28px; font-weight:700; color:#4fc3f7; margin-bottom:8px; }
    h2 { margin:0 0 24px; color:#333; }
    .full-width { width:100%; margin-bottom:8px; }
    .error { color:#e53935; font-size:14px; margin-bottom:8px; }
    .link { margin-top:16px; text-align:center; font-size:14px; }
    a { color:#4fc3f7; }
  `],
})
export class RegisterComponent {
  form: FormGroup;
  error = '';
  loading = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    this.auth.register(this.form.value.email, this.form.value.password, this.form.value.name).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (e) => { this.error = e.error?.message || 'Registration failed'; this.loading = false; },
    });
  }
}
