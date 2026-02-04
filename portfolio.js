// ============================================
// MOBILE MENU TOGGLE
// ============================================
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuToggle) {
  mobileMenuToggle.addEventListener('click', () => {
    mobileMenuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
  
  // Cerrar menú al hacer click en un enlace
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
  
  // Cerrar menú al hacer click fuera
  document.addEventListener('click', (e) => {
    if (!e.target.closest('nav') && navMenu.classList.contains('active')) {
      mobileMenuToggle.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });
}

// ============================================
// NAVEGACIÓN SUAVE
// ============================================
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
      targetSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  });
});

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
let lastScroll = 0;
const navbar = document.querySelector('nav');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  // Añadir sombra al hacer scroll
  if (currentScroll > 100) {
    navbar.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.3)';
  } else {
    navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.3)';
  }
  
  lastScroll = currentScroll;
});

// ============================================
// ACTIVE NAV LINK ON SCROLL
// ============================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  const scrollPosition = window.pageYOffset + 150;
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// ============================================
// SCROLL ANIMATIONS
// ============================================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
    }
  });
}, observerOptions);

// Observar elementos para animación
document.addEventListener('DOMContentLoaded', () => {
  const elementsToAnimate = document.querySelectorAll(
    '.project-card, .skill-category, .stat-item'
  );
  
  elementsToAnimate.forEach(el => {
    el.classList.add('animate-on-scroll');
    observer.observe(el);
  });
});

// ============================================
// FORM VALIDATION & SUBMISSION
// ============================================
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Validar formulario
    if (!contactForm.checkValidity()) {
      contactForm.classList.add('was-validated');
      return;
    }
    
    // Si el formulario es válido, enviarlo
    const formData = new FormData(contactForm);
    const submitButton = contactForm.querySelector('.btn-submit');
    const originalButtonText = submitButton.innerHTML;
    
    // Cambiar botón a estado de carga
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Enviando...</span>';
    
    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        showNotification('✅ ¡Mensaje enviado correctamente! Te responderé pronto.', 'success');
        contactForm.reset();
        contactForm.classList.remove('was-validated');
      } else {
        const data = await response.json();
        if (data.errors) {
          showNotification('❌ Error: ' + data.errors.map(e => e.message).join(', '), 'error');
        } else {
          showNotification('❌ Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.', 'error');
        }
      }
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      showNotification('⚠️ No se pudo conectar con el servidor. Si el problema persiste, contáctame en LinkedIn.', 'error');
    } finally {
      // Restaurar botón
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
    }
  });
  
  // Validación en tiempo real
  const inputs = contactForm.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', () => {
      if (contactForm.classList.contains('was-validated')) {
        input.checkValidity();
      }
    });
    
    input.addEventListener('input', () => {
      if (contactForm.classList.contains('was-validated')) {
        input.checkValidity();
      }
    });
  });
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================
function showNotification(message, type = 'info') {
  // Remover notificación existente si la hay
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Crear nueva notificación
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Estilos
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 1.5rem 2rem;
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
    color: white;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    z-index: 10000;
    font-weight: 500;
    max-width: 500px;
    min-width: 300px;
    text-align: center;
    animation: slideInDown 0.4s ease-out;
  `;
  
  document.body.appendChild(notification);
  
  // Auto-remover después de 5 segundos
  setTimeout(() => {
    notification.style.animation = 'slideOutUp 0.4s ease-out';
    setTimeout(() => notification.remove(), 400);
  }, 5000);
  
  // Permitir cerrar con click
  notification.addEventListener('click', () => {
    notification.style.animation = 'slideOutUp 0.4s ease-out';
    setTimeout(() => notification.remove(), 400);
  });
}

// Añadir estilos de animación para notificaciones
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
  @keyframes slideInDown {
    from {
      transform: translateX(-50%) translateY(-100px);
      opacity: 0;
    }
    to {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutUp {
    from {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
    to {
      transform: translateX(-50%) translateY(-100px);
      opacity: 0;
    }
  }
  
  .notification {
    cursor: pointer;
    transition: transform 0.2s ease;
  }
  
  .notification:hover {
    transform: translateX(-50%) translateY(-5px) !important;
  }
  
  @media (max-width: 768px) {
    .notification {
      left: 10px !important;
      right: 10px !important;
      transform: translateX(0) !important;
      max-width: calc(100% - 20px) !important;
      min-width: auto !important;
    }
    
    @keyframes slideInDown {
      from {
        transform: translateY(-100px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOutUp {
      from {
        transform: translateY(0);
        opacity: 1;
      }
      to {
        transform: translateY(-100px);
        opacity: 0;
      }
    }
    
    .notification:hover {
      transform: translateY(-5px) !important;
    }
  }
`;
document.head.appendChild(notificationStyles);

// ============================================
// TYPING EFFECT EN HERO (OPCIONAL)
// ============================================
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.textContent = '';
  
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// Activar efecto de escritura si existe el elemento
window.addEventListener('load', () => {
  const subtitleElement = document.querySelector('.subtitle');
  if (subtitleElement) {
    const originalText = subtitleElement.textContent;
    // Descomentar la siguiente línea para activar el efecto de escritura
    // typeWriter(subtitleElement, originalText, 80);
  }
});

// ============================================
// SCROLL TO TOP BUTTON
// ============================================
function createScrollToTopButton() {
  const button = document.createElement('button');
  button.innerHTML = '<i class="fas fa-arrow-up"></i>';
  button.className = 'scroll-to-top';
  button.setAttribute('aria-label', 'Volver arriba');
  
  button.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 1.2rem;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
  `;
  
  button.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      button.style.opacity = '1';
      button.style.visibility = 'visible';
    } else {
      button.style.opacity = '0';
      button.style.visibility = 'hidden';
    }
  });
  
  button.addEventListener('mouseenter', () => {
    button.style.transform = 'translateY(-5px)';
    button.style.boxShadow = '0 8px 20px rgba(99, 102, 241, 0.6)';
  });
  
  button.addEventListener('mouseleave', () => {
    button.style.transform = 'translateY(0)';
    button.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.4)';
  });
  
  document.body.appendChild(button);
}

// Crear botón de scroll to top
createScrollToTopButton();

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================
// Lazy loading de imágenes
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      }
    });
  });
  
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ============================================
// CONSOLE MESSAGE
// ============================================
console.log(
  '%c¡Hola Developer! 👋',
  'color: #6366f1; font-size: 24px; font-weight: bold;'
);
console.log(
  '%c¿Te gusta explorar el código? ¡Conectemos en LinkedIn!',
  'color: #94a3b8; font-size: 14px;'
);
console.log(
  '%chttps://www.linkedin.com/in/bautista-hauret',
  'color: #06b6d4; font-size: 12px;'
);