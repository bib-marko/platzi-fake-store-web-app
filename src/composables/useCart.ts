import { useCartStore } from '@/stores/cartStore';
import { useProductStore } from '@/stores/productStore';
import Swal from 'sweetalert2';

export const useCart = () => {
  const cartStore = useCartStore();
  const productStore = useProductStore();

  const getProductName = (productId: number): string => {
    const product = productStore.products.find((p) => p.id === productId);
    return product
      ? product.title.length > 20
        ? product.title.slice(0, 20) + '...'
        : product.title
      : 'Unknown Product';
  };

  const getProductImage = (productId: number): string => {
    const product = productStore.products.find((p) => p.id === productId);
    return product ? product.images[0] : '';
  };

  const calculatePrice = (productId: number, quantity: number): string => {
    const product = productStore.products.find((p) => p.id === productId);
    const price = product ? product.price * quantity : 0;
    return price.toFixed(2);
  };

  const calculateSubtotal = (): number => {
    return cartStore.cart.reduce((subtotal, item) => {
      const product = productStore.products.find(
        (p) => p.id === item.productId
      );
      return subtotal + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const calculateTotal = (): number => {
    const shippingFee = 4.99;
    return calculateSubtotal() + shippingFee;
  };

  const increaseQuantity = (productId: number) => {
    const item = cartStore.cart.find((item) => item.productId === productId);
    if (item) {
      item.quantity += 1;
    }
  };

  const decreaseQuantity = (productId: number) => {
    const item = cartStore.cart.find((item) => item.productId === productId);
    if (item && item.quantity > 1) {
      item.quantity -= 1;
    }
  };

  const removeFromCart = (productId: number) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to remove this item from the cart?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!',
    }).then((result) => {
      if (result.isConfirmed) {
        cartStore.removeFromCart(productId);
        Swal.fire(
          'Removed!',
          'The item has been removed from your cart.',
          'success'
        );
      }
    });
  };

  return {
    getProductName,
    getProductImage,
    calculatePrice,
    calculateSubtotal,
    calculateTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  };
};
