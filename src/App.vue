<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <router-link to="/" class="navbar-brand">Platzi Fake Store</router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link
                v-if="
                  authStore.token &&
                  authStore.profile &&
                  authStore.profile.role === 'admin'
                "
                to="/add"
                class="nav-link"
              >
                Add Product
              </router-link>
            </li>
          </ul>

          <!-- Cart Dropdown -->
          <div class="dropdown">
            <div
              v-if="authStore.token"
              class="icon-container"
              id="cartDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <svg
                class="cart-icon"
                stroke="currentColor"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                ></path>
              </svg>

              <span class="notification-badge">
                {{ cartStore.cart.length }}</span
              >
            </div>
            <div
              class="dropdown-menu dropdown-menu-end p-3 custom-dropdown"
              aria-labelledby="cartDropdown"
              @click.stop
            >
              <!-- Cart Section -->
              <div class="card cart">
                <label class="title">Your cart</label>
                <div
                  v-for="item in cartStore.cart"
                  :key="item.productId"
                  class="product"
                >
                  <img
                    :src="getProductImage(item.productId)"
                    alt="Product Image"
                    class="cart-product-image"
                  />
                  <div>
                    <span>{{ getProductName(item.productId) }}</span>
                    <button
                      class="btn btn-sm btn-danger mt-2"
                      @click="removeFromCart(item.productId)"
                    >
                      Delete
                    </button>
                  </div>
                  <div class="quantity">
                    <button @click="decreaseQuantity(item.productId)">
                      <svg
                        fill="none"
                        viewBox="0 0 24 24"
                        height="14"
                        width="14"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke-linejoin="round"
                          stroke-linecap="round"
                          stroke-width="2.5"
                          stroke="#47484b"
                          d="M20 12L4 12"
                        ></path>
                      </svg>
                    </button>
                    <label>{{ item.quantity }}</label>
                    <button @click="increaseQuantity(item.productId)">
                      <svg
                        fill="none"
                        viewBox="0 0 24 24"
                        height="14"
                        width="14"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke-linejoin="round"
                          stroke-linecap="round"
                          stroke-width="2.5"
                          stroke="#47484b"
                          d="M12 4V20M20 12H4"
                        ></path>
                      </svg>
                    </button>
                  </div>
                  <label class="price small"
                    >${{ calculatePrice(item.productId, item.quantity) }}</label
                  >
                </div>
              </div>

              <!-- Checkout Section -->
              <div class="card checkout mt-3">
                <label class="title">Checkout</label>
                <div class="details">
                  <span>Your cart subtotal:</span>
                  <span>${{ calculateSubtotal().toFixed(2) }}</span>
                  <span>Discount through applied coupons:</span>
                  <span>$0.00</span>
                  <span>Shipping fees:</span>
                  <span>$4.99</span>
                </div>
                <div class="checkout--footer">
                  <label class="price"
                    ><sup>$</sup>{{ calculateTotal().toFixed(2) }}</label
                  >
                  <button class="checkout-btn">Checkout</button>
                </div>
              </div>
            </div>
          </div>
          <div class="utility-btn">
            <router-link
              v-if="!authStore.token"
              to="/login"
              class="btn btn-outline-light"
            >
              Login
            </router-link>
            <router-link
              v-if="!authStore.token"
              to="/register"
              class="btn btn-outline-light"
            >
              Register
            </router-link>
            <button
              v-if="authStore.token"
              @click="gotoProfile"
              class="btn btn-warning"
            >
              Profile
            </button>
            <button
              v-if="authStore.token"
              @click="logout"
              class="btn btn-danger"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useCartStore } from '@/stores/cartStore';
import { useCart } from '@/composables/useCart';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();

const {
  getProductName,
  getProductImage,
  calculatePrice,
  calculateSubtotal,
  calculateTotal,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} = useCart();

const logout = () => {
  authStore.clearToken(); // Clear the token from the store
  router.push('/login'); // Redirect to the login page
};

const gotoProfile = () => {
  router.push('/profile'); // Redirect to the login page
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Reddit+Sans:ital,wght@0,200..900;1,200..900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');

* {
  font-family: 'Roboto', sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
}

.dropdown {
  margin-right: 10px;
}

.dropdown .btn {
  background-color: transparent;
  border: none;
}

.utility-btn .btn {
  margin-right: 10px;
  background-color: transparent;
  color: white;
  border: none;
}

.utility-btn .btn:hover {
  margin-right: 10px;
  background-color: #4c1d95;
  color: white;
  border: none;
}

.navbar {
  background-color: hsla(240, 15%, 9%, 1);
}
.custom-dropdown {
  width: 400px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.cart {
  border-radius: 10px;
}

.cart .title {
  font-weight: bold;
  font-size: 14px;
  color: #63656b;
  padding: 10px;
  border-bottom: 1px solid #efeff3;
}

.cart .products {
  padding: 10px;
}

.cart .cart-product-image {
  width: 70%;
}

.btn-primary {
  border: 1px solid #4c1d95;
  background-color: #4c1d95;
}

.btn-primary:hover {
  background-color: #8c4fff7e;
  border-color: hsla(262, 83%, 58%, 0.5);
}

.cart .product {
  display: grid;
  grid-template-columns: 60px 1fr 80px 1fr;
  gap: 10px;
  align-items: center;
  padding: 10px !important;
}

.cart .product span {
  font-size: 14px;
  font-weight: bold;
  color: #47484b;
}

.cart .product p {
  font-size: 12px;
  color: #7a7c81;
}

.cart .quantity {
  display: flex;
  align-items: center;
  gap: 5px;
}

.cart .quantity button {
  background: none;
  border: none;
  cursor: pointer;
}

.cart .quantity label {
  font-size: 14px;
  font-weight: bold;
}

.cart .price {
  font-size: 14px;
  font-weight: bold;
  color: #47484b;
}

.coupons {
  border-radius: 10px;
}

.coupons .title {
  font-weight: bold;
  font-size: 14px;
  color: #63656b;
  padding: 10px;
  border-bottom: 1px solid #efeff3;
}

.coupons .form {
  display: flex;
  gap: 10px;
  padding: 10px;
}

.coupons .input_field {
  flex: 1;
  padding: 8px;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
}

.coupons button {
  background: #4480ff;
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
}

.checkout {
  border-radius: 10px;
}

.checkout .title {
  font-weight: bold;
  font-size: 14px;
  color: #63656b;
  padding: 10px;
  border-bottom: 1px solid #efeff3;
}

.checkout .details {
  padding: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5px;
}

.checkout .details span {
  font-size: 12px;
  color: #63656b;
}

.checkout .checkout--footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #efeff3;
}

.checkout .price {
  font-size: 18px;
  font-weight: bold;
}

.checkout .checkout-btn {
  background: #4480ff;
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
}

.icon-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-container svg {
  padding: 5px;
  color: #fff;
  font-size: 24px;
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #8d4fff;
  color: #fff;
  font-size: 12px;
  font-weight: bold;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

.collapse .navbar-collap {
  height: 100vh !important;
}
</style>
