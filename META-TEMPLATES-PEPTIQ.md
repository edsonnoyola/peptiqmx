# PEPTIQ MX · Meta WhatsApp Templates

## Por qué se necesitan templates
Meta WhatsApp Business API tiene la **regla de la ventana de 24 horas**:
- Mensajes libres SOLO se permiten dentro de las 24h después del último mensaje del usuario.
- Después de 24h hay que usar un **template aprobado por Meta** (HSM).
- Recordatorios diarios SIEMPRE caen fuera de esa ventana → templates obligatorios.

## Templates a registrar
Registrar en: https://business.facebook.com/wa/manage/message-templates/?waba_id=2377523032729367

---

### Template 1 · `peptiq_daily_reminder`
**Categoría**: UTILITY
**Idioma**: `es_MX`
**Header**: ⏰ PEPTIQ Tracker
**Body**:
```
Buen{{1}} {{2}} 👋

Tu próxima dosis está agendada:
🧬 {{3}}
💉 {{4}}
🕐 {{5}}
🍽️ {{6}}

¿Ya te la pusiste? Toca el botón.
```

**Variables**:
- `{{1}}` = "os días" / "as tardes" / "as noches" (dinámico por hora)
- `{{2}}` = nombre del usuario
- `{{3}}` = nombre del péptido (ej: "Tesamorelin")
- `{{4}}` = dosis (ej: "1mg subcutáneo")
- `{{5}}` = hora recomendada (ej: "10:00 PM")
- `{{6}}` = regla de ayuno (ej: "2h después de comer")

**Botones tipo `URL`**:
- "✅ Sí ya me la puse" → `https://peptiqmx.com/app/?dose-confirm={{user_id}}`
- "⏰ Posponer 30 min" → `https://peptiqmx.com/app/?snooze={{user_id}}`

**Footer**: ⚠ Research-grade · No sustituye consulta médica

---

### Template 2 · `peptiq_low_stock_alert`
**Categoría**: UTILITY
**Idioma**: `es_MX`
**Header**: ⏰ No rompas tu avance
**Body**:
```
Hola {{1}},

Te quedan ~{{2}} días de {{3}}.

Cortar el ciclo a mitad NO equivale a completarlo — los receptores se desensibilizan y tienes que reiniciar.

Pide hoy con código REPEAT15 (-15%) y recibe en 24-72h México.
```

**Variables**:
- `{{1}}` = nombre
- `{{2}}` = días restantes (numérico)
- `{{3}}` = péptido

**Botones**:
- URL: "🛒 Comprar ahora" → `https://peptiqmx.com/{linea}?utm_source=whatsapp&utm_medium=lowstock`
- Quick Reply: "💬 Pedir asesoría"

**Footer**: ⚠ Research-grade · For research use only

---

### Template 3 · `peptiq_dose_confirmed`
**Categoría**: UTILITY
**Body**:
```
✅ Dosis registrada · {{1}}

Día {{2}} de tu protocolo · adherencia {{3}}%
Descontamos 1 unidad de tu vial. Quedan ~{{4}} días.

Sigue así 💪
```

**Footer**: ⚠ Research-grade · El uso es responsabilidad personal

---

### Template 4 · `peptiq_streak_milestone`
**Categoría**: MARKETING (refuerzo positivo)
**Body**:
```
🔥 {{1}} días seguidos sin romper tu protocolo, {{2}}.

Esto es lo que separa a quien obtiene resultados de quien no.

Tu próximo hito: día {{3}} (cierre del ciclo on).
```

---

## Cómo registrar (manual · 5 min)
1. https://business.facebook.com/wa/manage/message-templates/
2. Cambiar a cuenta **PEPTIQ MX** (WABA ID `2377523032729367` o el que sea de PEPTIQ)
3. **Crear plantilla** → categoría UTILITY → idioma `es_MX`
4. Pegar header/body/footer/botones
5. Submit · aprobación Meta toma 1-24 horas

## Variables de entorno requeridas (Netlify production)
```
PEPTIQ_WA_PHONE_ID=<phone_number_id de +52 444 577 0445>
PEPTIQ_WA_TOKEN=<access token long-lived>
PEPTIQ_WA_TEMPLATE_REMINDER=peptiq_daily_reminder
PEPTIQ_WA_TEMPLATE_LOWSTOCK=peptiq_low_stock_alert
```

Token long-lived: https://developers.facebook.com/tools/explorer/
- App: PEPTIQ
- Permissions: `whatsapp_business_messaging`, `whatsapp_business_management`
- Generate token → convert to long-lived (60 days) o System User token (sin expiración)
