import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Movie } from '../../models/movie.model';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MovieService } from '../../services/movie.service';
import { MovieCrudComponent } from '../movie-crud/movie-crud.component';
import { CategoryBadgeComponent } from '../category-badge/category-badge.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.css'],
  imports: [
    DialogModule,
    ButtonModule,
    MovieCrudComponent,
    CommonModule,
    CategoryBadgeComponent,
  ],
})
export class MovieCardComponent {
  isLogged: boolean = false;

  @Input() movie!: Movie;
  @Output() movieDeleted = new EventEmitter<string>();

  displayDeleteDialog: boolean = false;
  displayEditDialog: boolean = false;
  counter: string = '02:00:00';

  constructor(
    private router: Router,
    private movieService: MovieService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.isAdmin$.subscribe((isLoggedIn) => {
      this.isLogged = isLoggedIn;
    });

    this.authService.countdown$.subscribe((time) => {
      this.counter = time;
    });
  }

  convertCounterToMinutes(counter: string): number {
    const [hours, minutes, seconds] = counter.split(':').map(Number);
    return hours * 60 + minutes + seconds / 60;
  }

  parseMovieDuration(duration: string): number {
    // Convert the movie duration from string to number

    return parseInt(duration, 10);
  }

  navigateToDetails(): void {
    this.router.navigate([`${this.movie.Title}/details`]);
  }

  openDeleteDialog(): void {
    this.displayDeleteDialog = true;
  }

  closeDeleteDialog(): void {
    this.displayDeleteDialog = false;
  }

  confirmDelete(): void {
    this.movieService.deleteMovie(this.movie.Title);
    this.movieDeleted.emit(this.movie.Title);

    console.log('Movie deleted:', this.movie.Title);

    this.closeDeleteDialog();
  }

  openEditDialog(): void {
    this.displayEditDialog = true;
  }

  closeEditDialog(): void {
    this.displayEditDialog = false;
  }

  onMovieUpdated(): void {
    console.log('Movie updated:', this.movie.Title);
    this.closeEditDialog();
  }
}
