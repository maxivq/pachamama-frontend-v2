<template>
  <main class="admin-products">
    <header class="admin-header">
      <h1>Productos (admin)</h1>
      <button type="button" class="logout" @click="handleLogout">Cerrar sesión</button>
    </header>

    <section class="admin-layout">
      <section class="admin-form">
        <h2>{{ editingId ? 'Editar producto' : 'Nuevo producto' }}</h2>

        <form @submit.prevent="handleSubmit" class="form">
          <label class="field">
            <span>Título</span>
            <input v-model="form.title" type="text" required />
          </label>

          <label class="field">
            <span>Descripción</span>
            <textarea v-model="form.description" rows="3"></textarea>
          </label>

          <label class="field">
            <span>Precio</span>
            <input v-model.number="form.price" type="number" step="0.01" min="0" required />
          </label>

          <label class="field">
            <span>Categoría</span>
            <input v-model="form.category" type="text" placeholder="Ej: Galletitas, Frutos secos" />

            <div v-if="categories.length" class="category-chips">
              <span class="chips-label">Rápidos:</span>
              <button
                v-for="cat in categories"
                :key="cat"
                type="button"
                class="chip"
                @click="applyCategory(cat)"
              >
                {{ cat }}
              </button>
            </div>
          </label>

          <label class="field">
            <span>URL de imagen</span>
            <input v-model="form.imageUrl" type="url" />
          </label>

          <p v-if="error" class="error">{{ error }}</p>

          <div class="actions">
            <button type="submit" class="primary" :disabled="saving">
              <span v-if="!saving">{{ editingId ? 'Guardar cambios' : 'Crear producto' }}</span>
              <span v-else>Guardando...</span>
            </button>

            <button
              v-if="editingId"
              type="button"
              class="secondary"
              @click="resetForm"
            >
              Cancelar edición
            </button>
          </div>
        </form>
      </section>

      <section class="admin-list">
        <h2>Listado de productos</h2>

        <section v-if="!loading && !listError" class="admin-filters">
          <div class="filter-group">
            <label class="filter-field">
              <span>Buscar</span>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar por nombre o categoría"
              />
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

        <p v-if="loading" class="info">Cargando productos...</p>
        <p v-else-if="listError" class="error">{{ listError }}</p>

        <table v-else class="table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in filteredProducts" :key="product._id">
              <td>{{ product.title }}</td>
              <td>{{ product.category || '-' }}</td>
              <td>$ {{ product.price }}</td>
              <td>
                <button type="button" class="small" @click="startEdit(product)">
                  Editar
                </button>
                <button
                  type="button"
                  class="small danger"
                  @click="confirmDelete(product)"
                >
                  Borrar
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <p v-if="!loading && products.length === 0" class="info">
          No hay productos cargados.
        </p>
      </section>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();

const products = ref([]);
const loading = ref(true);
const listError = ref('');

const form = ref({
  title: '',
  description: '',
  price: 0,
  category: '',
  imageUrl: '',
});

const editingId = ref(null);
const saving = ref(false);
const error = ref('');

const searchQuery = ref('');
const selectedCategory = ref('');

function ensureAuthOrRedirect(err) {
  if (err && err.response && err.response.status === 401) {
    localStorage.removeItem('pachamama_admin_token');
    localStorage.removeItem('pachamama_admin_info');
    delete api.defaults.headers.common.Authorization;
    router.push('/admin/login');
  }
}

const categories = computed(() => {
  const set = new Set();
  for (const p of products.value) {
    if (p.category) {
      set.add(p.category);
    }
  }
  return Array.from(set).sort();
});

const filteredProducts = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  const category = selectedCategory.value;

  return products.value.filter((p) => {
    if (category && p.category !== category) return false;
    if (!query) return true;

    const text = `${p.title || ''} ${p.category || ''}`.toLowerCase();
    return text.includes(query);
  });
});

function applyCategory(cat) {
  form.value.category = cat;
}

async function fetchProducts() {
  loading.value = true;
  listError.value = '';
  try {
    const { data } = await api.get('/products', {
      params: { page: 1, limit: 100 },
    });
    products.value = data.items;
  } catch (err) {
    console.error(err);
    ensureAuthOrRedirect(err);
    listError.value = 'No se pudieron cargar los productos.';
  } finally {
    loading.value = false;
  }
}

