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
  _id: string;
  savedBy: string[];
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
  rooms: Room[] | undefined;
  created_at?: string;
  updatedAt?: string;
}

export interface AuthUser extends User { // ✔️
  accessToken: string;
}

export interface Message {
  _id: string;
  text: string;
  sentBy: string;
  sender: AuthUser | null;
  created_at?: string;
  updatedAt?: string;
}
export interface Room {
  name: string | undefined;
  owner: string | undefined;
  messages: Message[];
  users: (string | undefined)[];
  product: string | undefined;
  _id?: string;
  created_at?: string;
  updatedAt?: string;
}