import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-category-badge',
  imports: [],
  templateUrl: './category-badge.component.html',
  styleUrl: './category-badge.component.css',
})
export class CategoryBadgeComponent {
  @Input({ required: true }) category!: string;
}
