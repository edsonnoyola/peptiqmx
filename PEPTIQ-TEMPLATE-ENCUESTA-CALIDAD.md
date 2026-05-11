# PEPTIQ · Template Encuesta Calidad post-entrega

**Nombre técnico:** `peptiq_encuesta_calidad_v1`
**Categoría:** UTILITY
**Idioma:** es_MX
**Objetivo:** medir satisfacción post-entrega · 3 preguntas máximo · alta tasa respuesta

---

## Contenido para pegar en Meta Business Manager

### Header
None (sin imagen ni video)

### Body
```
{{1}}, soy SARA de PEPTIQ MX 🧬

Vimos que tu paquete ya fue entregado. Para mejorar queremos hacerte solo 3 preguntas rápidas:

1️⃣ ¿Llegó todo completo y en buen estado?
2️⃣ ¿Cómo calificas el tiempo de envío (1-5)?
3️⃣ ¿Tienes dudas sobre reconstitución o protocolo?

Tu respuesta nos toma 30 segundos y nos ayuda muchísimo.
```

### Sample (ejemplo Meta lo pide)
- `{{1}}` = Rodolfo

### Footer
```
PEPTIQ Research · Material exclusivo para investigación
```

### Botones · Quick Reply
1. `✅ Todo bien`
2. `📦 Hubo un problema`
3. `🧬 Tengo dudas`

---

## Cómo aprobarlo

1. business.facebook.com → WhatsApp Manager → Message Templates
2. Cuenta: **Peptiq Research** (la de PEPTIQ MX, no Santa Rita)
3. Create template → Utility → Spanish (Mexico)
4. Pega body + footer + botones tal cual
5. Submit · aprueba 1-24h

---

## Una vez aprobado · registro en CRM

En `admin/crm.html` línea 615, agregar al array `PEPTIQ_TEMPLATES`:

```javascript
{ name: 'peptiq_encuesta_calidad_v1', lang: 'es_MX',
  label: 'Encuesta calidad post-entrega',
  params: ['nombre'],
  desc: 'Encuesta 3 preguntas post-entrega · Quick replies' },
```

---

## Cómo enviarlo a Rodolfo (cuando esté aprobado)

```bash
curl -X POST "https://graph.facebook.com/v22.0/<PEPTIQ_WA_PHONE_ID>/messages" \
  -H "Authorization: Bearer <PEPTIQ_WA_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "5213328388675",
    "type": "template",
    "template": {
      "name": "peptiq_encuesta_calidad_v1",
      "language": { "code": "es_MX" },
      "components": [
        {
          "type": "body",
          "parameters": [{ "type": "text", "text": "Rodolfo" }]
        }
      ]
    }
  }'
```

---

## ⚠️ Reglas Meta para aprobación

- ✅ Categoría UTILITY · es transacción confirmada (delivered) · pasa fácil
- ✅ Sin claims médicos ("regenera", "cura")
- ✅ Sin precios específicos
- ✅ Footer con identificación clara
- ⚠️ Quick replies no requieren URL ni dynamic params · son strings fijos
