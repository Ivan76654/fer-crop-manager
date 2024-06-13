import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, tap } from 'rxjs';
import { Device } from './device.model';

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
  devicesSubject = new BehaviorSubject<Device[]>([]);

  constructor(private httpClient: HttpClient) {}

  fetchUserDevices() {
    return this.httpClient
      .get<any>(
        `${environment.thingsboardConfig.hostUrl}/api/customer/${localStorage.getItem(
          'customerId'
        )}/devices?pageSize=999&page=0&sortOrder=ASC`
      )
      .pipe(
        tap((response) => {
          const devices: Device[] = response.data.map((deviceInfo: any): Device => {
            return {
              deviceId: deviceInfo.id.id,
              createdOn: deviceInfo.createdTime,
              name: deviceInfo.name,
              label: deviceInfo.label,
              type: deviceInfo.type,
              isGateway: deviceInfo.additionalInfo.gateway
            };
          });

          this.devicesSubject.next(devices);
        })
      );
  }

  fetchUserInfo() {
    return this.httpClient
      .get<UserResponse>(`${environment.thingsboardConfig.hostUrl}/api/auth/user`)
      .pipe(
        tap((userInfo) => {
          localStorage.setItem('customerId', userInfo.customerId.id);
        })
      );
  }
}
