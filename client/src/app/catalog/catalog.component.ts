import { Component } from '@angular/core';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent {

  selectedCategories: String[] = [];

  categories = [
    'Electronics',
    'Fashion',
    'Home & Living',
    'Books',
    'Toys',
    'Sports & Outdoors',
    'Health & Beauty',
    'Automotive',
    'Groceries',
    'Music & Movies'
  ];

  // add logic if selectedCategories iz empty to be all categoriez

  onCategoryChange(event: Event): void {
    const target = event.target as HTMLInputElement; 
    
    if (target.checked) {
      this.selectedCategories.push(target.id);
    }
    else {
      this.selectedCategories = this.selectedCategories.filter(category => category !== target.id);
    }
  }
}
