import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatDividerModule],
  template: `
    <div class="page">
      <h1>Settings</h1>

      <mat-card class="settings-card">
        <h3>Profile</h3>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Full Name</mat-label>
          <input matInput [(ngModel)]="name">
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Default Location</mat-label>
          <input matInput [(ngModel)]="location" placeholder="e.g. Dallas, Texas">
        </mat-form-field>
        <button mat-flat-button color="primary" (click)="saveProfile()">Save Profile</button>
        <p *ngIf="profileSaved" class="success">Saved!</p>
      </mat-card>

      <mat-card class="settings-card">
        <h3>Facebook Connection</h3>
        <p class="hint">Paste your Facebook session cookie (c_user and xs values) to enable automatic posting.</p>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Facebook Cookie</mat-label>
          <textarea matInput [(ngModel)]="facebookCookie" rows="4" placeholder='{"c_user":"...", "xs":"..."}'></textarea>
        </mat-form-field>
        <button mat-flat-button color="primary" (click)="saveFacebook()">Save Facebook Cookie</button>
        <p *ngIf="fbSaved" class="success">Saved!</p>
      </mat-card>
    </div>
  `,
  styles: [`
    .page { padding: 32px; max-width: 640px; }
    h1 { margin: 0 0 24px; font-size: 24px; color: #333; }
    .settings-card { padding: 24px; margin-bottom: 24px; }
    h3 { margin: 0 0 16px; }
    .full-width { width: 100%; margin-bottom: 8px; }
    .hint { color: #666; font-size: 13px; margin-bottom: 12px; }
    .success { color: #43a047; font-size: 14px; margin-top: 8px; }
  `],
})
export class SettingsComponent implements OnInit {
  name = '';
  location = '';
  facebookCookie = '';
  profileSaved = false;
  fbSaved = false;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.get<any>('/api/users/me').subscribe(u => {
      this.name = u.name || '';
      this.location = u.defaultLocation || '';
      this.facebookCookie = u.facebookCookie || '';
    });
  }

  saveProfile() {
    this.api.patch('/api/users/me', { name: this.name, defaultLocation: this.location }).subscribe(() => {
      this.profileSaved = true;
      setTimeout(() => this.profileSaved = false, 2000);
    });
  }

  saveFacebook() {
    this.api.patch('/api/users/me', { facebookCookie: this.facebookCookie }).subscribe(() => {
      this.fbSaved = true;
      setTimeout(() => this.fbSaved = false, 2000);
    });
  }
}
