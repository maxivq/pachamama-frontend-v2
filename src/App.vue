<template>
  <div class="app">
    <header class="app-header">
      <nav class="nav">
        <div class="nav-left">
          <h1 class="logo">Pachamama Colorada</h1>
        </div>

        <button
          type="button"
          class="nav-toggle"
          @click="isMenuOpen = !isMenuOpen"
        >
          <span class="sr-only">Abrir menú</span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </button>

        <ul class="nav-links" :class="{ 'is-open': isMenuOpen }">
          <li><RouterLink to="/" @click="isMenuOpen = false">Inicio</RouterLink></li>
          <li><RouterLink to="/productos" @click="isMenuOpen = false">Productos</RouterLink></li>
          <li v-if="!isAdmin">
            <RouterLink to="/carrito" @click="isMenuOpen = false">
              Carrito<span v-if="itemCount"> ({{ itemCount }})</span>
            </RouterLink>
          </li>
          <li v-if="!isAdmin">
            <RouterLink to="/admin/login" @click="isMenuOpen = false">Login admin</RouterLink>
          </li>
          <li v-if="isAdmin">
            <RouterLink to="/admin/productos" @click="isMenuOpen = false">Panel admin</RouterLink>
          </li>
          <li><RouterLink to="/contacto" @click="isMenuOpen = false">Contacto</RouterLink></li>
        </ul>
      </nav>
    </header>

    <main class="app-main">
      <RouterView />
    </main>

    <footer class="app-footer">
      <p>Dietetica Pachamama Colorada &copy; {{ new Date().getFullYear() }}</p>
    </footer>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import { useCartStore } from './stores/cart';

const cartStore = useCartStore();
const itemCount = computed(() => cartStore.itemCount);
const isMenuOpen = ref(false);
const isAdmin = ref(false);

const updateAdmin = () => {
  isAdmin.value = !!localStorage.getItem('pachamama_admin_token');
};

onMounted(() => {
  updateAdmin();
  window.addEventListener('pachamama-admin-changed', updateAdmin);
});

onUnmounted(() => {
  window.removeEventListener('pachamama-admin-changed', updateAdmin);
});
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background-color: #14532d;
  color: #f9f9f9;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
}

.nav-left {
  display: flex;
  align-items: center;
}

.logo {
  font-size: 1.25rem;
  font-weight: 700;
}

.nav-links {
  display: flex;
  gap: 1rem;
  list-style: none;
}

.nav-links a {
  color: #f9f9f9;
  text-decoration: none;
}

.nav-links a.router-link-active {
  font-weight: 600;
}

.nav-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  flex-direction: column;
  gap: 4px;
  padding: 0.25rem;
}

.nav-toggle .bar {
  width: 20px;
  height: 2px;
  background-color: #f9f9f9;
  border-radius: 999px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

.app-main {
  flex: 1;
}

.app-footer {
  text-align: center;
  padding: 1rem;
  background-color: #14532d;
  color: #e5e5e5;
}

@media (max-width: 767px) {
  .nav {
    padding-inline: 1rem;
  }

  .nav-links {
    position: absolute;
    top: 56px;
    right: 0;
    left: 0;
    flex-direction: column;
    background-color: #14532d;
    padding: 0.75rem 1.5rem 1rem;
    gap: 0.5rem;
    display: none;
  }

  .nav-links.is-open {
    display: flex;
  }

  .nav-toggle {
    display: inline-flex;
  }
}
</style>
