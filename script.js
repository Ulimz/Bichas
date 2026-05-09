document.addEventListener('DOMContentLoaded', () => {
  const buyButton = document.getElementById('buyButton');

  buyButton.addEventListener('click', async () => {
    buyButton.disabled = true;
    buyButton.textContent = 'Preparando...';

    try {
      // 1) obtener la clave pública de Stripe desde el servidor
      const configRes = await fetch('/config');
      if (!configRes.ok) throw new Error('No se pudo obtener la configuración');
      const config = await configRes.json();
      const publishableKey = config.publishableKey;

      // 2) crear una sesión de checkout en el servidor
      const sessionRes = await fetch('/create-checkout-session', { method: 'POST' });
      if (!sessionRes.ok) {
        const errText = await sessionRes.text();
        throw new Error(errText || 'Fallo al crear sesión');
      }
      const session = await sessionRes.json();

      // 3) redirigir a Stripe Checkout
      // Si no hay publishableKey o si la sesión es mock, hacemos una redirección local a /success
      if (!publishableKey || (session.id && session.id.startsWith('mock_session_'))) {
        window.location = '/success';
        return;
      }

      const stripeJs = await loadStripe(publishableKey);
      const { error } = await stripeJs.redirectToCheckout({ sessionId: session.id });
      if (error) throw error;
    } catch (err) {
      console.error(err);
      alert('Ocurrió un error: ' + (err.message || err));
      buyButton.disabled = false;
      buyButton.textContent = 'Comprar ahora';
    }
  });
});

// tiny loader for Stripe.js
async function loadStripe(key) {
  if (!window.Stripe) {
    await new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://js.stripe.com/v3/';
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }
  return Stripe(key);
}

