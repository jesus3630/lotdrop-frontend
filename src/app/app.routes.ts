import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/auth/login/login').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/auth/register/register').then(m => m.RegisterComponent) },
  {
    path: '',
    loadComponent: () => import('./shared/components/layout/layout').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardComponent) },
      { path: 'add-listing', loadComponent: () => import('./pages/listings/add/add-listing').then(m => m.AddListingComponent) },
      { path: 'listings', loadComponent: () => import('./pages/listings/view/view-listings').then(m => m.ViewListingsComponent) },
      { path: 'listings/:id/edit', loadComponent: () => import('./pages/listings/add/add-listing').then(m => m.AddListingComponent) },
      { path: 'templates', loadComponent: () => import('./pages/templates/templates').then(m => m.TemplatesComponent) },
      { path: 'campaigns', loadComponent: () => import('./pages/campaigns/campaigns').then(m => m.CampaignsComponent) },
      { path: 'settings', loadComponent: () => import('./pages/settings/settings').then(m => m.SettingsComponent) },
      { path: 'import-export', loadComponent: () => import('./pages/import-export/import-export').then(m => m.ImportExportComponent) },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
