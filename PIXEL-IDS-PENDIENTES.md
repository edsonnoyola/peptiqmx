# 🎯 PIXEL IDs · Reemplazar cuando los tengas

Los pixels ya están instalados en `peptiqmx.com/evaluacion`. Solo hay que reemplazar 4 placeholders.

## 📍 Archivo a editar
`evaluacion/index.html`

## 🔄 Buscar y reemplazar (4 cambios)

### 1️⃣ Google Analytics 4 (GA4)
- **Buscar:** `GA_MEASUREMENT_ID` (aparece 2 veces)
- **Reemplazar con:** Tu Measurement ID de GA4 (formato: `G-XXXXXXXXXX`)
- **De dónde sale:** https://analytics.google.com → Admin → Streams → tu stream web

### 2️⃣ Google Ads Conversion
- **Buscar:** `AW-CONVERSION_ID/CONVERSION_LABEL`
- **Reemplazar con:** Tu conversion tag (formato: `AW-1234567890/AbC1DefGhIj`)
- **De dónde sale:**
  1. Google Ads → Tools → Conversions → click en tu conversion
  2. Tag setup → Use Google tag → copia el send_to value

### 3️⃣ Meta Pixel
- **Buscar:** `FB_PIXEL_ID` (aparece 3 veces)
- **Reemplazar con:** Tu Pixel ID (formato: 16 dígitos numéricos)
- **De dónde sale:** business.facebook.com → Events Manager → Pixel ID

### 4️⃣ TikTok Pixel
- **Buscar:** `TIKTOK_PIXEL_ID`
- **Reemplazar con:** Tu Pixel ID TikTok (formato: alfanumérico ~24 chars)
- **De dónde sale:** ads.tiktok.com → Assets → Events → Web Events → Pixel ID

## ✅ Verificar que funciona

Después de cada reemplazo + deploy:

1. **GA4:** abrir https://peptiqmx.com/evaluacion en Chrome incognito → en GA4 ver en "Realtime"
2. **Google Ads:** instalar [Tag Assistant](https://chrome.google.com/webstore/detail/tag-assistant-companion/) → ver fire en page load
3. **Meta:** instalar [Meta Pixel Helper](https://www.facebook.com/business/help/742478679120153) → ver PageView fire
4. **TikTok:** instalar [TikTok Pixel Helper](https://chrome.google.com/webstore/detail/tiktok-pixel-helper/) → ver Page

## 📊 Eventos disparados

Al cargar la página: **PageView**

Al completar el quiz:
- Meta Pixel: `Lead` (con value $500 MXN)
- Google Ads: `conversion` (con value $500 MXN)
- GA4: `generate_lead`
- TikTok: `SubmitForm`

Esto te permite ver exactamente cuántos leads viene de cada canal.

## 🌐 UTMs estándar para usar en cada ad

```
Meta Ads:
peptiqmx.com/evaluacion?utm_source=meta&utm_medium=cpc&utm_campaign={CAMPANA}&utm_content={AD_NAME}

Google Ads:
peptiqmx.com/evaluacion?utm_source=google&utm_medium=cpc&utm_campaign={CAMPANA}&utm_term={KEYWORD}

TikTok Ads:
peptiqmx.com/evaluacion?utm_source=tiktok&utm_medium=cpc&utm_campaign={CAMPANA}&utm_content={AD_NAME}

Email Resend:
peptiqmx.com/evaluacion?utm_source=email&utm_medium=newsletter&utm_campaign={CAMPANA}

WhatsApp blast:
peptiqmx.com/evaluacion?utm_source=whatsapp&utm_medium=template&utm_campaign={CAMPANA}

IG/TikTok orgánico (link in bio):
peptiqmx.com/evaluacion?utm_source=instagram&utm_medium=organic&utm_campaign=bio_link
```
