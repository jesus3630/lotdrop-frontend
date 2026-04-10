import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-import-export',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="page">
      <h1>Import / Export</h1>

      <div class="cards-row">
        <mat-card class="io-card">
          <mat-icon class="io-icon">upload_file</mat-icon>
          <h3>Import Listings</h3>
          <p>Upload a CSV file with your listings. Columns: title, price, listingType, platforms, condition, description, location</p>
          <button mat-flat-button color="primary" (click)="csvInput.click()">
            <mat-icon>upload</mat-icon> Choose CSV File
          </button>
          <input #csvInput type="file" accept=".csv" hidden (change)="onImport($event)">
          <p *ngIf="importMsg" class="msg">{{ importMsg }}</p>
        </mat-card>

        <mat-card class="io-card">
          <mat-icon class="io-icon">download</mat-icon>
          <h3>Export Listings</h3>
          <p>Download all your listings as a CSV file for backup or editing.</p>
          <button mat-flat-button color="accent" (click)="exportCsv()">
            <mat-icon>download</mat-icon> Export to CSV
          </button>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 32px; }
    h1 { margin: 0 0 24px; font-size: 24px; color: #333; }
    .cards-row { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; max-width: 800px; }
    .io-card { padding: 32px; text-align: center; }
    .io-icon { font-size: 48px; height: 48px; width: 48px; color: #4fc3f7; margin-bottom: 16px; }
    h3 { margin: 0 0 12px; }
    p { color: #666; font-size: 14px; margin-bottom: 16px; }
    .msg { color: #43a047; margin-top: 12px; }
  `],
})
export class ImportExportComponent {
  importMsg = '';

  constructor(private api: ApiService) {}

  onImport(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(l => l.trim());
      const headers = lines[0].split(',');
      const listings = lines.slice(1).map(line => {
        const vals = line.split(',');
        const obj: any = {};
        headers.forEach((h, i) => obj[h.trim()] = vals[i]?.trim());
        if (obj.platforms) obj.platforms = obj.platforms.split('|');
        return obj;
      });
      let done = 0;
      listings.forEach(l => {
        this.api.post('/api/listings', l).subscribe(() => {
          done++;
          if (done === listings.length) this.importMsg = `Imported ${done} listings!`;
        });
      });
    };
    reader.readAsText(file);
  }

  exportCsv() {
    this.api.get<any[]>('/api/listings').subscribe(listings => {
      const headers = ['title', 'price', 'listingType', 'platforms', 'condition', 'description', 'location', 'status'];
      const rows = listings.map(l => headers.map(h => {
        const val = l[h];
        return Array.isArray(val) ? val.join('|') : (val ?? '');
      }));
      const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'lotdrop-listings.csv'; a.click();
      URL.revokeObjectURL(url);
    });
  }
}
