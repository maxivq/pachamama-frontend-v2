<template>
  <main class="contact">
    <header class="contact-header">
      <h1>Contacto</h1>
      <p>Encontranos y escribinos para hacer tu pedido o consultar por productos.</p>
    </header>

    <section class="contact-grid">
      <div class="contact-card">
        <h2>Dónde estamos</h2>
        <p class="contact-text">Dietetica Pachamama Colorada</p>
        <p class="contact-text">Dirección: Av Rademacher 2880</p>
        <p class="contact-text">Posadas / Misiones</p>

        <h3>Horarios</h3>
        <p class="contact-text">Lunes a viernes: 8:00 a 12:30 - 15:30 a 20:00</p>
        <p class="contact-text">Sábados: 9:00 a 12:30</p>
      </div>

      <div class="contact-card">
        <h2>WhatsApp</h2>
        <p class="contact-text">Escribinos por WhatsApp para hacer tu pedido o sacarte dudas.</p>
        <button type="button" class="whatsapp-contact" @click="openWhatsApp">
          Abrir WhatsApp
        </button>
        <p class="contact-small">Número: 5493764809283</p>

        <h3>Otros medios</h3>
        <p class="contact-text">Redes sociales: <a href="https://www.instagram.com/pachamamacolorada/" target="_blank" rel="noopener noreferrer">Instagram</a></p>
      </div>
    </section>

    <section class="contact-map-section">
      <h2 class="map-title">Ver en el mapa</h2>
      <p class="contact-text map-subtitle">Encontranos fácilmente en Google Maps.</p>
      <div class="map-wrapper">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3542.9486836279743!2d-55.895305699999994!3d-27.377318!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9457bf62700f0ce1%3A0x4f76fd0ff48e4697!2sPachamama%20Colorada%20-%20Dietetica!5e0!3m2!1ses-419!2sar!4v1763503606626!5m2!1ses-419!2sar"
          style="border:0;"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </section>
  </main>
</template>

<script setup>
const phone = '5493764809283';

function openWhatsApp() {
  const url = `https://wa.me/${phone}`;
  window.open(url, '_blank');
}
</script>

<style scoped>
.contact {
  max-width: 1120px;
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
}

.contact-header {
  text-align: center;
  margin-bottom: 2rem;
}

.contact-header h1 {
  margin-bottom: 0.5rem;
}

.contact-grid {
  display: grid;
  gap: 1.5rem;
}

.contact-card {
  background-color: #ffffff;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08);
}

.contact-card h2 {
  margin-top: 0;
  margin-bottom: 0.75rem;
}

.contact-card h3 {
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
}

.contact-text {
  margin: 0.25rem 0;
}

.contact-small {
  margin-top: 0.75rem;
  font-size: 0.85rem;
  color: #6b7280;
}

.whatsapp-contact {
  margin-top: 0.75rem;
  border: none;
  border-radius: 999px;
  padding: 0.6rem 1.3rem;
  background-color: #22c55e;
  color: #f9fafb;
  font-weight: 600;
  cursor: pointer;
}

.whatsapp-contact:hover {
  background-color: #16a34a;
}

.contact-map-section {
  margin-top: 2.5rem;
}

.map-title {
  text-align: center;
  margin-bottom: 0.25rem;
}

.map-subtitle {
  text-align: center;
  margin-bottom: 1.25rem;
}

.map-wrapper {
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08);
}

.map-wrapper iframe {
  width: 100%;
  height: 320px;
  display: block;
}

@media (min-width: 768px) {
  .contact-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
