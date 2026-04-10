import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="page">
      <h1>Welcome back, {{ auth.currentUser()?.name }}</h1>
      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-icon>list</mat-icon>
          <div class="stat-num">{{ stats.total }}</div>
          <div class="stat-label">Total Listings</div>
        </mat-card>
        <mat-card class="stat-card active">
          <mat-icon>check_circle</mat-icon>
          <div class="stat-num">{{ stats.posted }}</div>
          <div class="stat-label">Posted</div>
        </mat-card>
        <mat-card class="stat-card scheduled">
          <mat-icon>schedule</mat-icon>
          <div class="stat-num">{{ stats.scheduled }}</div>
          <div class="stat-label">Scheduled</div>
        </mat-card>
        <mat-card class="stat-card draft">
          <mat-icon>edit</mat-icon>
          <div class="stat-num">{{ stats.draft }}</div>
          <div class="stat-label">Drafts</div>
        </mat-card>
      </div>
      <div class="quick-actions">
        <a mat-flat-button color="primary" routerLink="/add-listing">
          <mat-icon>add</mat-icon> Add Listing
        </a>
        <a mat-stroked-button routerLink="/listings">
          <mat-icon>list</mat-icon> View All Listings
        </a>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 32px; }
    h1 { margin: 0 0 24px; font-size: 24px; color: #333; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
    .stat-card { padding: 24px; text-align: center; }
    .stat-card mat-icon { font-size: 32px; height: 32px; width: 32px; color: #666; }
    .stat-card.active mat-icon { color: #43a047; }
    .stat-card.scheduled mat-icon { color: #1e88e5; }
    .stat-card.draft mat-icon { color: #fb8c00; }
    .stat-num { font-size: 36px; font-weight: 700; margin: 8px 0 4px; color: #1a1a2e; }
    .stat-label { font-size: 14px; color: #666; }
    .quick-actions { display: flex; gap: 12px; }
    .quick-actions a mat-icon { margin-right: 4px; }
  `],
})
export class DashboardComponent implements OnInit {
  stats = { total: 0, posted: 0, scheduled: 0, draft: 0 };

  constructor(public auth: AuthService, private api: ApiService) {}

  ngOnInit() {
    this.api.get<any[]>('/api/listings').subscribe(listings => {
      this.stats.total = listings.length;
      this.stats.posted = listings.filter(l => l.status === 'posted').length;
      this.stats.scheduled = listings.filter(l => l.status === 'scheduled').length;
      this.stats.draft = listings.filter(l => l.status === 'draft').length;
    });
  }
}
