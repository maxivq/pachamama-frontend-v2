<template>
  <main class="products">
    <header class="products-header">
      <h1>Productos</h1>
      <p>Conocé la selección de productos de Pachamama Colorada.</p>
    </header>

    <section v-if="!loading && !error" class="products-filters">
      <div class="filter-group">
        <label class="filter-field">
          <span>Buscar</span>
          <div class="search-inline">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar por nombre o descripción"
              @keyup.enter="applySearch"
            />
            <button type="button" class="search-btn" @click="applySearch">Buscar</button>
          </div>
        </label>

        <label class="filter-field">
          <span>Categoría</span>
          <select v-model="selectedCategory">
            <option value="">Todas</option>
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </label>
      </div>
    </section>

    <section v-if="loading" class="center">
      <p>Cargando productos...</p>
    </section>

    <section v-else-if="error" class="center">
      <p>{{ error }}</p>
    </section>

    <section v-else class="products-grid">
      <article v-for="product in filteredProducts" :key="product._id" class="product-card">
        <img v-if="product.imageUrl" :src="product.imageUrl" :alt="product.title" class="product-image" />
        <div class="product-body">
          <h2>{{ product.title }}</h2>
          <p class="product-description">{{ product.description }}</p>
        </div>
        <div class="product-footer">
          <p class="product-price">$ {{ product.price }}</p>
          <div class="product-actions">
            <RouterLink :to="{ name: 'product-detail', params: { id: product._id } }" class="secondary-button">
              Ver producto
            </RouterLink>
            <button
              v-if="!isAdmin"
              class="product-button"
              type="button"
              @click="addToCart(product)"
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      </article>

      <p v-if="!products.length" class="center">
        Todavía no hay productos cargados.
      </p>
    </section>

    <nav v-if="totalPages > 1" class="pagination">
      <button type="button" class="page-btn" :disabled="page === 1 || loading" @click="changePage(page - 1)">
        ‹ Anterior
      </button>

      <div class="page-info">
        <span class="page-pill">Página {{ page }} de {{ totalPages }}</span>
      </div>

      <button type="button" class="page-btn" :disabled="page === totalPages || loading" @click="changePage(page + 1)">
        Siguiente ›
      </button>
    </nav>

    <div v-if="showToast" class="toast">
      {{ toastMessage }}
    </div>
  </main>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import api from '../services/api';
import { useCartStore } from '../stores/cart';

const route = useRoute();
const router = useRouter();

const products = ref([]);
const loading = ref(true);
const error = ref('');
const showToast = ref(false);
const toastMessage = ref('');
const page = ref(1);
const totalPages = ref(1);
const limit = 9;

const searchQuery = ref('');
const selectedCategory = ref('');
const allCategories = ref([]);

const cart = useCartStore();
const isAdmin = ref(false);

const categories = computed(() => allCategories.value);

const filteredProducts = computed(() => products.value);

async function fetchProducts() {
  loading.value = true;
  error.value = '';
  try {
    const params = {
      page: page.value,
      limit,
    };

    if (selectedCategory.value) {
      params.category = selectedCategory.value;
    }

    const q = searchQuery.value.trim();
    if (q) {
      params.q = q;
    }

    const { data } = await api.get('/products', { params });
    products.value = data.items;
    totalPages.value = data.totalPages;
  } catch (err) {
    console.error(err);
    error.value = 'No pudimos cargar los productos. Probá de nuevo más tarde.';
  } finally {
    loading.value = false;
  }
}

async function fetchAllCategories() {
  try {
    const { data } = await api.get('/products', {
      params: { all: true },
    });
    const set = new Set();
    for (const p of data.items || []) {
      if (p.category) {
        set.add(p.category);
      }
    }
    allCategories.value = Array.from(set).sort();
  } catch (err) {
    console.error(err);
  }
}

watch(selectedCategory, () => {
  page.value = 1;
  fetchProducts();
});

function applySearch() {
  page.value = 1;
  fetchProducts();
}

