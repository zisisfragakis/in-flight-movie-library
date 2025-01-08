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
    this.extractCategories(this.movies); // Update categories if needed
  }

  // Update an existing movie
  updateMovie(updatedMovie: Movie): void {
    const index = this.movies.findIndex(
      (movie) => movie.Title === updatedMovie.Title
    );
    if (index !== -1) {
      this.movies[index] = updatedMovie;
      this.extractCategories(this.movies); // Update categories if needed
    }
  }

  // Delete a movie
  deleteMovie(title: string): void {
    this.movies = this.movies.filter((movie) => movie.Title !== title);
    this.extractCategories(this.movies); // Update categories if needed
  }

  // Extract and deduplicate categories
  private extractCategories(movies: Movie[]): void {
    const uniqueCategories = movies
      .flatMap((movie) => movie.Category)
      .filter((category, index, self) => self.indexOf(category) === index);
    this.categories.next(uniqueCategories);
  }
}
