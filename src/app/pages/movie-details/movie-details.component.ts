import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  imports: [CommonModule],
  styleUrls: ['./movie-details.component.css'],
})
export class MovieDetailsComponent implements OnInit {
  movie: Movie | undefined;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    const title = this.route.snapshot.paramMap.get('title');
    if (title) {
      this.loadMovie(decodeURIComponent(title));
    }
  }

  private loadMovie(title: string): void {
    this.movieService.getMovies().subscribe({
      next: (movies: Movie[]) => {
        this.movie = movies.find((movie) => movie.Title === title);
        if (this.movie) {
          console.log('Movie found:', this.movie);
        } else {
          console.error('Movie not found', title);
        }
      },
      error: (err) => {
        console.error('Error fetching movies:', err);
      },
    });
  }
}
