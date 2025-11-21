import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ProductsView from '../views/ProductsView.vue';
import CartView from '../views/CartView.vue';
import ContactView from '../views/ContactView.vue';
import ProductDetailView from '../views/ProductDetailView.vue';
import AdminLoginView from '../views/AdminLoginView.vue';
import AdminProductsView from '../views/AdminProductsView.vue';

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/productos', name: 'products', component: ProductsView },
  { path: '/productos/:id', name: 'product-detail', component: ProductDetailView },
  { path: '/carrito', name: 'cart', component: CartView },
  { path: '/contacto', name: 'contact', component: ContactView },
  { path: '/admin/login', name: 'admin-login', component: AdminLoginView },
  { path: '/admin/productos', name: 'admin-products', component: AdminProductsView }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
