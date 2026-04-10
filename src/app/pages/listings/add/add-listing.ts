import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../../core/services/api.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-add-listing',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule, MatRadioModule, MatButtonModule, MatCardModule, MatIconModule],
  template: `
    <div class="page">
      <h1>{{ editId ? 'Edit Listing' : 'Add Listing' }}</h1>
      <mat-card class="form-card">
        <form [formGroup]="form" (ngSubmit)="submit()">

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Template</mat-label>
            <mat-select formControlName="templateId" (selectionChange)="applyTemplate($event.value)">
              <mat-option value="">none</mat-option>
              <mat-option *ngFor="let t of templates" [value]="t.id">{{ t.name }}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Campaign</mat-label>
            <mat-select formControlName="campaignId">
              <mat-option value="">none</mat-option>
              <mat-option *ngFor="let c of campaigns" [value]="c.id">{{ c.name }}</mat-option>
            </mat-select>
          </mat-form-field>

          <div class="field-group">
            <label class="field-label">Listing type</label>
            <mat-radio-group formControlName="listingType" class="radio-group">
              <mat-radio-button value="item">item</mat-radio-button>
              <mat-radio-button value="housing">housing</mat-radio-button>
              <mat-radio-button value="vehicle">vehicle</mat-radio-button>
            </mat-radio-group>
          </div>

          <div class="field-group">
            <label class="field-label">Platform(s)</label>
            <div class="checkbox-group">
              <mat-checkbox (change)="togglePlatform('facebook', $event.checked)" [checked]="hasPlatform('facebook')">facebook</mat-checkbox>
              <mat-checkbox (change)="togglePlatform('offerup', $event.checked)" [checked]="hasPlatform('offerup')">offerup</mat-checkbox>
              <mat-checkbox (change)="togglePlatform('craigslist', $event.checked)" [checked]="hasPlatform('craigslist')">craigslist</mat-checkbox>
            </div>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Title</mat-label>
            <input matInput formControlName="title">
          </mat-form-field>

          <mat-form-field appearance="outline" class="price-field">
            <mat-label>Price</mat-label>
            <span matTextPrefix>$&nbsp;</span>
            <input matInput type="number" formControlName="price" min="0">
          </mat-form-field>

          <div class="field-group">
            <label class="field-label">Images</label>
            <div class="images-grid">
              <div class="image-thumb" *ngFor="let img of uploadedImages; let i = index">
                <img [src]="apiUrl + img" alt="listing image">
                <button type="button" mat-icon-button class="remove-img" (click)="removeImage(i)">
                  <mat-icon>close</mat-icon>
                </button>
              </div>
              <div class="upload-box" (click)="fileInput.click()">
                <mat-icon>add</mat-icon>
                <input #fileInput type="file" multiple accept="image/*" hidden (change)="onFilesSelected($event)">
              </div>
            </div>
            <p *ngIf="uploading" class="uploading-text">Uploading...</p>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Condition</mat-label>
            <mat-select formControlName="condition">
              <mat-option value="New">New</mat-option>
              <mat-option value="Used - Like New">Used - Like New</mat-option>
              <mat-option value="Used - Good">Used - Good</mat-option>
              <mat-option value="Used - Fair">Used - Fair</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Description</mat-label>
            <textarea matInput formControlName="description" rows="5"></textarea>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Location</mat-label>
            <input matInput formControlName="location" placeholder="e.g. Dallas, Texas">
          </mat-form-field>

          <p class="error" *ngIf="error">{{ error }}</p>

          <div class="actions">
            <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || loading">
              {{ loading ? 'Saving...' : 'Save Listing' }}
            </button>
            <button mat-stroked-button type="button" [disabled]="form.invalid || loading" (click)="saveAsTemplate()">
              Save as Template
            </button>
            <a mat-button routerLink="/listings">Cancel</a>
          </div>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`
    .page { padding: 32px; max-width: 720px; }
    h1 { margin: 0 0 24px; font-size: 24px; color: #333; }
    .form-card { padding: 32px; }
    .full-width { width: 100%; margin-bottom: 8px; }
    .price-field { width: 200px; margin-bottom: 8px; }
    .field-group { margin-bottom: 16px; }
    .field-label { display: block; font-size: 14px; color: #666; margin-bottom: 8px; }
    .radio-group { display: flex; gap: 16px; }
    .checkbox-group { display: flex; gap: 16px; }
    .images-grid { display: flex; flex-wrap: wrap; gap: 8px; }
    .image-thumb { position: relative; width: 100px; height: 100px; }
    .image-thumb img { width: 100%; height: 100%; object-fit: cover; border-radius: 4px; }
    .remove-img { position: absolute; top: -8px; right: -8px; background: white; width: 24px; height: 24px; line-height: 24px; }
    .remove-img mat-icon { font-size: 16px; }
    .upload-box { width: 100px; height: 100px; border: 2px dashed #ccc; border-radius: 4px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #999; }
    .upload-box:hover { border-color: #4fc3f7; color: #4fc3f7; }
    .uploading-text { color: #666; font-size: 13px; margin: 4px 0; }
    .error { color: #e53935; font-size: 14px; }
    .actions { display: flex; gap: 12px; margin-top: 16px; }
  `],
})
export class AddListingComponent implements OnInit {
  form: FormGroup;
  templates: any[] = [];
  campaigns: any[] = [];
  uploadedImages: string[] = [];
  platforms: string[] = [];
  uploading = false;
  loading = false;
  error = '';
  editId: string | null = null;
  apiUrl = environment.apiUrl;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.form = this.fb.group({
      templateId: [''],
      campaignId: [''],
      listingType: ['vehicle'],
      title: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      condition: ['Used - Good'],
      description: [''],
      location: [''],
    });
  }

  ngOnInit() {
    this.api.get<any[]>('/api/templates').subscribe(t => this.templates = t);
    this.api.get<any[]>('/api/campaigns').subscribe(c => this.campaigns = c);

    this.editId = this.route.snapshot.paramMap.get('id');
    if (this.editId) {
      this.api.get<any>(`/api/listings/${this.editId}`).subscribe(l => {
        this.form.patchValue({ ...l, campaignId: l.campaign?.id || '' });
        this.uploadedImages = l.images || [];
        this.platforms = l.platforms || [];
      });
    }
  }

  hasPlatform(p: string) { return this.platforms.includes(p); }

  togglePlatform(p: string, checked: boolean) {
    if (checked) { if (!this.platforms.includes(p)) this.platforms.push(p); }
    else { this.platforms = this.platforms.filter(x => x !== p); }
  }

  onFilesSelected(event: any) {
    const files: FileList = event.target.files;
    if (!files.length) return;
    const fd = new FormData();
    Array.from(files).forEach(f => fd.append('files', f));
    this.uploading = true;
    this.api.upload<{ urls: string[] }>('/api/images/upload', fd).subscribe({
      next: res => { this.uploadedImages.push(...res.urls); this.uploading = false; },
      error: () => { this.error = 'Image upload failed'; this.uploading = false; },
    });
  }

  removeImage(i: number) { this.uploadedImages.splice(i, 1); }

  applyTemplate(id: string) {
    if (!id) return;
    const t = this.templates.find(x => x.id === id);
    if (!t) return;
    this.form.patchValue({ title: t.title || '', price: t.price || 0, listingType: t.listingType || 'vehicle', condition: t.condition || 'Used - Good', description: t.description || '', location: t.location || '' });
    if (t.platforms) this.platforms = [...t.platforms];
  }

  buildPayload() {
    const v = this.form.value;
    return {
      title: v.title, price: v.price, listingType: v.listingType,
      platforms: this.platforms, images: this.uploadedImages,
      condition: v.condition, description: v.description, location: v.location,
      campaign: v.campaignId ? { id: v.campaignId } : null,
    };
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    const payload = this.buildPayload();
    const req = this.editId
      ? this.api.patch(`/api/listings/${this.editId}`, payload)
      : this.api.post('/api/listings', payload);
    req.subscribe({
      next: () => this.router.navigate(['/listings']),
      error: (e) => { this.error = e.error?.message || 'Failed to save'; this.loading = false; },
    });
  }

  saveAsTemplate() {
    const v = this.form.value;
    const name = prompt('Template name:');
    if (!name) return;
    this.api.post('/api/templates', {
      name, title: v.title, price: v.price, listingType: v.listingType,
      platforms: this.platforms, condition: v.condition, description: v.description, location: v.location,
    }).subscribe({ next: () => alert('Template saved!') });
  }
}
