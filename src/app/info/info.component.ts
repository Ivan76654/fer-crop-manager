import { Component, OnInit } from '@angular/core';
import { UserResponse, UserService } from '../shared/data/user.service';
import { DatePipe } from '@angular/common';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [DatePipe, LoadingSpinnerComponent],
  templateUrl: './info.component.html',
  styleUrl: './info.component.css'
})
export class InfoComponent implements OnInit {
  userInfo!: UserResponse;
  isLoading = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.isLoading = true;

    this.userService.fetchUserInfo().subscribe((userInfo) => {
      this.userInfo = userInfo;
      this.isLoading = false;
    });
  }
}
