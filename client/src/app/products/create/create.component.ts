import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ProductService } from '../product.service';
import { ProductDataInterface } from '../../types';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent {

  constructor(private productService: ProductService, private router: Router) {}

  categories = environment.categories;

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(255), Validators.minLength(6), Validators.pattern('[a-zA-Z0-9\-]+') ]),
    price: new FormControl(0, [Validators.required, Validators.min(0.01)]),
    quantity: new FormControl(0, [Validators.required, Validators.min(1)]),
    image: new FormControl('', [Validators.required, Validators.pattern('^(https?:\/\/.*\.(?:jpg|jpeg|png|gif|bmp|webp))$')]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(20),
      Validators.maxLength(300),
    ]),
    category: new FormControl(null, [Validators.required]),
  });
  
  formTextGetter(control: string) {
    return this.form.get(control);
  }

  createProduct(): void {
    if (this.form.valid) {
      const formValue = this.form.value;

    const productData: ProductDataInterface = {
      name: formValue.name || '',  
      price: formValue.price || 0,  
      quantity: formValue.quantity || 0,
      image: formValue.image || '',
      description: formValue.description || '',  
      category: formValue.category || null,
    };
      
      this.productService.createProduct(productData).subscribe({
        next: (response) => {
          this.router.navigate(['/catalog']);
          console.log('Product created successfully:', response); // TODO ADD A ZUCCEZZFUL TOAZT
        },
        error: (err) => {
          this.router.navigate(['/product/create']); // change thiz with the form information
          console.error('Error creating product:', err); // TODO ADD AN ERROR TOEAZT 
        }})
    } else {
      console.error('Form is not valid');
    }
  }
}
