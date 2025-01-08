import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private jsonUrl = 'assets/movies.json';
  private movies: Movie[] = []; // In-memory cache for movies
  private categories = new BehaviorSubject<string[]>([]); // Global reference for categories
  private filteredMoviesSubject = new BehaviorSubject<Movie[]>([]); // Global reference for filtered movies
  filteredMovies$ = this.filteredMoviesSubject.asObservable(); // Observable for filtered movies

  constructor(private http: HttpClient) {}

  // Fetch movies and cache them
  getMovies(): Observable<Movie[]> {
    if (this.movies.length) {
      return new Observable((observer) => {
        observer.next(this.movies);
        observer.complete();
      });
    } else {
      return this.http.get<Movie[]>(this.jsonUrl).pipe(
        tap((movies) => {
          this.movies = movies;
          this.filteredMoviesSubject.next([...movies]); // Set filtered movies initially
          this.extractCategories(movies);
        })
      );
    }
  }

  // Get global categories
  getCategories(): Observable<string[]> {
    return this.categories.asObservable();
  }

  // Add a new movie
  addMovie(newMovie: Movie): void {
    this.movies.push(newMovie);
    this.filteredMoviesSubject.next([...this.movies]); // Update filtered movies
    this.extractCategories(this.movies); // Update categories if needed
  }

  // Update an existing movie
  updateMovie(updatedMovie: Movie): void {
    const index = this.movies.findIndex(
      (movie) => movie.Title === updatedMovie.Title
    );
    if (index !== -1) {
      this.movies[index] = updatedMovie;
      this.filteredMoviesSubject.next([...this.movies]); // Update filtered movies
      this.extractCategories(this.movies); // Update categories if needed
    }
  }

  // Delete a movie
  deleteMovie(title: string): void {
    this.movies = this.movies.filter((movie) => movie.Title !== title);
    this.filteredMoviesSubject.next([...this.movies]); // Update filtered movies
    this.extractCategories(this.movies); // Update categories if needed
  }

  // Filter movies by category
  filterMoviesByCategory(category: string): void {
    const filteredMovies = category
      ? this.movies.filter((movie) => movie.Category.includes(category))
      : [...this.movies];
    this.filteredMoviesSubject.next(filteredMovies);
  }

  // Sort movies by title
  sortMoviesByTitle(direction: 'asc' | 'desc'): void {
    const filteredMovies = this.filteredMoviesSubject.getValue();
    const sortedMovies = filteredMovies.sort((a, b) => {
      const titleA = a.Title.toLowerCase();
      const titleB = b.Title.toLowerCase();
      if (titleA < titleB) return direction === 'asc' ? -1 : 1;
      if (titleA > titleB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    this.filteredMoviesSubject.next([...sortedMovies]);
  }

  // Extract and deduplicate categories
  private extractCategories(movies: Movie[]): void {
    const uniqueCategories = movies
      .flatMap((movie) => movie.Category)
      .filter((category, index, self) => self.indexOf(category) === index);
    this.categories.next(uniqueCategories);
  }
}
