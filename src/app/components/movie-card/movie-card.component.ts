import { Component, Input } from '@angular/core';
import { Movie } from '../../models/movie.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.css'],
})
export class MovieCardComponent {
  @Input() movie!: Movie;

  constructor(private router: Router) {}

  navigateToDetails(): void {
    this.router.navigate([`${this.movie.Title}/details`]);
  }
}
