import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>Templates</h1>
      </div>
      <div *ngIf="templates.length === 0" class="empty-state">
        <mat-icon>description</mat-icon>
        <p>No templates yet. Save a listing as a template from the <a routerLink="/add-listing">Add Listing</a> page.</p>
      </div>
      <div class="templates-grid">
        <mat-card *ngFor="let t of templates" class="template-card">
          <mat-card-title>{{ t.name }}</mat-card-title>
          <mat-card-content>
            <p *ngIf="t.title">{{ t.title }}</p>
            <p *ngIf="t.price">\${{ t.price }}</p>
            <p class="platforms">{{ t.platforms?.join(', ') }}</p>
          </mat-card-content>
          <mat-card-actions>
            <a mat-button color="primary" [routerLink]="['/add-listing']" [queryParams]="{template: t.id}">Use</a>
            <button mat-button color="warn" (click)="delete(t)">Delete</button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 32px; }
    .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
    h1 { margin: 0; font-size: 24px; color: #333; }
    .templates-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
    .template-card { padding: 16px; }
    .platforms { color: #888; font-size: 13px; }
    .empty-state { padding: 48px; text-align: center; color: #999; }
    .empty-state mat-icon { font-size: 48px; height: 48px; width: 48px; }
    .empty-state a { color: #4fc3f7; }
  `],
})
export class TemplatesComponent implements OnInit {
  templates: any[] = [];
  constructor(private api: ApiService) {}
  ngOnInit() { this.api.get<any[]>('/api/templates').subscribe(t => this.templates = t); }
  delete(t: any) {
    if (!confirm(`Delete template "${t.name}"?`)) return;
    this.api.delete(`/api/templates/${t.id}`).subscribe(() => this.templates = this.templates.filter(x => x.id !== t.id));
  }
}
