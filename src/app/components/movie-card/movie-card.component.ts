import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Movie } from '../../models/movie.model';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MovieService } from '../../services/movie.service';
import { MovieCrudComponent } from '../movie-crud/movie-crud.component';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.css'],
  imports: [DialogModule, ButtonModule, MovieCrudComponent],
})
export class MovieCardComponent {
  @Input() movie!: Movie;
  @Output() movieDeleted = new EventEmitter<string>(); // Notify parent of deletion

  displayDeleteDialog: boolean = false;
  displayEditDialog: boolean = false; // State for the edit modal

  constructor(private router: Router, private movieService: MovieService) {}

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
