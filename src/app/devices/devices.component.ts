import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/data/user.service';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { Device } from '../shared/data/device.model';
import { take } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-devices',
  standalone: true,
  imports: [LoadingSpinnerComponent, DatePipe],
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.css'
})
export class DevicesComponent implements OnInit {
  isLoading = false;
  devices: Device[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.userService.fetchUserDevices().subscribe((data) => {
      this.userService.devicesSubject.pipe(take(1)).subscribe((deviceList) => {
        this.devices = deviceList;
        this.isLoading = false;
      });
    });
  }
}
