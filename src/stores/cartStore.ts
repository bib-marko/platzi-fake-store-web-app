import { defineStore } from 'pinia';
import { CartItem } from '@/types/CartItem';

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: [] as CartItem[],
  }),

  actions: {
    // Add a product to the cart
    addToCart(productId: number) {
      const existingItem = this.cart.find(
        (item) => item.productId === productId
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        this.cart.push({ productId, quantity: 1 });
      }
    },

    // Remove a product from the cart
    removeFromCart(productId: number) {
      this.cart = this.cart.filter((item) => item.productId !== productId);
    },

    // Update the quantity of a product in the cart
    updateCartItem(productId: number, quantity: number) {
      const existingItem = this.cart.find(
        (item) => item.productId === productId
      );
      if (existingItem) {
        existingItem.quantity = quantity;
      }
    },

    // Fetch cart data from the API
    async fetchCart(userId: number) {
      try {
        const response = await fetch(
          `https://fakestoreapi.com/carts/user/${userId}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch cart');
        }
        const data = await response.json();
        this.cart = data.products.map((product: CartItem) => ({
          productId: product.productId,
          quantity: product.quantity,
        }));
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    },
  },
});
