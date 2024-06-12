import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, LoadingSpinnerComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginFormGroup!: FormGroup;
  isLoading = false;
  error?: string;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loginFormGroup = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
  }

  onSubmit(): void {
    if (!this.loginFormGroup.valid) return;

    const username = this.loginFormGroup.value.username;
    const password = this.loginFormGroup.value.password;

    this.isLoading = true;

    this.authService.login(username, password).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (errorMessage) => {
        this.error = `${errorMessage}!`;
        this.isLoading = false;
      }
    });

    this.loginFormGroup.reset();
  }
}
