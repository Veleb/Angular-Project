import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environment';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [ ReactiveFormsModule ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {

  categories = environment.categories;

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    price: new FormControl(0, Validators.required),
    quantity: new FormControl(0, Validators.required),
    image: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    category: new FormControl(null, Validators.required),
  })

  formTextGetter(control: string) {
    return this.form.get(control);
  }

  

  createProduct(): void {
    
  }
}
