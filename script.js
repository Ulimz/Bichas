// Código que se ejecuta al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Comentarios de lectores
    const form = document.getElementById('comment-form');
    const list = document.getElementById('comments-list');
    if (form && list) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('comment-name').value.trim();
            const text = document.getElementById('comment-text').value.trim();
            if (name && text) {
                const div = document.createElement('div');
                div.className = 'comment-item';
                div.innerHTML = `<span class="comment-name">${name}:</span> <span class="comment-text">${text}</span>`;
                list.prepend(div);
                form.reset();
            }
        });
    }
    
    // Animación suave al hacer scroll
    console.log('¡Página de venta cargada correctamente!');
    const observador = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    // Observar elementos para animación
    document.querySelectorAll('.card, .social-btn, .book-cover, .project-image').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s, transform 0.6s';
        observador.observe(element);
    });
    
    // Crear modal de medios dinámicamente si no existe
    if (!document.getElementById('media-modal')) {
        const modal = document.createElement('div');
        modal.id = 'media-modal';
        modal.className = 'media-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" onclick="closeMediaModal()">✖</button>
                <div class="modal-body"></div>
                <div class="modal-caption" style="color:#fff;padding:0.5rem 0.75rem;font-size:0.95rem;"></div>
            </div>`;
        document.body.appendChild(modal);

        // click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeMediaModal();
        });
    }

    // close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMediaModal();
    });
});

// Menú hamburguesa para móviles
function toggleMenu() {
    const nav = document.getElementById('headerNav');
    nav.classList.toggle('active');
}

function closeMenu() {
    const nav = document.getElementById('headerNav');
    nav.classList.remove('active');
}

// Función para comprar el libro

function comprarLibro() {
    abrirPagoModal();
}

function abrirPagoModal() {
    document.getElementById('modal-pago').style.display = 'flex';
}

function cerrarPagoModal() {
    document.getElementById('modal-pago').style.display = 'none';
}


function pagarTarjeta() {
    cerrarPagoModal();
    // Abre Stripe Payment Link en una nueva pestaña
    window.open('https://buy.stripe.com/cNifZgeMK1OW1ti4TTbEA00', '_blank');
}



function pagarBizum() {
    // Mostrar imagen de Bizum en el modal
    var modalContent = document.getElementById('modal-pago-content');
    modalContent.innerHTML = `
        <button class="modal-close" onclick="cerrarPagoModal()">✖</button>
        <h3 style="color:#228B22; text-align:center; margin-bottom:1rem;">Pago por Bizum</h3>
        <img src="imagenbizum.png" alt="Pago Bizum" style="width:100%; border-radius:8px; margin-bottom:1rem;" />
            <p style="text-align:center; color:#fff; font-size:1.1em; background:rgba(34,139,34,0.7); padding:0.7em; border-radius:6px;">
                Envía el importe a <strong>647045527</strong><br>
                Incluye tu nombre y dirección en el concepto.
            </p>
    `;
    document.getElementById('modal-pago').style.display = 'flex';
}

// Función para leer muestra gratis

function leerMuestra() {
    window.open('novela-bichas-muestra.pdf', '_blank');
}

// Función para ver más del proyecto
function verMasProyecto() {
    alert('Más información sobre tu proyecto. Aquí puedes describir en detalle qué hace y por qué es importante.');
    // Puedes enlazar a otra página o abrir un modal
}

// Función para suscribirse al newsletter
function suscribirse(event) {
    event.preventDefault();
    const email = document.getElementById('email-newsletter').value;
    alert(`¡Gracias por suscribirte con: ${email}!\nTe enviaremos noticias exclusivas pronto.`);
    document.getElementById('email-newsletter').value = '';
}

// Smooth scroll para navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/* Media modal (lightbox) handling */
function openMediaModal(type, src, caption) {
    let modal = document.getElementById('media-modal');
    if (!modal) return;

    const content = modal.querySelector('.modal-body');
    content.innerHTML = '';

    if (type === 'image') {
        const img = document.createElement('img');
        img.src = src;
        img.alt = caption || '';
        content.appendChild(img);
    } else if (type === 'video') {
        // If src looks like a YouTube link, embed iframe; otherwise try HTML5 video
        if (/youtube\.com|youtu\.be/.test(src)) {
            const iframe = document.createElement('iframe');
            iframe.src = src;
            iframe.width = '100%';
            iframe.height = '480';
            iframe.setAttribute('allow', 'autoplay; encrypted-media');
            iframe.setAttribute('allowfullscreen', '');
            content.appendChild(iframe);
        } else {
            const video = document.createElement('video');
            video.src = src;
            video.controls = true;
            video.autoplay = true;
            content.appendChild(video);
        }
    }

    const captionEl = modal.querySelector('.modal-caption');
    captionEl.textContent = caption || '';

    modal.classList.add('open');
}

function closeMediaModal() {
    const modal = document.getElementById('media-modal');
    if (!modal) return;
    // stop and remove media to free memory
    const body = modal.querySelector('.modal-body');
    body.innerHTML = '';
    modal.classList.remove('open');
}
