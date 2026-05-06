# 🔑 PEPTIQ · Cómo sacar cada API key

Pégame aquí **sólo las keys/tokens que vayas obteniendo** · yo integro cada uno en el checkout cuando lleguen. No tienen que estar todos listos al mismo tiempo.

---

## 🎯 Prioridad recomendada

1. ⭐ **Stripe** (acepta cards globales · MSI · Apple/Google Pay)
2. **Mercado Pago** (MSI nativo · OXXO · efectivo)
3. **PayPal** (internacional)
4. **Clip** (opcional · backup)

---

## 1️⃣ STRIPE · Secret Key (`sk_live_...`)

### Si YA tienes cuenta Stripe activa (Nova o cualquier otra)

```
1. Entra a dashboard.stripe.com
2. Esquina superior izquierda → asegúrate de estar en 
   modo ACTIVO (no en "Test mode" · switch arriba)
3. Menú izquierdo → click "Desarrolladores"
4. Sub-menú → click "Claves API"
5. En la sección "Claves estándar" verás:
   ├─ Clave publicable:   pk_live_...  (esta es pública, no me la pases)
   └─ Clave secreta:      sk_live_...  ← ESTA es la que necesito
6. Click "Revelar clave en vivo" → copia el string completo
   (empieza con sk_live_ y tiene ~107 caracteres)
```

⚠️ **CRÍTICO:** la secret key da acceso TOTAL a tu Stripe (refunds, lectura de clientes, cargos). Pégala en este chat únicamente — no la compartas en mensajes de WhatsApp ni emails ni subas a GitHub.

### Si NO tienes cuenta Stripe

- **Saltate este paso** por ahora · usa Opción A (Nova Stripe) o Mercado Pago
- Crear cuenta Stripe MX nueva correctamente requiere ~30 min (ver `STRIPE-PAYMENT-LINKS.md` del repo)

### Modo test (opcional · para probar primero sin cobrar real)

Mismo path pero pide la key que empieza con `sk_test_...`. Con esa integro y usamos tarjeta `4242 4242 4242 4242` para validar el flujo completo sin mover dinero real. Después cambiamos a `sk_live_` para producción.

---

## 2️⃣ MERCADO PAGO · Access Token (`APP_USR-...`)

### Si YA tienes cuenta MP (personal o de Nova)

```
1. Entra a mercadopago.com.mx → loguea
2. URL directo: mercadopago.com.mx/developers/panel/app
3. Si no tienes apps, click "Crear aplicación":
   ├─ Nombre: "PEPTIQ Checkout"
   ├─ Plataforma: "No uso Mercado Pago en ninguna plataforma"
   ├─ Modelo integración: "Pagos online"
   ├─ Producto: "Checkout Pro" (o "Checkout API")
   └─ Crear
4. Ya creada → click en tu aplicación
5. Menú izquierdo → "Credenciales de producción"
6. Copia el campo:
   ├─ Public Key:     APP_USR-xxxx-...  (pública)
   └─ Access Token:   APP_USR-xxxx-...  ← ESTE necesito
   (el Access Token es más largo · empieza con APP_USR-)
```

⚠️ El Access Token de producción requiere que la cuenta esté **verificada con INE + CLABE**. Si la cuenta apenas la creas, MP te pedirá completar identidad antes de darte producción. Mientras tanto puedes usar el Access Token de "Credenciales de prueba" para validar el flujo.

### Si NO tienes cuenta MP

Crear cuenta (15-20 min):
```
1. mercadopago.com.mx → "Abrir cuenta gratis"
2. Elige "Como persona" o "Como empresa" según decidas TDI vs personal
3. Email + contraseña + verificación celular (OTP SMS)
4. Datos: CURP, RFC (opcional al inicio), dirección
5. Conecta CLABE para que MP deposite tus ventas
6. Sube foto de INE (verificación en 24-48h)
7. Una vez activa → step 1-6 arriba para sacar Access Token
```

---

## 3️⃣ PAYPAL · Handle `paypal.me/tuusuario`

