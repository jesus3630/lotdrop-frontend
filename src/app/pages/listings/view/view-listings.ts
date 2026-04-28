import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-view-listings',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, MatTableModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, MatCheckboxModule, MatChipsModule, MatMenuModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>Listings</h1>
        <div class="header-actions">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Search</mat-label>
            <input matInput [(ngModel)]="searchTerm" (ngModelChange)="onSearch()" placeholder="Search listings...">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
          <button mat-icon-button (click)="load()" title="Refresh">
            <mat-icon>refresh</mat-icon>
          </button>
          <a mat-flat-button color="primary" routerLink="/add-listing">
            <mat-icon>add</mat-icon> Add Listing
          </a>
        </div>
      </div>

      <div class="table-container">
        <table mat-table [dataSource]="listings" class="listings-table">
          <ng-container matColumnDef="select">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let row">
              <mat-checkbox [(ngModel)]="row.selected"></mat-checkbox>
            </td>
          </ng-container>

          <ng-container matColumnDef="image">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let row">
              <img *ngIf="row.images?.length" [src]="apiUrl + row.images[0]" class="thumb" alt="car">
              <div *ngIf="!row.images?.length" class="no-img"><mat-icon>directions_car</mat-icon></div>
            </td>
          </ng-container>

          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>Title</th>
            <td mat-cell *matCellDef="let row">
              <div class="listing-title">{{ row.title }}</div>
            </td>
          </ng-container>

          <ng-container matColumnDef="price">
            <th mat-header-cell *matHeaderCellDef>Price</th>
            <td mat-cell *matCellDef="let row">\${{ row.price }}</td>
          </ng-container>

          <ng-container matColumnDef="category">
            <th mat-header-cell *matHeaderCellDef>Category</th>
            <td mat-cell *matCellDef="let row">{{ row.listingType | titlecase }}</td>
          </ng-container>

          <ng-container matColumnDef="campaign">
            <th mat-header-cell *matHeaderCellDef>Campaign</th>
            <td mat-cell *matCellDef="let row">{{ row.campaign?.name || '—' }}</td>
          </ng-container>

          <ng-container matColumnDef="location">
            <th mat-header-cell *matHeaderCellDef>Location</th>
            <td mat-cell *matCellDef="let row">{{ row.location || '—' }}</td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let row">
              <span class="status-badge" [class]="row.status">{{ row.status }}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let row">
              <button mat-stroked-button [matMenuTriggerFor]="menu" class="edit-btn">
                Edit <mat-icon>arrow_drop_down</mat-icon>
              </button>
              <mat-menu #menu="matMenu">
                <a mat-menu-item [routerLink]="['/listings', row.id, 'edit']">
                  <mat-icon>edit</mat-icon> Edit
                </a>
                <button mat-menu-item (click)="postNow(row)" [disabled]="posting[row.id]">
                  <mat-icon>send</mat-icon> {{ posting[row.id] ? 'Posting...' : 'Post to Facebook Now' }}
                </button>
                <button mat-menu-item (click)="schedulePost(row)">
                  <mat-icon>schedule</mat-icon> Schedule Post
                </button>
                <button mat-menu-item (click)="deleteListing(row)">
                  <mat-icon>delete</mat-icon> Delete
                </button>
              </mat-menu>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <p style="padding:8px 16px;color:#666;font-size:13px;">
          Status: {{ loading ? 'loading...' : (loadError || (listings.length + ' listing(s) found')) }}
        </p>

        <div *ngIf="loading" class="empty-state">
          <p>Loading listings...</p>
        </div>

        <div *ngIf="loadError" class="empty-state error-state">
          <mat-icon>error_outline</mat-icon>
          <p>{{ loadError }}</p>
          <button mat-stroked-button (click)="load()">Retry</button>
        </div>

        <div *ngIf="!loading && !loadError && listings.length === 0" class="empty-state">
          <mat-icon>inventory_2</mat-icon>
          <p>No listings yet. <a routerLink="/add-listing">Add your first listing</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 32px; }
    .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
    h1 { margin: 0; font-size: 24px; color: #333; }
    .header-actions { display: flex; align-items: center; gap: 12px; }
    .search-field { width: 280px; }
    .table-container { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
    .listings-table { width: 100%; }
    .thumb { width: 60px; height: 45px; object-fit: cover; border-radius: 4px; display: block; }
    .no-img { width: 60px; height: 45px; display: flex; align-items: center; justify-content: center; background: #eee; border-radius: 4px; color: #999; }
    .listing-title { font-weight: 500; }
    .status-badge { padding: 2px 8px; border-radius: 12px; font-size: 12px; text-transform: capitalize; }
    .status-badge.draft { background: #fff3e0; color: #e65100; }
    .status-badge.posted { background: #e8f5e9; color: #2e7d32; }
    .status-badge.scheduled { background: #e3f2fd; color: #1565c0; }
    .status-badge.failed { background: #ffebee; color: #c62828; }
    .edit-btn { font-size: 13px; }
    .empty-state { padding: 48px; text-align: center; color: #999; }
    .empty-state mat-icon { font-size: 48px; height: 48px; width: 48px; }
    .empty-state a { color: #4fc3f7; }
    .error-state { color: #c62828; }
    .error-state mat-icon { color: #c62828; }
  `],
})
export class ViewListingsComponent implements OnInit {
  listings: any[] = [];
  searchTerm = '';
  displayedColumns = ['select', 'image', 'title', 'price', 'category', 'campaign', 'location', 'status', 'actions'];
  apiUrl = environment.apiUrl;
  posting: Record<string, boolean> = {};
  loading = false;
  loadError = '';

  constructor(private api: ApiService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.loadError = '';
    const params = this.searchTerm ? `?search=${this.searchTerm}` : '';
    this.api.get<any[]>(`/api/listings${params}`).subscribe({
      next: l => { this.listings = l; this.loading = false; },
      error: () => { this.loadError = 'Could not load listings. Try refreshing.'; this.loading = false; },
    });
  }

  onSearch() { this.load(); }

  postNow(row: any) {
    if (!confirm(`Post "${row.title}" to Facebook Marketplace now?`)) return;
    this.posting[row.id] = true;
    this.api.post(`/api/poster/post/${row.id}`, {}).subscribe({
      next: (res: any) => {
        this.posting[row.id] = false;
        if (res.success) {
          alert(`Posted successfully!${res.url ? '\n' + res.url : ''}`);
          this.load();
        } else {
          alert(`Failed: ${res.error}`);
        }
      },
      error: (e) => {
        this.posting[row.id] = false;
        alert(`Error: ${e.error?.message || 'Post failed'}`);
      },
    });
  }

  schedulePost(row: any) {
    const input = prompt('Schedule date/time (e.g. 2026-04-11T10:00):');
    if (!input) return;
    const scheduledAt = new Date(input);
    if (isNaN(scheduledAt.getTime())) { alert('Invalid date'); return; }
    this.api.post(`/api/poster/schedule/${row.id}`, { scheduledAt }).subscribe({
      next: () => { alert(`Scheduled for ${scheduledAt.toLocaleString()}`); this.load(); },
      error: (e) => alert(`Error: ${e.error?.message}`),
    });
  }

  deleteListing(row: any) {
    if (!confirm(`Delete "${row.title}"?`)) return;
    this.api.delete(`/api/listings/${row.id}`).subscribe(() => this.load());
  }
}
