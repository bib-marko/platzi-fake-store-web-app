<template>
  <div class="container mt-5">
    <h1 class="mb-4">Products</h1>

    <div v-if="loading">
      <div class="text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>

    <div v-else>
      <div class="row">
        <div class="col-12 mb-4">
          <div class="input-group mb-3">
            <input
              v-model="store.search_term"
              type="text"
              class="form-control search-input"
              placeholder="Search products..."
              aria-label="Search products"
            />

            <button class="oauthButton" @click="clearSearch">
              Clear Search
              <svg
                class="icon"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m6 17 5-5-5-5"></path>
                <path d="m13 17 5-5-5-5"></path>
              </svg>
            </button>
          </div>

          <div class="input-group mb-3">
            <select v-model="store.selectedCategory" class="form-select">
              <option value="">All Categories</option>
              <option
                v-for="item in store.getCategory"
                :key="item.name"
                :value="item.id"
              >
                {{ item.name }}
              </option>
            </select>

            <button class="oauthButton" @click="clearCategoryFilter">
              Clear Search
              <svg
                class="icon"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m6 17 5-5-5-5"></path>
                <path d="m13 17 5-5-5-5"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="row">
        <div
          v-for="product in store.filteredProducts"
          :key="product.id"
          class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
        >
          <div class="card">
            <div class="card__border"></div>
            <div class="image_container">
              <img
                :src="product.images[0]"
                class="image"
                :alt="product.title"
              />

              <div
                class="hover-buttons"
                v-if="authStore.profile && authStore.profile.role === 'admin'"
              >
                <button
                  class="btn btn-sm btn-primary"
                  @click="editProduct(product.id)"
                >
                  Edit
                </button>
                <button
                  class="btn btn-sm btn-danger"
                  @click="deleteProduct(product.id)"
                >
                  Delete
                </button>
              </div>
            </div>
            <div class="title">
              <span>{{ product.title }}</span>
              <p class="card-text">{{ product.category.name }}</p>
            </div>
            <div class="action">
              <div class="price">
                <span>${{ product.price }}</span>
              </div>
              <button class="cart-button" @click="addToCart(product.id)">
                <i class="bi bi-2-circle"></i>
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
                <span>Add to cart</span>
              </button>
            </div>
          </div>
        </div>
        <div
          v-if="store.filteredProducts.length == 0"
          class="no-data-container"
        >
          <img
            src="/public/assets/no_data.png"
            alt="no_data"
            class="no-data-image"
          />
        </div>
      </div>
    </div>

    <div v-if="error">
      <div class="alert alert-danger" role="alert">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useProductStore } from '@/stores/productStore';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const store = useProductStore();
const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();

const loading = ref(true);
const loading1 = ref(true);
const error = ref<string | null>(null);

store.fetchProducts().finally(() => {
  loading.value = false;
});

store.fetchCategories().finally(() => {
  loading1.value = false;
});

const addToCart = (productId: number) => {
  if (!authStore.token) {
    Swal.fire({
      title: 'Login Required',
      text: 'You need to log in to add products to your cart.',
      icon: 'warning',
      confirmButtonText: 'Login',
    }).then((result) => {
      if (result.isConfirmed) {
        router.push('/login');
      }
    });
    return;
  }

  cartStore.addToCart(productId);
  const product = store.products.find((p) => p.id === productId);
  Swal.fire({
    title: 'Added to Cart!',
    text: `${product?.title.slice(0, 20)}... has been added to your cart.`,
    icon: 'success',
    showConfirmButton: false,
    timer: 1500,
  });
};

const clearSearch = () => {
  store.setSearchTerm('');
};

const editProduct = (productId: number) => {
  if (!authStore.token) {
    Swal.fire({
      title: 'Login Required',
      text: 'You need to log in to edit products.',
      icon: 'warning',
      confirmButtonText: 'Login',
    }).then((result) => {
      if (result.isConfirmed) {
        router.push('/login');
      }
    });
    return;
  }

  router.push(`/edit/${productId}`);
};

const deleteProduct = async (productId: number) => {
  if (!authStore.token) {
    Swal.fire({
      title: 'Login Required',
      text: 'You need to log in to delete products.',
      icon: 'warning',
      confirmButtonText: 'Login',
    }).then((result) => {
      if (result.isConfirmed) {
        router.push('/login');
      }
    });
    return;
  }

  try {
    const confirmed = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this product?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirmed.isConfirmed) {
      await store.deleteProduct(productId);
      Swal.fire('Deleted!', 'The product has been deleted.', 'success');
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    Swal.fire(
      'Error!',
      'Failed to delete the product. Please try again.',
      'error'
    );
  }
};

const clearCategoryFilter = () => {
  store.setSelectedCategory('');
};
</script>

<style scoped>
.image_container .hover-buttons {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: none;
  flex-direction: column;
  gap: 10px;
}

.image_container:hover .hover-buttons {
  display: flex;
}

.hover-buttons button {
  padding: 5px 10px;
  font-size: 12px;
}

.input-group {
  position: relative;
  margin-bottom: 20px;
}

