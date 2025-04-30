import { createRouter, createWebHistory } from 'vue-router';
import ProductList from '@/views/ProductList.vue';
import ProductForm from '@/views/ProductForm.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import UserManagement from '@/views/UserManagement.vue';
import Profile from '@/views/Profile.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ProductList,
    },
    {
      path: '/add',
      name: 'add',
      component: ProductForm,
      meta: { requiresAuth: true },
    },
    {
      path: '/edit/:id',
      name: 'edit',
      component: ProductForm,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: { requiresAuth: true }, // Protect the profile route
    },
    {
      path: '/users',
      name: 'users',
      component: UserManagement,
      meta: { requiresAuth: true }, // Protect user management page
    },
  ],
});

export default router;