function addToCart(product) {
  cart.addItem(product);
  toastMessage.value = `${product.title} agregado al carrito`;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 5000);
}

function changePage(newPage) {
  if (newPage < 1 || newPage > totalPages.value) return;
  // Actualizamos la URL; el watcher de la ruta se encargará de recargar
  router.push({
    name: 'products',
    query: {
      ...route.query,
      page: newPage,
    },
  });
}

const updateAdmin = () => {
  isAdmin.value = !!localStorage.getItem('pachamama_admin_token');
};

onMounted(async () => {
  // Inicializar página desde la URL si existe
  const initialPage = Number(route.query.page) || 1;
  page.value = initialPage;

  updateAdmin();
  window.addEventListener('pachamama-admin-changed', updateAdmin);
  await Promise.all([fetchProducts(), fetchAllCategories()]);
});

onUnmounted(() => {
  window.removeEventListener('pachamama-admin-changed', updateAdmin);
});

// Mantener sincronía si el usuario cambia la URL manualmente o navega con el historial
watch(
  () => route.query.page,
  (newPage) => {
    const num = Number(newPage) || 1;
    if (num !== page.value) {
      page.value = num;
      fetchProducts();
    }
  }
);
</script>

<style scoped>
.products {
  max-width: 1120px;
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
}

.products-header {
  text-align: center;
  margin-bottom: 2rem;
}

.products-header h1 {
  margin-bottom: 0.5rem;
}

.products-filters {
  margin-bottom: 1.5rem;
}

.filter-group {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.filter-field {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 0.9rem;
}

.filter-field span {
  color: #374151;
}

.filter-field input,
.filter-field select {
  padding: 0.45rem 0.6rem;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  font-size: 0.9rem;
}

.search-inline {
  display: flex;
  gap: 0.5rem;
}

.search-inline input {
  flex: 1;
}

.search-btn {
  border-radius: 999px;
  border: none;
  padding: 0.45rem 0.9rem;
  background-color: #14532d;
  color: #f9fafb;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.search-btn:hover {
  background-color: #166534;
}

.center {
  text-align: center;
  margin-top: 2rem;
}

.products-grid {
  display: grid;
  gap: 1.5rem;
}

.product-card {
  background-color: #ffffff;
  border-radius: 0.75rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -4px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-body {
  padding: 1.25rem 1.25rem 0.75rem;
  flex: 1;
}

.product-description {
  margin: 0.5rem 0 0.75rem;
  font-size: 0.95rem;
  color: #4b5563;
  line-clamp: 3;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.25rem 1.25rem;
}

.product-price {
  font-weight: 700;
  color: #14532d;
}

.product-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.product-button,
.secondary-button {
  width: 100%;
  padding: 0.6rem 1rem;
  border-radius: 999px;
  border-width: 1px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  line-height: 1.2;
  box-sizing: border-box;
}

.product-button {
  border-style: solid;
  border-color: transparent;
  background-color: #14532d;
  color: #f9fafb;
}

.product-button:hover {
  background-color: #166534;
}

.secondary-button {
  border: 1px solid #e5e7eb;
  background-color: #ffffff;
  color: #14532d;
  text-decoration: none;
}

.secondary-button:hover {
  background-color: #f3f4f6;
}

.pagination {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.page-btn {
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background-color: #ffffff;
  padding: 0.4rem 0.9rem;
  font-size: 0.85rem;
  color: #14532d;
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.page-btn:hover:not(:disabled) {
  background-color: #f3f4f6;
  border-color: #d1d5db;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: default;
}

.page-info {
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-pill {
  padding: 0.3rem 0.9rem;
  border-radius: 999px;
  background-color: #ecfdf3;
  color: #14532d;
  font-size: 0.85rem;
  font-weight: 500;
}

@media (min-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.toast {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  background-color: rgba(22, 163, 74, 0.95);
  color: #f9fafb;
  padding: 0.75rem 1.25rem;
  border-radius: 999px;
  font-size: 0.9rem;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.25);
}
</style>
