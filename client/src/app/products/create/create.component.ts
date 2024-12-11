import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ProductService } from '../product.service';
import { Category, ProductDataInterface } from '../../types';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-create',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent {

  constructor(private productService: ProductService, private router: Router, private toastr: ToastrService) {}

  categories = environment.categories;
  
  form = new FormGroup({
    name: new FormControl<string>('', [
      Validators.required, 
      Validators.maxLength(255), 
      Validators.minLength(6), 
      Validators.pattern('[a-zA-Z0-9\-]+')
    ]),
    price: new FormControl<number>(0, [
      Validators.required, 
      Validators.min(0.01)
    ]),
    quantity: new FormControl<number>(0, [
      Validators.required, 
      Validators.min(1)
    ]),
    image: new FormControl<string>('', [
      Validators.required, 
      Validators.pattern('^(https?:\/\/.*\.(?:jpg|jpeg|png|gif|bmp|webp))$')
    ]),
    description: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(20),
      Validators.maxLength(300),
    ]),
    category: new FormControl<Category | null>(null, [Validators.required]),
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
          this.toastr.success(`Successfully created product!`, `Success`);
          this.router.navigate(['/catalog']);
        },
        error: (err) => {
          this.toastr.error(`Error creating product!`, `Error Occurred`);
          console.error('Error creating product:', err); 
          this.router.navigate(['/product/create']);
        }})
    } else {
      console.error('Form is not valid');
    }
  }
}
