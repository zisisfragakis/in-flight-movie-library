import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { CommonModule } from '@angular/common';
import { Movie } from '../../models/movie.model';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MovieCrudComponent } from '../../components/movie-crud/movie-crud.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [
    CommonModule,
    MovieCardComponent,
    DialogModule,
    ButtonModule,
    MovieCrudComponent,
  ],
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  movies: Movie[] = [];
  displayDialog: boolean = true;
  emptyMovie: Movie = {
    Title: '',
    Category: [''],
    Description: '',
    Director: '',
    Duration: '0',
    Starring: [''],
  };

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.movieService.getMovies().subscribe({
      next: (data) => {
        this.movies = data;
        console.log('Movies:', data);
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
}
