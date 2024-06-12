import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { DevicesComponent } from './devices/devices.component';
import { InfoComponent } from './info/info.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'devices',
    component: DevicesComponent,
    canActivate: [authGuard]
  },
  {
    path: 'user-info',
    component: InfoComponent,
    canActivate: [authGuard]
  }
];
