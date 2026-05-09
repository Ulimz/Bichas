# Sitio demo para vender un libro

Este directorio contiene un sitio sencillo (HTML/CSS/JS) y un servidor Flask mínimo que crea sesiones de Stripe Checkout en modo prueba.

Requisitos
- Python 3.8+
- Claves de Stripe (modo prueba)

Archivos principales
- `index.html` - página de producto en español
- `styles.css`, `script.js` - front-end
- `server.py` - servidor Flask que expone `/config` y `/create-checkout-session`
- `requirements.txt` - dependencias Python
- `.env.example` - ejemplo de variables de entorno

Configuración (Windows PowerShell)

1) Crear y activar entorno virtual

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

2) Instalar dependencias

```powershell
pip install -r requirements.txt
```

3) Crear un archivo `.env` en esta carpeta (`website/.env`) y añadir las claves de Stripe (modo prueba). Puedes copiar `.env.example` y reemplazar valores.

4) Ejecutar el servidor

```powershell
python server.py
```

5) Abrir en el navegador

http://127.0.0.1:5000

Notas
- Este ejemplo usa Stripe en modo prueba. Para recibir pagos reales necesitas configurar claves en modo producción y revisar seguridad, HTTPS y cumplimiento de PCI.
- Si prefieres PayPal, puedo adaptar el backend más tarde.

Personalización rápida
- Cambia el título, autor, descripción y el precio editando `index.html` y la variable `PRICE_CENTS` en el archivo `.env`.
