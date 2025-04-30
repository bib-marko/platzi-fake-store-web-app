import { defineStore } from 'pinia';
import { Product } from '@/types/Product';
import { fetchCategories } from '@/api/categoryApi';
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from '@/api/productApi';

export const useProductStore = defineStore('products', {
  state: () => ({
    products: [] as Product[],
    search_term: '',
    selectedCategory: '',
    currentProduct: null as Product | null,
    categoriesData: [],
  }),

  actions: {
    setSearchTerm(term: string) {
      this.search_term = term;
    },

    setSelectedCategory(category: string) {
      this.selectedCategory = category;
    },

    async fetchProducts() {
      try {
        const data = await fetchProducts();
        this.products = data;
      } catch (error) {
        console.error('Error fetching products:', error);
        this.products = [];
      }
    },

    async addProduct(product: Omit<Product, 'id'>) {
      try {
        const newData = await addProduct(product);
        const newProduct = { ...product, id: new Date().getTime() };
        this.products = [...this.products, newProduct];
      } catch (error) {
        console.error('Error adding product:', error);
        alert('Failed to add product. Please try again.');
      }
    },

    async updateProduct(id: number, product: Omit<Product, 'id'>) {
      try {
        const updatedProduct = await updateProduct(id, product); // Use productApi.ts
        this.products = this.products.map((p) =>
          p.id === id ? updatedProduct : p
        );
      } catch (error) {
        console.error('Error updating product:', error);
      }
    },

    async deleteProduct(id: number) {
      try {
        const success = await deleteProduct(id); // Use productApi.ts
        if (success) {
          this.products = this.products.filter((p) => p.id !== id);
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    },

    async fetchCategories() {
      try {
        const data = await fetchCategories(); // Use categoryApi.ts
        this.categoriesData = data;
      } catch (error) {
        console.error('Error fetching category:', error);
        this.categoriesData = [];
      }
    },
  },

  getters: {
    filteredProducts: (state) =>
      state.products.filter((p) => {
        const matchesSearchTerm = p.title
          .toLowerCase()
          .includes(state.search_term.toLowerCase());
        const matchesCategory =
          state.selectedCategory === '' ||
          p.category.id === Number(state.selectedCategory);
        return matchesSearchTerm && matchesCategory;
      }),

    getCategory: (state) => {
      return state.categoriesData;
    },
  },
});
