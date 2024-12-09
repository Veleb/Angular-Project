import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ProductService } from '../product.service';
import { Category, Product, ProductDataInterface } from '../../types';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [ ReactiveFormsModule ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent implements OnInit {

  constructor(private productService: ProductService, private router: Router, private activateRoute: ActivatedRoute) {}

  product: Product | null = null;

  ngOnInit(): void {
    this.activateRoute.paramMap.pipe(
      switchMap((paramMap) => {
        const productId = paramMap.get('id');

        if (productId) {

          return this.productService.getProductById(productId);

        } else {
          throw new Error('Product ID not found');
        }
      })
    ).subscribe({
      next: (product: Product) => {
        this.product = product; 

        this.form.patchValue({
          name: product.name,
          price: product.price,
          quantity: product.quantity,
          image: product.image,
          description: product.description,
          category: product.category as Category,
        });
      },
      error: (err) => {
        console.error('Error fetching product:', err);
      }
    });

    this.form.markAllAsTouched();
  }

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

  editProduct(): void {
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
     
      this.productService.updateProduct(productData, this.product?._id || '').subscribe({
        next: (response) => {
          this.router.navigate([`/product/${this.product?._id}`]);
        },
        error: (err) => {
          console.error('Error updating product:', err);
        }
      });
    }
  }
}
