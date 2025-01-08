import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-movie-crud',
  templateUrl: './movie-crud.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  styleUrls: ['./movie-crud.component.css'],
})
export class MovieCrudComponent implements OnInit {
  @Input({ required: true }) movie!: Movie;

  movieForm: FormGroup;

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
      type: 'text',
      placeholder: 'Enter movie category',
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

  constructor(private fb: FormBuilder) {
    this.movieForm = this.fb.group({
      Title: ['', Validators.required],
      Category: ['', Validators.required],
      Description: ['', Validators.required],
      Director: ['', Validators.required],
      Duration: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      Starring: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.movie) {
      this.movieForm.patchValue(this.movie);
    }
  }

  onSubmit(): void {
    if (this.movieForm.valid) {
      console.log('Movie Form Data:', this.movieForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
