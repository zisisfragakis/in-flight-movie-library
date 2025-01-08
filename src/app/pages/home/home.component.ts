import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { CommonModule } from '@angular/common';
import { Movie } from '../../models/movie.model';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MovieCrudComponent } from '../../components/movie-crud/movie-crud.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [
    CommonModule,
    MovieCardComponent,
    DialogModule,
    ButtonModule,
    MovieCrudComponent,
    FormsModule,
  ],
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  filteredMovies: Movie[] = [];
  displayDialog: boolean = false;
  categories: string[] = [];
  selectedCategory: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  emptyMovie: Movie = {
    Title: '',
    Category: [],
    Description: '',
    Director: '',
    Duration: '0',
    Starring: [],
  };

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    // Subscribe to filteredMovies from MovieService
    this.movieService.filteredMovies$.subscribe((movies) => {
      this.filteredMovies = movies;
    });

    // Fetch categories
    this.movieService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });

    // Fetch initial movies
    this.movieService.getMovies().subscribe({
      next: () => {
        console.log('Movies loaded successfully.');
      },
      error: (err) => {
        console.error('Error fetching movies:', err);
      },
    });
  }

  openDialog(): void {
    this.displayDialog = true;
  }

  closeDialog(): void {
    this.displayDialog = false;
  }

  filterByCategory(): void {
    this.movieService.filterMoviesByCategory(this.selectedCategory);
  }

  toggleSortDirection(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.movieService.sortMoviesByTitle(this.sortDirection);
  }

  onMovieDeleted(title: string): void {
    this.movieService.deleteMovie(title);
    console.log(`Movie "${title}" deleted successfully`);
  }
}
