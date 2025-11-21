<template>
  <main class="home">
    <section class="hero">
      <div class="hero-content">
        <h1>Dietetica Pachamama Colorada</h1>
        <p>
          Un espacio dedicado a la alimentación consciente: productos naturales, orgánicos y
          regionales para cuidar tu cuerpo y tu bienestar.
        </p>
        <RouterLink to="/productos" class="hero-button">Ver productos</RouterLink>
      </div>
    </section>

    <section class="about">
      <h2>Sobre Pachamama Colorada</h2>
      <p>
        Somos una dietética de barrio enfocada en ofrecer alimentos que respetan tu salud y el
        entorno. Trabajamos con productores locales y seleccionamos cada producto pensando en su
        calidad y nutrición.
      </p>
      <div class="about-grid">
        <div class="about-card">
          <h3>Productos naturales</h3>
          <p>Granos, semillas, harinas, frutos secos y más, sin vueltas y con buena calidad.</p>
        </div>
        <div class="about-card">
          <h3>Cercanía y confianza</h3>
          <p>Atención cercana, asesoramiento y un lugar donde siempre podés consultar.</p>
        </div>
        <div class="about-card">
          <h3>Elecciones conscientes</h3>
          <p>Opciones integrales, orgánicas y sin TACC para acompañar tu estilo de vida.</p>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>

<style scoped>
.home {
  padding-bottom: 2rem;
}

.hero {
  max-width: 55%;
  margin: 3rem auto auto auto;
  display: flex;
  justify-content: center;
  background: #14532d;
  color: #f9fafb;
  border-radius: 10px;
}

.hero-content {
  max-width: 720px;
  width: 100%;
  margin: 0 auto;
  padding: 2.5rem;
}

.hero h1 {
  margin-top: 0;
  font-size: 2.5rem;
  letter-spacing: 0.03em;
}

.hero p {
  font-size: 1.05rem;
  margin-bottom: 1.75rem;
}

.hero-button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 999px;
  background-color: #facc15;
  color: #1f2933;
  font-weight: 600;
  text-decoration: none;
}

.hero-button:hover {
  background-color: #eab308;
  transform: translateY(-1px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.18);
}

.about {
  max-width: 960px;
  margin: 2.5rem auto 0;
  padding: 0 1.5rem;
}

.about h2 {
  text-align: center;
  margin-bottom: 1rem;
}

.about p {
  text-align: center;
  max-width: 720px;
  margin: 0 auto 2rem;
}

.about-grid {
  display: grid;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.about-card {
  background-color: #ffffff;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
}

.about-card h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  text-align: center;
}

.about-card p {
  margin-bottom: 0;
}

@media (max-width: 767px) {
  .hero {
    max-width: 100%;
    margin: 1.5rem 1rem 0;
  }

  .hero-content {
    padding: 1.75rem 1.5rem;
    text-align: center;
  }

  .hero h1 {
    font-size: 1.75rem;
  }

  .hero p {
    font-size: 0.98rem;
  }
}

@media (min-width: 768px) {
  .hero h1 {
    font-size: 3rem;
  }

  .about-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
