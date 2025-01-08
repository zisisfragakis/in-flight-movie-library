import { Injectable } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAdminSubject = new BehaviorSubject<boolean>(false);
  private countdownSubject = new BehaviorSubject<string>('01:30:00'); // Global ref for the timer
  isAdmin$ = this.isAdminSubject.asObservable();
  countdown$ = this.countdownSubject.asObservable(); // Expose the timer as an observable

  // Initialize the countdown (2hours)
  private countdownDuration = 2 * 60 * 60; // Seconds (2 hours)

  constructor() {
    this.startCountdown();
  }

  // Getter and Setter for isAdmin
  get isAdmin(): boolean {
    return this.isAdminSubject.value;
  }

  set isAdmin(value: boolean) {
    this.isAdminSubject.next(value);
  }

  // Basic Login
  login(username: string): void {
    localStorage.setItem('username', username);
    this.isAdmin = true;
  }

  // Basic Logout
  logout(): void {
    localStorage.removeItem('username');
    this.isAdmin = false; // Reset admin status
  }

  // Check if a user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('username');
  }

  // Get the logged-in username
  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  // Countdown timer logic
  private startCountdown(): void {
    const timer$ = interval(1000).pipe(
      map((elapsed) => this.countdownDuration - elapsed),
      takeWhile((remaining) => remaining >= 0)
    );

    timer$.subscribe((remaining) => {
      const hours = Math.floor(remaining / 3600);
      const minutes = Math.floor((remaining % 3600) / 60);
      const seconds = remaining % 60;

      const formattedTime = [
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        seconds.toString().padStart(2, '0'),
      ].join(':');

      this.countdownSubject.next(formattedTime);
    });
  }
}
