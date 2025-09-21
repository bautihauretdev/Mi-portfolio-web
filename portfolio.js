// Navegación con scroll suave
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const destino = document.querySelector(link.getAttribute('href'));
    if (destino) {
      destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Formulario de contacto con Formspree
const form = document.querySelector('.contact-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  try {
    const response = await fetch("https://formspree.io/f/mwprevoj", {
      method: "POST",
      body: data,
      headers: { "Accept": "application/json" }
    });

    if (response.ok) {
      alert("✅ ¡Gracias! Tu mensaje fue enviado correctamente.");
      form.reset();
    } else {
      alert("❌ Ocurrió un error al enviar el mensaje. Intenta de nuevo.");
    }
  } catch (err) {
    alert("⚠️ No se pudo conectar con el servidor. Intenta más tarde.");
  }
});
