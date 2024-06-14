import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Device } from '../../shared/data/device.model';
import { TelemetryService } from '../../telemetry/telemetry.service';
import { Subscription, take } from 'rxjs';

@Component({
  selector: 'app-device-data-display',
  standalone: true,
  imports: [],
  templateUrl: './device-data-display.component.html',
  styleUrl: './device-data-display.component.css'
})
export class DeviceDataDisplayComponent implements OnInit, OnDestroy {
  @Input() device!: Device;
  subId: number = -1;
  currentReading: any = {};
  readingKeys: string[] = [];
  isLoading = true;

  private initialReading = true;
  private readingSubscription!: Subscription;

  constructor(private telemetryService: TelemetryService) {}

  ngOnInit(): void {
    this.telemetryService.deviceSubscriptions.pipe(take(1)).subscribe((subscriptions) => {
      const sub = subscriptions.filter(
        (subscription) => subscription.entityId === this.device.deviceId
      );

      if (!sub.length) return;

      this.subId = sub[0].cmdId;
    });
    this.readingSubscription = this.telemetryService.telemetryData.subscribe((data) => {
      if (data.subscriptionId != this.subId) return;

      if (this.initialReading) {
        this.readingKeys = Object.keys(data.data);
        for (let key of this.readingKeys) {
          this.currentReading[key] = Math.round(Number(data.data[key][0][1]) * 10) / 10;
        }

        this.initialReading = false;
      } else {
        const reading = Object.keys(data.data);

        if (!reading.length) return;

        const readingValue = +data.data[reading[0]][0][1];
        this.currentReading[reading[0]] = Math.round(readingValue * 10) / 10;
      }
    });
  }

  ngOnDestroy(): void {
    this.readingSubscription.unsubscribe();
  }

  isEmpty(): boolean {
    return !!Object.keys(this.currentReading).length;
  }
}
