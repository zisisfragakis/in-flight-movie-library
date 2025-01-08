import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { Movie } from '../../models/movie.model';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-movie-crud',
  templateUrl: './movie-crud.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MultiSelectModule],
  styleUrls: ['./movie-crud.component.css'],
})
export class MovieCrudComponent implements OnInit {
  @Input({ required: true }) movie!: Movie;
  @Output() formSubmit = new EventEmitter<void>();

  movieForm: FormGroup;

  categoryOptions: { label: string; value: string }[] = [];
  filteredMovies: Movie[] = [];
  isEditMode: boolean = false; // Track edit mode

  fields = [
    {
      id: 'Title',
      label: 'Title',
      type: 'text',
      placeholder: 'Enter movie title',
      required: true,
    },
    {
      id: 'Category',
      label: 'Category',
      type: 'multiSelect',
      placeholder: 'Select movie categories',
      required: true,
    },
    {
      id: 'Description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Enter movie description',
      required: true,
    },
    {
      id: 'Director',
      label: 'Director',
      type: 'text',
      placeholder: 'Enter movie director',
      required: true,
    },
    {
      id: 'Duration',
      label: 'Duration (minutes)',
      type: 'text',
      placeholder: 'Enter movie duration',
      required: true,
      pattern: '^[0-9]*$',
    },
    {
      id: 'Starring',
      label: 'Starring',
      type: 'text',
      placeholder: 'Enter starring actors',
      required: true,
    },
  ];

  constructor(private fb: FormBuilder, private movieService: MovieService) {
    this.movieForm = this.fb.group({
      Title: ['', Validators.required],
      Category: [[], Validators.required],
      Description: ['', Validators.required],
      Director: ['', Validators.required],
      Duration: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      Starring: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Check if movie exists to determine edit mode
    this.movieService.filteredMovies$.subscribe((movies) => {
      this.filteredMovies = movies;
      this.isEditMode = this.isExistingMovie(this.movie.Title);

      // Disable the Title field if editing
      if (this.isEditMode) {
        this.movieForm.get('Title')?.disable({ emitEvent: false });
      }
    });

    // Pre-fill form with movie data if available
    if (this.movie) {
      this.movieForm.patchValue(this.movie);
    }

    // Fetch categories and set MultiSelect options
    this.movieService.getCategories().subscribe((categories) => {
      this.categoryOptions = categories.map((category) => ({
        label: category,
        value: category,
      }));

      if (this.movie?.Category) {
        this.movieForm.get('Category')?.setValue(this.movie.Category);
      }
    });
  }

  onSubmit(): void {
    this.movieForm.markAllAsTouched();

    if (this.movieForm.valid) {
      const newMovie: Movie = this.movieForm.getRawValue();

      if (this.isEditMode) {
        this.movieService.updateMovie(newMovie);
        console.log('Movie updated:', newMovie);
      } else {
        this.movieService.addMovie(newMovie);
        console.log('New movie added:', newMovie);
      }

      this.formSubmit.emit();
    } else {
      console.log('Form is invalid');
    }
  }

  private isExistingMovie(title: string): boolean {
    return !!this.filteredMovies.find((movie) => movie.Title === title);
  }
}
