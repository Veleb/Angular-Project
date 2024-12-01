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
  savedBy: string[],
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

export interface User {
  _id: string;
  username: string;
  userProducts: Product[];
  savedProducts: string[];
  created_at: string;
  updatedAt: string;
}

export interface AuthUser extends User { // ✔️
  accessToken: string;
}