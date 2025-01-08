import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RouterModule, Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-header-layout',
  imports: [
    RouterModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './header-layout.component.html',
  styleUrls: ['./header-layout.component.css'],
})
export class HeaderLayoutComponent {
  displayLoginDialog: boolean = false;
  loginForm: FormGroup;
  isLogged: boolean = false;
  counter: string = '02:00:00';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  // Check if the user is logged in and get the countdown time
  ngOnInit(): void {
    this.authService.isAdmin$.subscribe((isLoggedIn) => {
      this.isLogged = isLoggedIn;
    });

    this.authService.countdown$.subscribe((time) => {
      this.counter = time;
    });
  }

  openLoginDialog(): void {
    this.loginForm.reset();
    this.displayLoginDialog = true;
  }

  onLoginSubmit(): void {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.valid) {
      const username = this.loginForm.get('username')?.value;

      this.authService.login(username);

      this.displayLoginDialog = false;
    }
  }

  onLogout(): void {
    this.authService.logout();
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }
}
