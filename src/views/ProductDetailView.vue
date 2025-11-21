<template>
  <main class="product-detail">
    <section v-if="loading" class="center">
      <p>Cargando producto...</p>
    </section>

    <section v-else-if="error" class="center">
      <p>{{ error }}</p>
    </section>

    <section v-else-if="product" class="product-layout">
      <div class="image-wrapper" v-if="product.imageUrl">
        <img :src="product.imageUrl" :alt="product.title" />
      </div>
      <div class="info">
        <h1>{{ product.title }}</h1>
        <p class="price">$ {{ product.price }}</p>
        <p class="description">{{ product.description }}</p>
        <button
          v-if="!isAdmin"
          type="button"
          class="add-button"
          @click="addToCart"
        >
          Agregar al carrito
        </button>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useCartStore } from '../stores/cart';
import api from '../services/api';

const route = useRoute();
const cart = useCartStore();

const product = ref(null);
const loading = ref(true);
const error = ref('');
const isAdmin = ref(false);

async function fetchProduct() {
  loading.value = true;
  error.value = '';
  try {
    const id = route.params.id;
    const { data } = await api.get(`/products/${id}`);
    product.value = data;
  } catch (err) {
    console.error(err);
    error.value = 'No pudimos cargar el producto. Probá de nuevo más tarde.';
  } finally {
    loading.value = false;
  }
}

function addToCart() {
  if (!product.value) return;
  cart.addItem(product.value);
}

const updateAdmin = () => {
  isAdmin.value = !!localStorage.getItem('pachamama_admin_token');
};

onMounted(() => {
  updateAdmin();
  window.addEventListener('pachamama-admin-changed', updateAdmin);
  fetchProduct();
});

onUnmounted(() => {
  window.removeEventListener('pachamama-admin-changed', updateAdmin);
});
</script>

<style scoped>
.product-detail {
  max-width: 960px;
  margin: 0 auto;
  padding: 3rem 1.5rem 3.5rem;
}

.center {
  text-align: center;
}

.product-layout {
  display: grid;
  gap: 2.5rem;
}

.image-wrapper img {
  width: 100%;
  max-height: 420px;
  object-fit: cover;
  border-radius: 0.75rem;
}

.info h1 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1.8rem;
}

.price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #14532d;
  margin-bottom: 1.25rem;
}

.description {
  margin-bottom: 1.75rem;
  line-height: 1.6;
}

.add-button {
  border: none;
  border-radius: 999px;
  padding: 0.6rem 1.3rem;
  background-color: #14532d;
  color: #f9fafb;
  font-weight: 600;
  cursor: pointer;
}

.add-button:hover {
  background-color: #166534;
}

@media (min-width: 768px) {
  .product-layout {
    grid-template-columns: minmax(0, 1.5fr) minmax(0, 2fr);
    align-items: flex-start;
  }
}
</style>