function resetForm() {
  editingId.value = null;
  error.value = '';
  form.value = {
    title: '',
    description: '',
    price: 0,
    category: '',
    imageUrl: '',
  };
}

function startEdit(product) {
  editingId.value = product._id;
  error.value = '';
  form.value = {
    title: product.title || '',
    description: product.description || '',
    price: product.price || 0,
    category: product.category || '',
    imageUrl: product.imageUrl || '',
  };
}

async function handleSubmit() {
  error.value = '';
  saving.value = true;

  try {
    if (editingId.value) {
      await api.put(`/products/${editingId.value}`, form.value);
    } else {
      await api.post('/products', form.value);
    }

    resetForm();
    await fetchProducts();
  } catch (err) {
    console.error(err);
    ensureAuthOrRedirect(err);
    error.value = 'No se pudo guardar el producto.';
  } finally {
    saving.value = false;
  }
}

async function confirmDelete(product) {
  const ok = window.confirm(`¿Seguro que querés borrar "${product.title}"?`);
  if (!ok) return;

  try {
    await api.delete(`/products/${product._id}`);
    await fetchProducts();
  } catch (err) {
    console.error(err);
    ensureAuthOrRedirect(err);
    alert('No se pudo borrar el producto.');
  }
}

function handleLogout() {
  localStorage.removeItem('pachamama_admin_token');
  localStorage.removeItem('pachamama_admin_info');
  delete api.defaults.headers.common.Authorization;
  router.push('/admin/login');
}

onMounted(() => {
  const token = localStorage.getItem('pachamama_admin_token');
  if (!token) {
    router.push('/admin/login');
    return;
  }
  fetchProducts();
});
</script>

<style scoped>
.admin-products {
  max-width: 1120px;
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.logout {
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background-color: #ffffff;
  padding: 0.45rem 0.9rem;
  font-size: 0.85rem;
  cursor: pointer;
}

.admin-layout {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.admin-form {
  background-color: #ffffff;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08);
}

.admin-list {
  background-color: #ffffff;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  margin-top: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.9rem;
}

.field span {
  color: #374151;
}

.field input,
.field textarea {
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  font-size: 0.95rem;
}

.field input:focus,
.field textarea:focus {
  outline: none;
  border-color: #14532d;
  box-shadow: 0 0 0 1px #14532d22;
}

.category-chips {
  margin-top: 0.35rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  align-items: center;
}

.chips-label {
  font-size: 0.8rem;
  color: #6b7280;
}

.chip {
  border-radius: 999px;
  border: 1px solid #d1d5db;
  padding: 0.2rem 0.65rem;
  font-size: 0.8rem;
  background-color: #f9fafb;
  cursor: pointer;
}

.chip:hover {
  background-color: #ecfdf3;
  border-color: #bbf7d0;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.primary,
.secondary {
  border-radius: 999px;
  padding: 0.6rem 1.2rem;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
}

.primary {
  background-color: #14532d;
  color: #f9fafb;
}

.primary:hover {
  background-color: #166534;
}

.secondary {
  background-color: #ffffff;
  border: 1px solid #d1d5db;
}

.error {
  font-size: 0.85rem;
  color: #b91c1c;
}

.info {
  font-size: 0.9rem;
  color: #4b5563;
}

.admin-filters {
  margin-top: 0.5rem;
}

.filter-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.filter-field {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 0.85rem;
}

.filter-field span {
  color: #374151;
}

.filter-field input,
.filter-field textarea {
  padding: 0.4rem 0.6rem;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  font-size: 0.85rem;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  font-size: 0.9rem;
}

.table th,
.table td {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.table th {
  text-align: left;
  font-weight: 600;
}

.table td:nth-child(3) {
  text-align: right;
  white-space: nowrap;
}

.small {
  border-radius: 999px;
  padding: 0.35rem 0.8rem;
  border: 1px solid #d1d5db;
  background-color: #ffffff;
  font-size: 0.8rem;
  cursor: pointer;
  margin-right: 0.25rem;
}

.danger {
  border-color: #fecaca;
  color: #b91c1c;
}

@media (min-width: 900px) {
  .admin-layout {
    flex-direction: row;
    align-items: flex-start;
  }

  .admin-form {
    flex: 1.1;
  }

  .admin-list {
    flex: 2;
  }
}
</style>
