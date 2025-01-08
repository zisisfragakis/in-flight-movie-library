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
  movies: Movie[] = [];
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
    this.movieService.getMovies().subscribe({
      next: (data) => {
        this.movies = data;
        this.filteredMovies = [...this.movies];
        this.categories = this.getUniqueCategories();
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
    if (this.selectedCategory) {
      this.filteredMovies = this.movies.filter((movie) =>
        movie.Category.includes(this.selectedCategory)
      );
    } else {
      this.filteredMovies = [...this.movies];
    }
  }

  sortByTitle(): void {
    this.filteredMovies.sort((a, b) => {
      const titleA = a.Title.toLowerCase();
      const titleB = b.Title.toLowerCase();
      if (titleA < titleB) return this.sortDirection === 'asc' ? -1 : 1;
      if (titleA > titleB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  onMovieDeleted(title: string): void {
    this.movies = this.movies.filter((movie) => movie.Title !== title);
    this.filteredMovies = this.filteredMovies.filter(
      (movie) => movie.Title !== title
    );
    console.log(`Movie "${title}" deleted successfully`);
  }

  toggleSortDirection(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortByTitle();
  }

  private getUniqueCategories(): string[] {
    const categories = new Set<string>();
    this.movies.forEach((movie) => {
      movie.Category.forEach((category) => categories.add(category));
    });
    return Array.from(categories);
  }
}
