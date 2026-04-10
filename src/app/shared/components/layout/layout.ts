import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatSidenavModule, MatListModule, MatIconModule, MatToolbarModule, MatButtonModule],
  template: `
    <mat-sidenav-container class="app-container">
      <mat-sidenav mode="side" opened class="sidenav">
        <div class="logo">
          <span class="logo-text">LotDrop</span>
        </div>
        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Home</span>
          </a>
          <a mat-list-item routerLink="/add-listing" routerLinkActive="active">
            <mat-icon matListItemIcon>add_circle</mat-icon>
            <span matListItemTitle>Add Listing</span>
          </a>
          <a mat-list-item routerLink="/listings" routerLinkActive="active">
            <mat-icon matListItemIcon>list</mat-icon>
            <span matListItemTitle>View Listings</span>
          </a>
          <a mat-list-item routerLink="/templates" routerLinkActive="active">
            <mat-icon matListItemIcon>description</mat-icon>
            <span matListItemTitle>Templates</span>
          </a>
          <a mat-list-item routerLink="/campaigns" routerLinkActive="active">
            <mat-icon matListItemIcon>campaign</mat-icon>
            <span matListItemTitle>Campaigns</span>
          </a>
          <a mat-list-item routerLink="/import-export" routerLinkActive="active">
            <mat-icon matListItemIcon>import_export</mat-icon>
            <span matListItemTitle>Import / Export</span>
          </a>
          <a mat-list-item routerLink="/settings" routerLinkActive="active">
            <mat-icon matListItemIcon>settings</mat-icon>
            <span matListItemTitle>Settings</span>
          </a>
          <a mat-list-item (click)="auth.logout()" style="cursor:pointer;">
            <mat-icon matListItemIcon>logout</mat-icon>
            <span matListItemTitle>Logout</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content class="main-content">
        <router-outlet />
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .app-container { height: 100vh; }
    .sidenav { width: 220px; background: #1a1a2e; color: white; }
    .logo { padding: 24px 16px 16px; }
    .logo-text { font-size: 24px; font-weight: 700; color: #4fc3f7; letter-spacing: 1px; }
    mat-nav-list a { color: #ccc; }
    mat-nav-list a.active { background: rgba(79,195,247,0.15); color: #4fc3f7; }
    mat-nav-list a:hover { background: rgba(255,255,255,0.05); }
    .main-content { background: #f5f7fa; padding: 0; }
    ::ng-deep .mat-mdc-list-item .mat-icon { color: inherit; }
  `],
})
export class LayoutComponent {
  constructor(public auth: AuthService) {}
}
