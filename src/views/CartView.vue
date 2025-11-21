<template>
  <main class="cart">
    <header class="cart-header">
      <h1>Carrito</h1>
      <p v-if="!items.length">Todavía no agregaste productos.</p>
      <p v-else>
        Tienes {{ itemCount }} producto{{ itemCount !== 1 ? 's' : '' }} en el carrito.
      </p>
    </header>

    <section v-if="items.length" class="cart-content">
      <ul class="cart-list">
        <li v-for="item in items" :key="item.id" class="cart-item">
          <div>
            <h2>{{ item.title }}</h2>
            <p>Cantidad: {{ item.quantity }}</p>
          </div>
          <div class="cart-item-right">
            <p>$ {{ item.price * item.quantity }}</p>
            <button type="button" @click="remove(item.id)">Quitar</button>
          </div>
        </li>
      </ul>

      <div class="cart-summary">
        <p class="total">Total: $ {{ total.toFixed(2) }}</p>
        <div>
          <button type="button" class="clear-button" @click="clear">
            Vaciar carrito
          </button>
          <button type="button" class="whatsapp-button" @click="goToWhatsApp">
            Finalizar por WhatsApp
          </button>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed } from 'vue';
import { useCartStore } from '../stores/cart';

const cart = useCartStore();

const items = computed(() => cart.items);
const itemCount = computed(() => cart.itemCount);
const total = computed(() => cart.total);

function remove(id) {
  cart.removeItem(id);
}

function clear() {
  cart.clearCart();
}

function goToWhatsApp() {
  if (!items.value.length) return;

  const lines = items.value.map(
    (item) => `- ${item.title} (x${item.quantity}) - $${item.price * item.quantity}`
  );

  const message =
    'Hola, quiero hacer este pedido:%0A%0A' +
    lines.join('%0A') +
    `%0A%0ATotal: $${total.value}`;

  const phone = '5493764809283';
  const url = `https://wa.me/${phone}?text=${message}`;

  window.open(url, '_blank');
}
</script>

<style scoped>
.cart {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
}

.cart-header {
  text-align: center;
  margin-bottom: 2rem;
}

.cart-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.cart-item {
  margin: 1rem auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-radius: 0.75rem;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
}

.cart-item h2 {
  margin: 0 0 0.25rem;
  font-size: 1rem;
}

.cart-item p {
  margin: 0;
}

.cart-item-right {
  text-align: right;
}

.cart-item-right p {
  margin: 0 0 0.5rem;
  font-weight: 600;
}

.cart-item-right button {
  border: none;
  background: transparent;
  color: #b91c1c;
  cursor: pointer;
}

.cart-summary {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total {
  font-size: 1.1rem;
  font-weight: 700;
}

.whatsapp-button {
  border: none;
  border-radius: 999px;
  padding: 0.6rem 1.3rem;
  background-color: #22c55e;
  color: #f9fafb;
  font-weight: 600;
  cursor: pointer;
}

.whatsapp-button:hover {
  background-color: #16a34a;
}

.clear-button {
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  padding: 0.5rem 1rem;
  background-color: #ffffff;
  color: #4b5563;
  font-weight: 500;
  cursor: pointer;
  margin-right: 0.75rem;
}

.clear-button:hover {
  background-color: #f3f4f6;
}
</style>
