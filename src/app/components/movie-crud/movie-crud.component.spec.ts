import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieCrudComponent } from './movie-crud.component';

describe('MovieCrudComponent', () => {
  let component: MovieCrudComponent;
  let fixture: ComponentFixture<MovieCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieCrudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
