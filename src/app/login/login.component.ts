import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  public loginFormGroup!: FormGroup;

  constructor() {}

  ngOnInit(): void {
    this.loginFormGroup = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
  }

  onSubmit(): void {
    console.log(this.loginFormGroup);
  }
}
