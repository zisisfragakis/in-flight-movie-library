import { Component } from '@angular/core';
import { HeaderLayoutComponent } from './components/header-layout/header-layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderLayoutComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'in-flight-movie-library';
}
