import { CartItem } from './CartItem';

export interface Cart {
  id: number;
  userId: number;
  date: string;
  products: CartItem[];
}
