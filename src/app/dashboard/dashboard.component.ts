import { Component, OnDestroy, OnInit } from '@angular/core';
import { TelemetryService } from '../telemetry/telemetry.service';
import { UserService } from '../shared/data/user.service';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { Device } from '../shared/data/device.model';
import { DeviceDataDisplayComponent } from './device-data-display/device-data-display.component';
import { take } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [LoadingSpinnerComponent, DeviceDataDisplayComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  devices: Device[] = [];
  isloading = false;

  constructor(private telemetryService: TelemetryService, private userService: UserService) {}

  ngOnInit(): void {
    this.telemetryService.connect();

    this.isloading = true;
    if (!localStorage.getItem('customerId')) {
      this.userService.fetchUserInfo().subscribe((userData) => {
        this.handleWebSocketConnection();
      });
    } else {
      this.handleWebSocketConnection();
    }
  }

  ngOnDestroy(): void {
    this.telemetryService.disconnet();
  }

  private handleWebSocketConnection(): void {
    this.userService.fetchUserDevices().subscribe((response) => {
      this.telemetryService.connect();
      this.userService.devicesSubject.pipe(take(1)).subscribe((devices) => {
        this.devices = devices;
        this.isloading = false;
      });
    });
  }
}
