<template>
  <main class="admin-login">
    <section class="card">
      <h1>Ingreso administrador</h1>
      <p class="subtitle">Usá tu correo y contraseña de administrador para entrar al panel.</p>

      <form class="form" @submit.prevent="handleSubmit">
        <label class="field">
          <span>Email</span>
          <input
            v-model="email"
            type="email"
            required
            placeholder="admin@ejemplo.com"
          />
        </label>

        <label class="field">
          <span>Contraseña</span>
          <input
            v-model="password"
            type="password"
            required
            placeholder="••••••••"
          />
        </label>

        <p v-if="error" class="error">{{ error }}</p>

        <button class="submit" type="submit" :disabled="loading">
          <span v-if="!loading">Ingresar</span>
          <span v-else>Ingresando...</span>
        </button>
      </form>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const router = useRouter();

async function handleSubmit() {
  error.value = '';
  loading.value = true;

  try {
    const { data } = await api.post('/auth/login', {
      email: email.value,
      password: password.value,
    });

    const { token, admin } = data;

    localStorage.setItem('pachamama_admin_token', token);
    localStorage.setItem('pachamama_admin_info', JSON.stringify(admin));

    api.defaults.headers.common.Authorization = `Bearer ${token}`;

    window.dispatchEvent(new Event('pachamama-admin-changed'));

    router.push('/admin/productos');
  } catch (err) {
    console.error(err);
    if (err.response && err.response.data && err.response.data.message) {
      error.value = err.response.data.message;
    } else {
      error.value = 'No se pudo iniciar sesión. Probá de nuevo más tarde.';
    }
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.admin-login {
  max-width: 420px;
  margin: 3rem auto;
  padding: 0 1.5rem;
}

.card {
  background-color: #ffffff;
  border-radius: 0.75rem;
  padding: 2rem 1.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08);
}

.card h1 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  text-align: center;
}

.subtitle {
  margin: 0 0 1.5rem;
  text-align: center;
  font-size: 0.95rem;
  color: #4b5563;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

.field input {
  padding: 0.55rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  font-size: 0.95rem;
}

.field input:focus {
  outline: none;
  border-color: #14532d;
  box-shadow: 0 0 0 1px #14532d22;
}

.error {
  margin: 0.25rem 0 0;
  font-size: 0.85rem;
  color: #b91c1c;
}

.submit {
  margin-top: 0.75rem;
  width: 100%;
  padding: 0.65rem 1rem;
  border-radius: 999px;
  border: none;
  background-color: #14532d;
  color: #f9fafb;
  font-weight: 600;
  cursor: pointer;
}

.submit[disabled] {
  opacity: 0.7;
  cursor: default;
}

.submit:not([disabled]):hover {
  background-color: #166534;
}
</style>