### Ruta fácil · PayPal.Me (link público sin código)

```
1. Entra a paypal.com/mx → loguea
2. URL directo: paypal.me
3. Si no tienes handle, te pide crear uno:
   ├─ ej: paypal.me/peptiqmx
   ├─ ej: paypal.me/edsonnoyola
   └─ Guarda
4. Me pasas solo el link completo:
   https://paypal.me/TUUSUARIO
```

**Ventaja:** zero API · funciona en 5 min.
**Desventaja:** el cliente elige el monto manualmente al pagar.

### Ruta PRO · PayPal API (opcional después)

Para checkout 100% automatizado con monto fijo pre-poblado:
```
1. developer.paypal.com/dashboard/applications
2. Crea REST API app
3. Copia Client ID + Secret
(Esto lo dejamos para después · la Ruta fácil ya cubre el caso)
```

### Si NO tienes cuenta PayPal

Crear cuenta personal o business (~15 min):
```
1. paypal.com/mx/webapps/mpp/account-selection
2. Elige "Cuenta Comercial" para PEPTIQ
3. Email + contraseña
4. Verifica correo
5. Agrega cuenta bancaria (CLABE) — verificación 3-5 días con depósitos micro
6. Una vez confirmada → crea paypal.me handle
```

---

## 4️⃣ CLIP · API Token (opcional · MX local)

Clip MX ofrece Link de Pago estilo Stripe/MP pero con soporte a terminales físicas también.

```
1. Entra a app.clip.mx → loguea (o crea cuenta si no tienes)
2. Menú "Integraciones" o "Desarrolladores"
3. Genera API Key (API key secret)
4. Me la pasas
```

⚠️ Clip requiere verificación con INE + CLABE · 24-48h aprobación.

---

## 🧪 Webhooks · qué voy a configurar cuando me pases las keys

Para cada procesador integrado, yo seteo automáticamente:

```
✅ Endpoint webhook en el backend (sara-backend.edson-633.workers.dev)
✅ Evento "payment.succeeded" → guarda pedido en Supabase + manda WA
✅ Evento "payment.failed" → notifica al concierge
✅ Evento "refund.created" → actualiza estado pedido
```

Tú NO tienes que hacer nada de webhooks · yo me encargo una vez tenga la key.

---

## 📋 Formato para mandarme las keys

Cuando tengas aunque sea UNA, pégala así aquí:

```
STRIPE: sk_live_51N...........................
MP: APP_USR-........................-........
PAYPAL: https://paypal.me/peptiqmx
CLIP: ...
```

No necesitas pegarlas todas a la vez — según vayan saliendo.

---

## 🎬 Qué hago cuando reciba cada una

| Paso | Stripe | MP | PayPal | Clip |
|---|---|---|---|---|
| Crear productos en la cuenta | ✅ vía API | ✅ vía API | N/A | ✅ vía API |
| Generar checkout URL | ✅ Payment Link | ✅ Preference | Link directo | ✅ Link de pago |
| Pegar URLs en /checkout.html | ✅ | ✅ | ✅ | ✅ |
| Configurar webhook | ✅ | ✅ | ✅ (IPN) | ✅ |
| Test con tarjeta | ✅ 4242... | ✅ APRO... | ✅ sandbox | ✅ test card |
| Deploy prod | ✅ | ✅ | ✅ | ✅ |
| **ETA** | **15 min** | **15 min** | **5 min** | **15 min** |

---

## 🔒 Seguridad · reglas

- **NUNCA** subas keys a GitHub (yo no lo hago tampoco)
- Keys viven en variables de entorno del backend Cloudflare · no en código frontend
- Si crees que una key se filtró, **regenera** desde el dashboard (rota en 30 seg)
- Para el checkout frontend solo expongo la **publishable key** (pk_live), NO la secret
- Yo guardo las secret keys únicamente en la conversación activa · no persisten después

---

## 🆘 Si te atoras en algún step

Screenshot + dime exactamente dónde. Yo te guío visual.