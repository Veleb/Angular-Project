import { FormControl } from "@angular/forms";

export interface Product {
  name: string;
  price: number;
  quantity: number;
  image: string; 
  description: string;
  category: 
    | 'Electronics'
    | 'Fashion'
    | 'Home & Living'
    | 'Books'
    | 'Toys'
    | 'Sports & Outdoors'
    | 'Health & Beauty'
    | 'Automotive'
    | 'Groceries'
    | 'Music & Movies';
  _ownerId: string; 
  _id: string,
}

export interface ProductDataInterface {
  name: string;          
  price: number;          
  quantity: number;       
  image: string;          
  description: string;    
  category: 
    | 'Electronics'
    | 'Fashion'
    | 'Home & Living'
    | 'Books'
    | 'Toys'
    | 'Sports & Outdoors'
    | 'Health & Beauty'
    | 'Automotive'
    | 'Groceries'
    | 'Music & Movies'
    | null;
}
export interface AuthUser {
  username: string,
  userProducts: Product[],
  _id: string, 
}
export interface User {
  username: string,
  password: string,
  userProducts: Product[],
  _id: string, 
}