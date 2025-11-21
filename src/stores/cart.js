import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('pachamama_cart_items') || '[]'), // { id, title, price, quantity }
  }),
  getters: {
    itemCount: (state) =>
      state.items.reduce((sum, item) => sum + item.quantity, 0),
    total: (state) =>
      state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  },
  actions: {
    persist() {
      localStorage.setItem('pachamama_cart_items', JSON.stringify(this.items));
    },
    addItem(product) {
      const existing = this.items.find((it) => it.id === product._id);
      if (existing) {
        existing.quantity += 1;
      } else {
        this.items.push({
          id: product._id,
          title: product.title,
          price: product.price,
          quantity: 1,
        });
      }
      this.persist();
    },
    removeItem(id) {
      const existing = this.items.find((item) => item.id === id);
      if (!existing) return;

      if (existing.quantity > 1) {
        existing.quantity -= 1;
      } else {
        this.items = this.items.filter((item) => item.id !== id);
      }
      this.persist();
    },
    clearCart() {
      this.items = [];
      this.persist();
    },
  },
});
