from flask import Flask, jsonify, request, redirect, send_from_directory
from flask_cors import CORS
import os
from dotenv import load_dotenv
import stripe

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))

STRIPE_SECRET_KEY = os.getenv('STRIPE_SECRET_KEY')
STRIPE_PUBLISHABLE_KEY = os.getenv('STRIPE_PUBLISHABLE_KEY')
# Precio del libro en céntimos (ej: 1695 -> €16.95)
PRICE_CENTS = int(os.getenv('PRICE_CENTS', '1695'))
# Gastos de envío por ejemplar en céntimos (ej: 450 -> €4.50)
SHIPPING_CENTS = int(os.getenv('SHIPPING_CENTS', '450'))
CURRENCY = os.getenv('CURRENCY', 'eur')

# Modo mock cuando no hay claves de Stripe: permite probar sin dependencias externas
MOCK_MODE = not bool(STRIPE_SECRET_KEY)
if MOCK_MODE:
    print('Running in MOCK mode (no STRIPE_SECRET_KEY). Checkout sessions will be simulated.)')
else:
    stripe.api_key = STRIPE_SECRET_KEY

# Serve files from the repository root so paths like /styles.css and /script.js work
app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/config')
def get_config():
    return jsonify({ 'publishableKey': STRIPE_PUBLISHABLE_KEY or '' })

@app.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
    try:
        # If MOCK_MODE is enabled, return a fake session id so the front-end can continue without Stripe
        if MOCK_MODE:
            fake_id = 'mock_session_{}'.format(os.urandom(6).hex())
            return jsonify({'id': fake_id})

        # Crear sesión con dos ítems: el libro y los gastos de envío por ejemplar
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[
                {
                    'price_data': {
                        'currency': CURRENCY,
                        'product_data': {
                            'name': 'Bichas',
                            'description': 'Autor: Moises Muñoz Zapata',
                        },
                        'unit_amount': PRICE_CENTS,
                    },
                    'quantity': 1,
                },
                {
                    'price_data': {
                        'currency': CURRENCY,
                        'product_data': {
                            'name': 'Gastos de envío (CTT)',
                            'description': 'Gastos de envío por ejemplar',
                        },
                        'unit_amount': SHIPPING_CENTS,
                    },
                    'quantity': 1,
                }
            ],
            mode='payment',
            success_url=request.url_root + 'success',
            cancel_url=request.url_root + 'cancel',
        )
        return jsonify({'id': session.id})
    except Exception as e:
        return str(e), 400

@app.route('/success')
def success():
    return '<h2>Pago completado — ¡gracias!<br><a href="/">Volver</a></h2>'

@app.route('/cancel')
def cancel():
    return '<h2>Pago cancelado.<br><a href="/">Volver</a></h2>'

if __name__ == '__main__':
    # Run dev server
    app.run(host='127.0.0.1', port=5000, debug=True)
