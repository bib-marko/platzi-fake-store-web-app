<template>
  <div class="form-container mt-5">
    <form class="form" @submit.prevent="handleSubmit">
      <h1 class="form-title">
        {{ isEditMode ? 'Edit Product' : 'Add New Product' }}
      </h1>

      <div class="input_container">
        <label class="input_label">Title</label>
        <input
          v-model="product.title"
          type="text"
          class="input_field"
          placeholder="Enter product title"
          required
        />
      </div>

      <div class="input_container">
        <label class="input_label">Price</label>
        <input
          v-model.number="product.price"
          type="number"
          class="input_field"
          placeholder="Enter product price"
          required
        />
      </div>

      <div class="input_container">
        <label class="input_label">Description</label>
        <textarea
          v-model="product.description"
          class="input_field"
          placeholder="Enter product description"
          required
        ></textarea>
      </div>

      <div class="input_container">
        <label class="input_label">Category</label>
        <select v-model="product.category.id" class="input_field" required>
          <option
            v-for="item in store.getCategory"
            :key="item.name"
            :value="item.id"
          >
            {{ item.name }}
          </option>
        </select>
      </div>

      <div class="input_container">
        <label class="input_label">Image URL</label>
        <input
          v-model="product.images[0]"
          type="url"
          class="input_field"
          placeholder="Enter image URL"
          required
        />
      </div>

      <div class="btn-group">
        <button type="submit" class="purchase--btn">
          {{ isEditMode ? 'Update' : 'Add' }}
        </button>
        <router-link to="/" class="purchase--btn cancel-btn"
          >Cancel</router-link
        >
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useProductStore } from '../stores/productStore';
import { Product } from '../types/Product';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const store = useProductStore();
const router = useRouter();
const loading = ref(true);

store.fetchCategories().finally(() => {
  loading.value = false;
});

const product = ref<Product>({
  id: 0,
  title: '',
  slug: '',
  price: 0,
  description: '',
  category: {
    id: 0,
    name: '',
    image: '',
    slug: '',
  },
  images: [''],
});

const isEditMode = ref(false);

const productId = router.currentRoute.value.params.id as string;

onMounted(async () => {
  if (productId) {
    isEditMode.value = true;
    const currentProduct = await fetch(
      `https://api.escuelajs.co/api/v1/products/${productId}`
    );
    const data = await currentProduct.json();
    product.value = {
      id: data.id,
      title: data.title,
      slug: data.slug || '',
      price: data.price,
      description: data.description,
      category: {
        id: data.category.id || 0,
        name: data.category.name || '',
        image: data.category.image || '',
        slug: data.category.slug || '',
      },
      images: data.images || [data.image],
    };
  }
});

const handleSubmit = async () => {
  try {
    if (isEditMode.value) {
      await store.updateProduct(product.value.id, product.value);
      Swal.fire({
        title: 'Success!',
        text: 'Product updated successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    } else {
      await store.addProduct(product.value);
      Swal.fire({
        title: 'Success!',
        text: 'Product added successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    }
    router.push('/');
  } catch (error) {
    console.error('Error submitting form:', error);
    Swal.fire({
      title: 'Error!',
      text: 'Failed to submit the form. Please try again.',
      icon: 'error',
      confirmButtonText: 'OK',
    });
  }
};
</script>

<style scoped>
.form-container {
  background: #ffffff;
  box-shadow:
    0px 187px 75px rgba(0, 0, 0, 0.01),
    0px 105px 63px rgba(0, 0, 0, 0.05),
    0px 47px 47px rgba(0, 0, 0, 0.09),
    0px 12px 26px rgba(0, 0, 0, 0.1),
    0px 0px 0px rgba(0, 0, 0, 0.1);
  border-radius: 26px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}

.input_container {
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.input_container textarea {
  height: 100%;
}

.input_label {
  font-size: 10px;
  color: #8b8e98;
  font-weight: 600;
}

.input_field {
  width: auto;
  height: 40px;
  padding: 0 0 0 16px;
  border-radius: 9px;
  outline: none;
  background-color: #f2f2f2;
  border: 1px solid #e5e5e500;
  transition: all 0.3s cubic-bezier(0.15, 0.83, 0.66, 1);
}

.input_field:focus {
  border: 1px solid transparent;
  box-shadow: 0px 0px 0px 2px #242424;
  background-color: transparent;
}

.btn-group {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.purchase--btn {
  width: 200px;
  height: 55px;
  background: #f2f2f2;
  border-radius: 11px;
  border: 0;
  outline: none;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  background: linear-gradient(180deg, #363636 0%, #1b1b1b 50%, #000000 100%);
  box-shadow:
    0px 0px 0px 0px #ffffff,
    0px 0px 0px 0px #000000;
  transition: all 0.3s cubic-bezier(0.15, 0.83, 0.66, 1);
}

.purchase--btn:hover {
  box-shadow:
    0px 0px 0px 2px #ffffff,
    0px 0px 0px 4px #0000003a;
}

.cancel-btn {
  background: #f2f2f2;
  color: #8b8e98;
  font-weight: 600;
  text-align: center;
  padding: 20px;
  text-decoration: none;
}
</style>
