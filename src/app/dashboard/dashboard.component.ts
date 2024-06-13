import { Component, OnDestroy, OnInit } from '@angular/core';
import { TelemetryService } from '../telemetry/telemetry.service';
import { UserService } from '../shared/data/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  constructor(private telemetryService: TelemetryService, private userService: UserService) {}

  ngOnInit(): void {
    this.telemetryService.connect();

    if (!localStorage.getItem('customerId'))
      this.userService.fetchUserInfo().subscribe((userData) => {});
  }

  ngOnDestroy(): void {
    this.telemetryService.disconnet();
  }
}
