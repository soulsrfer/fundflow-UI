import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';

import { ToasterService } from '@service/toaster.service';
import { LayoutService } from 'src/app/layout/layout.service';

@Component({
  selector: 'app-login',
  imports: [
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    PasswordModule,
    FormsModule,
    RouterModule,
    RippleModule,
    ReactiveFormsModule
],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  loading: boolean = false;
    error: string | null = null;


  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private toaster: ToasterService,
    private layoutService: LayoutService
  ) {
    this.initializeLoginForm();
  }
  ngOnInit(): void {
    this.layoutService.CloseMenuToggle();
  }

  initializeLoginForm(): void {
    this.loginForm = this.fb.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      remember: new FormControl(false,[Validators.required]),
    });
  }
  onSubmit() {
    this.error = null;

    if (this.loginForm.invalid) {
      this.toaster.showError('Please fill in all required fields.');
      return;
    }

    this.loading = true;

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        console.log('Login successful - redirecting to dashboard');
        this.router.navigate(['/dashboard']);// authGuard handles role-based redirection
      },
      error: (err) => {
        this.error = 'Login failed. Please check your credentials.';
        console.error('Login error:', err);
        this.loading = false;
      }
    });
  }
}
