import { Component, Input, OnInit } from '@angular/core';
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

  movieForm: FormGroup;
  categoryOptions: { label: string; value: string }[] = [];

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
      Category: [[], Validators.required], // Updated to expect an array
      Description: ['', Validators.required],
      Director: ['', Validators.required],
      Duration: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      Starring: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Pre-fill the form with the provided movie data
    if (this.movie) {
      this.movieForm.patchValue(this.movie);
    }

    // Fetch categories and set options for the MultiSelect
    this.movieService.getCategories().subscribe((categories) => {
      this.categoryOptions = categories.map((category) => ({
        label: category,
        value: category,
      }));

      // Pre-select categories if the movie has them
      if (this.movie?.Category) {
        this.movieForm.get('Category')?.setValue(this.movie.Category);
      }
    });
  }

  onSubmit(): void {
    this.movieForm.markAllAsTouched();

    if (this.movieForm.valid) {
      console.log('Movie Form Data:', this.movieForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
