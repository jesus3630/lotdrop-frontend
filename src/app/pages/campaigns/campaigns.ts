import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-campaigns',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule, MatDialogModule, MatInputModule, MatFormFieldModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>Campaigns</h1>
        <button mat-flat-button color="primary" (click)="showForm = true">
          <mat-icon>add</mat-icon> New Campaign
        </button>
      </div>

      <mat-card *ngIf="showForm" class="form-card">
        <h3>{{ editingId ? 'Edit Campaign' : 'New Campaign' }}</h3>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Name</mat-label>
          <input matInput [(ngModel)]="newName">
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <input matInput [(ngModel)]="newDescription">
        </mat-form-field>
        <div class="form-actions">
          <button mat-flat-button color="primary" (click)="save()">Save</button>
          <button mat-button (click)="cancelForm()">Cancel</button>
        </div>
      </mat-card>

      <div *ngIf="campaigns.length === 0 && !showForm" class="empty-state">
        <mat-icon>campaign</mat-icon>
        <p>No campaigns yet. Create one to group and schedule your listings.</p>
      </div>

      <div class="campaigns-grid">
        <mat-card *ngFor="let c of campaigns" class="campaign-card">
          <mat-card-title>{{ c.name }}</mat-card-title>
          <mat-card-subtitle>{{ c.description }}</mat-card-subtitle>
          <mat-card-content>
            <p class="listing-count">{{ c.listings?.length || 0 }} listing(s)</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button (click)="edit(c)">Edit</button>
            <button mat-button color="warn" (click)="delete(c)">Delete</button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 32px; }
    .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
    h1 { margin: 0; font-size: 24px; color: #333; }
    .form-card { padding: 24px; margin-bottom: 24px; max-width: 500px; }
    .full-width { width: 100%; margin-bottom: 8px; }
    .form-actions { display: flex; gap: 8px; }
    .campaigns-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
    .listing-count { color: #666; font-size: 14px; }
    .empty-state { padding: 48px; text-align: center; color: #999; }
    .empty-state mat-icon { font-size: 48px; height: 48px; width: 48px; }
  `],
})
export class CampaignsComponent implements OnInit {
  campaigns: any[] = [];
  showForm = false;
  editingId: string | null = null;
  newName = '';
  newDescription = '';

  constructor(private api: ApiService) {}

  ngOnInit() { this.load(); }
  load() { this.api.get<any[]>('/api/campaigns').subscribe(c => this.campaigns = c); }

  save() {
    const payload = { name: this.newName, description: this.newDescription };
    const req = this.editingId
      ? this.api.patch(`/api/campaigns/${this.editingId}`, payload)
      : this.api.post('/api/campaigns', payload);
    req.subscribe(() => { this.cancelForm(); this.load(); });
  }

  edit(c: any) { this.editingId = c.id; this.newName = c.name; this.newDescription = c.description || ''; this.showForm = true; }

  cancelForm() { this.showForm = false; this.editingId = null; this.newName = ''; this.newDescription = ''; }

  delete(c: any) {
    if (!confirm(`Delete campaign "${c.name}"?`)) return;
    this.api.delete(`/api/campaigns/${c.id}`).subscribe(() => this.load());
  }
}
