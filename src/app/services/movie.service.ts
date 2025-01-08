import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private jsonUrl = 'assets/movies.json';
  private categories = new BehaviorSubject<string[]>([]); // Global reference for categories
  private movies: Movie[] = []; // Cache for movies

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
          this.extractCategories(movies); // Extract categories once
        })
      );
    }
  }

  // Get global categories
  getCategories(): Observable<string[]> {
    return this.categories.asObservable();
  }

  // Extract and deduplicate categories
  private extractCategories(movies: Movie[]): void {
    const uniqueCategories = movies
      .flatMap((movie) => movie.Category)
      .filter((category, index, self) => self.indexOf(category) === index);
    this.categories.next(uniqueCategories);
  }
}
