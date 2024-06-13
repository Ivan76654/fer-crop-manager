import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface UserResponse {
  id: {
    entityType: string;
    id: string;
  };
  createdTime: number;
  additionalInfo: {
    description: string;
    defaultDashboardId?: string;
    defaultDashboardFullscreen: boolean;
    homeDashboardId?: string;
    homeDashboardHideToolbar: boolean;
    userCredentialsEnabled: boolean;
    failedLoginAttempts: number;
    lastLoginTs: number;
  };
  tenantId: {
    entityType: string;
    id: string;
  };
  customerId: {
    entityType: string;
    id: string;
  };
  email: string;
  authority: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  fetchUserDevices() {}

  fetchUserInfo() {
    return this.httpClient.get<UserResponse>(
      `${environment.thingsboardConfig.hostUrl}/api/auth/user`
    );
  }
}
