import { setActivePinia, createPinia } from 'pinia';
import { useCartStore } from '../stores/cart.js';

beforeEach(() => {
  // Limpiar localStorage y crear una nueva instancia de Pinia antes de cada test
  localStorage.clear();
  setActivePinia(createPinia());
});

test('empieza con carrito vacío', () => {
  const cart = useCartStore();

  expect(cart.items).toEqual([]);
  expect(cart.itemCount).toBe(0);
  expect(cart.total).toBe(0);
});

test('addItem agrega un producto nuevo con quantity=1', () => {
  const cart = useCartStore();

  const product = { _id: 'p1', title: 'Producto 1', price: 10 };
  cart.addItem(product);

  expect(cart.items).toHaveLength(1);
  expect(cart.items[0]).toMatchObject({
    id: 'p1',
    title: 'Producto 1',
    price: 10,
    quantity: 1,
  });
  expect(cart.itemCount).toBe(1);
  expect(cart.total).toBe(10);
});

test('addItem sobre el mismo producto incrementa quantity', () => {
  const cart = useCartStore();
  const product = { _id: 'p1', title: 'Producto 1', price: 10 };

  cart.addItem(product);
  cart.addItem(product);

  expect(cart.items).toHaveLength(1);
  expect(cart.items[0].quantity).toBe(2);
  expect(cart.itemCount).toBe(2);
  expect(cart.total).toBe(20);
});

test('removeItem reduce quantity o elimina el producto', () => {
  const cart = useCartStore();
  const product = { _id: 'p1', title: 'Producto 1', price: 10 };

  cart.addItem(product); // quantity = 1
  cart.addItem(product); // quantity = 2

  cart.removeItem('p1'); // baja a 1
  expect(cart.items[0].quantity).toBe(1);
  expect(cart.itemCount).toBe(1);
  expect(cart.total).toBe(10);

  cart.removeItem('p1'); // elimina
  expect(cart.items).toHaveLength(0);
  expect(cart.itemCount).toBe(0);
  expect(cart.total).toBe(0);
});

test('clearCart vacía el carrito', () => {
  const cart = useCartStore();
  const product = { _id: 'p1', title: 'Producto 1', price: 10 };

  cart.addItem(product);
  cart.addItem(product);

  cart.clearCart();

  expect(cart.items).toEqual([]);
  expect(cart.itemCount).toBe(0);
  expect(cart.total).toBe(0);
});