.input-group input {
  --background: #d3d3d3;
  --input-focus: #2d8cf0;
  --font-color: #323232;
  --font-color-sub: #666;
  --bg-color: #fff;
  --main-color: #323232;
  padding-right: 35px;

  width: 250px;
  height: 40px;
  border-radius: 5px;
  border: 2px solid var(--main-color);
  background-color: var(--bg-color);
  box-shadow: 4px 4px var(--main-color);
  font-size: 15px;
  font-weight: 600;
  color: var(--font-color);
  padding: 5px 10px;
  outline: none;
}

.input-group select {
  --background: #d3d3d3;
  --input-focus: #2d8cf0;
  --font-color: #323232;
  --font-color-sub: #666;
  --bg-color: #fff;
  --main-color: #323232;
  padding-right: 35px;

  width: 250px;
  height: 40px;
  border-radius: 5px;
  border: 2px solid var(--main-color);
  background-color: var(--bg-color);
  box-shadow: 4px 4px var(--main-color);
  font-size: 15px;
  font-weight: 600;
  color: var(--font-color);
  padding: 5px 10px;
  outline: none;
}

.search-input {
  background-color: #f0f8ff;
  color: #333;
  border: 1px solid hsla(262, 83%, 58%, 0.5);
}

.search-input:focus {
  background-color: #e6f7ff;
  border-color: #0056b3;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.card {
  --bg-card: #27272a;
  --primary: #6d28d9;
  --primary-800: #4c1d95;
  --primary-shadow: #2e1065;
  --light: #d9d9d9;
  --white: white;
  --zinc-800: #18181bbb;
  --bg-linear: linear-gradient(0deg, var(--primary) 50%, var(--light) 125%);

  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  width: 100%;
  background-color: hsla(240, 15%, 9%, 1);
  background-image:
    radial-gradient(at 88% 40%, hsla(240, 15%, 9%, 1) 0px, transparent 85%),
    radial-gradient(at 49% 30%, hsla(240, 15%, 9%, 1) 0px, transparent 85%),
    radial-gradient(at 14% 26%, hsla(240, 15%, 9%, 1) 0px, transparent 85%),
    radial-gradient(at 0% 64%, hsla(263, 93%, 56%, 1) 0px, transparent 85%),
    radial-gradient(at 41% 94%, hsla(284, 100%, 84%, 1) 0px, transparent 85%),
    radial-gradient(at 100% 99%, hsla(306, 100%, 57%, 1) 0px, transparent 85%);

  box-shadow: 4px 4px var(--bg-card);
  border: 2px solid var(--bg-card);
  border-radius: 1rem;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.image_container {
  overflow: hidden;
  cursor: pointer;
  position: relative;
  z-index: 5;
  width: 100%;
  height: 18rem;
  background-color: #a6a29f;
  border-radius: 0.5rem;
}

.image_container .image {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  fill: var(--light);
}

.title {
  overflow: clip;
  width: 100%;
  font-size: 1rem;
  font-weight: 600;
  color: var(--light);
  text-transform: capitalize;
  text-wrap: nowrap;
  text-overflow: ellipsis;
}

.card-text {
  font-size: 11px;
  background-color: #8c4fff7e;
  text-align: center;
}

.action {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--light);
}

.cart-button {
  cursor: pointer;

  padding: 0.5rem;
  width: 100%;
  background-image: linear-gradient(
    0deg,
    rgba(94, 58, 238, 1) 0%,
    rgba(197, 107, 240, 1) 100%
  );

  font-size: 0.75rem;
  color: var(--white);

  border: 0;
  border-radius: 9999px;
  box-shadow: inset 0 -2px 25px -4px var(--white);
}

.cart-button .cart-icon {
  width: 1rem;
}

.star-icon {
  width: 1.5rem;
  color: yellow !important;
}

.btn-primary {
  background-color: #4c1d95;
}

.btn-primary:hover {
  background-color: #8c4fff7e;
  border-color: hsla(262, 83%, 58%, 0.5);
}

.no-data-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50%;
}

.no-data-image {
  display: block;
  width: 50% !important;
}

.spinner-border {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  vertical-align: text-bottom;
  border: 0.25em solid #f3f3f3;
  border-top: 0.25em solid #000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.oauthButton {
  --background: #d3d3d3;
  --input-focus: #2d8cf0;
  --font-color: #323232;
  --font-color-sub: #666;
  --bg-color: #fff;
  --main-color: #323232;
  padding-right: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 100%;
  height: 40px;
  border-radius: 5px;
  border: 2px solid var(--main-color);
  background-color: var(--bg-color);
  box-shadow: 4px 4px var(--main-color);
  font-size: 16px;
  font-weight: 600;
  color: var(--font-color);
  cursor: pointer;
  transition: all 250ms;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.oauthButton::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 0;
  background-color: #212121;
  z-index: -1;
  box-shadow: 4px 8px 19px -3px rgba(0, 0, 0, 0.27);
  transition: all 250ms;
}

.oauthButton:hover {
  color: #e8e8e8;
}

.oauthButton:hover::before {
  width: 100%;
}
</style>
