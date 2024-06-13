import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subject, take } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TelemetryService {
  telemetrySocket!: WebSocket;
  telemetryData = new Subject<any>();

  constructor(private authService: AuthService) {}

  connect(): void {
    this.authService.user.pipe(take(1)).subscribe((user) => {
      if (!user) {
        this.telemetrySocket.close();
        return;
      }

      const token = user.token;
      const entityId = 'bc6cb3e0-2432-11ef-a963-a37ba3a57ce2';
      const entityId2 = '134a1e30-2313-11ef-a248-795440dd22ad';

      let deviceSubscriptions = [
        {
          entityType: 'DEVICE',
          entityId: entityId2,
          scope: 'LATEST_TELEMETRY',
          cmdId: 10
        }
      ];

      if (!environment.production) {
        deviceSubscriptions = deviceSubscriptions.map((value) => {
          return { ...value, type: 'TIMESERIES' };
        });
      }

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
        const received_msg = JSON.parse(event.data);
        const temperature = received_msg.data;
        this.telemetryData.next(event.data);
        console.log(temperature);
      };

      this.telemetrySocket.onclose = (event) => {
        console.log('Connection is closed!');
      };
    });
  }

  disconnet(): void {
    this.telemetrySocket.close();
  }
}
