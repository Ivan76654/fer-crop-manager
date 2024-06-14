import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, Subject, take } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserService } from '../shared/data/user.service';

export interface DeviceSub {
  entityType: string;
  entityId: string;
  scope: string;
  cmdId: number;
  type?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TelemetryService {
  telemetrySocket!: WebSocket;
  telemetryData = new Subject<any>();
  deviceSubscriptions = new BehaviorSubject<DeviceSub[]>([]);

  constructor(private authService: AuthService, private userService: UserService) {}

  connect(): void {
    this.authService.user.pipe(take(1)).subscribe((user) => {
      if (!user) {
        this.telemetrySocket.close();
        return;
      }

      this.userService.devicesSubject.pipe(take(1)).subscribe((devices) => {
        const token = user.token;

        let cmdId = 1;

        let deviceSubscriptions = devices.map((device) => {
          return {
            entityType: 'DEVICE',
            entityId: device.deviceId,
            scope: 'LATEST_TELEMETRY',
            cmdId: cmdId++
          };
        });

        if (!environment.production) {
          deviceSubscriptions = deviceSubscriptions.map((value) => {
            return { ...value, type: 'TIMESERIES' };
          });
        }

        this.deviceSubscriptions.next(deviceSubscriptions);

        const url = environment.production
          ? `${environment.thingsboardConfig.wsHostUrl}?token=${token}`
          : environment.thingsboardConfig.wsHostUrl;
        this.telemetrySocket = new WebSocket(url);

        this.telemetrySocket.onopen = () => {
          let subscriptionData = environment.production
            ? {
                tsSubCmds: deviceSubscriptions,
                historyCmds: [],
                attrSubCmds: []
              }
            : {
                authCmd: {
                  cmdId: 0,
                  token: token
                },
                cmds: deviceSubscriptions
              };

          const data = JSON.stringify(subscriptionData);
          this.telemetrySocket.send(data);
        };

        this.telemetrySocket.onmessage = (event) => {
          const receivedMessage = JSON.parse(event.data);
          this.telemetryData.next(receivedMessage);
        };

        this.telemetrySocket.onclose = (event) => {
          console.log('Connection is closed!');
        };
      });
    });
  }

  disconnet(): void {
    this.telemetrySocket.close();
  }
}
