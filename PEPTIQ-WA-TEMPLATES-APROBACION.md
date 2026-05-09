# PEPTIQ · Templates WhatsApp para aprobación en Meta

Estos 4 templates te dan capacidad completa de retargeting fuera de la ventana 24h. Costo: ~$0.05 USD por mensaje enviado · llega siempre.

**Cómo aprobarlos:**
1. business.facebook.com → WhatsApp Manager → Message Templates → Create Template
2. Categoría: **MARKETING** (para los 3 de retargeting) o **UTILITY** (para el de seguimiento)
3. Idioma: **Spanish (Mexico) — es_MX**
4. Pega el contenido de cada template tal cual
5. Submit · aprobación 24-48h
6. Cuando aprueben, agrega el nombre al array `PEPTIQ_TEMPLATES` en `admin/crm.html`

---

## 1️⃣ `peptiq_followup_warm` · MARKETING

**Categoría:** Marketing
**Idioma:** es_MX
**Header:** None
**Body:**
```
Hola {{1}}, soy SARA de PEPTIQ MX 👋

¿Sigue en pie tu interés en el protocolo que platicamos?

Esta semana tengo descuento Member -10% en todos los stacks Elite + COA Janoshik del lote vigente verificable en peptiqmx.com/verify

¿Quieres que te pase el catálogo otra vez o tienes alguna duda?
```
**Footer:** *Material exclusivo para investigación · responde STOP para no recibir más*
**Botones (opcional):** 
- Quick reply: *Sí, mándamelo*
- Quick reply: *Tengo dudas*
- Quick reply: *No me interesa*

**Variables:** `{{1}}` = primer nombre del lead

---

## 2️⃣ `peptiq_lanzamiento_oferta` · MARKETING

**Categoría:** Marketing
**Idioma:** es_MX
**Header:** None
**Body:**
```
{{1}}, último día de la oferta de lanzamiento PEPTIQ.

🔥 Código LANZA20 — descuento -20% en tu primer pedido
🚚 Envío 24-72h MX
🔬 COA Janoshik público por lote (único en MX)

Aplica a cualquier protocolo Elite. ¿Te lo cierro hoy?
```
**Footer:** *Compuestos exclusivos para investigación · STOP para baja*
**Botones:**
- URL: *Ver catálogo* → `https://peptiqmx.com/evaluacion`
- Quick reply: *Sí, lo cierro*

**Variables:** `{{1}}` = primer nombre

---

## 3️⃣ `peptiq_reengagement_cold` · MARKETING

**Categoría:** Marketing
**Idioma:** es_MX
**Header:** None
**Body:**
```
Hola {{1}}, hace tiempo no platicamos.

Acabamos de actualizar el inventario PEPTIQ con lotes nuevos · todos con COA Janoshik público verificable.

Si todavía estás investigando sobre {{2}}, te puedo pasar el catálogo técnico actualizado y un protocolo sugerido.

¿Te late?
```
**Footer:** *Material exclusivo para investigación · STOP para baja*
**Variables:**
- `{{1}}` = primer nombre
- `{{2}}` = objetivo o área de interés (ej: "longevidad", "recuperación", "estética")

---

## 4️⃣ `peptiq_post_evaluacion` · UTILITY

**Categoría:** Utility (porque es seguimiento de un lead que ya completó el quiz)
**Idioma:** es_MX
**Header:** None
**Body:**
```
{{1}}, vi que completaste tu evaluación PEPTIQ pero no terminaste de revisar el protocolo {{2}}.

Te dejo el link directo al catálogo + COAs del lote vigente:
{{3}}

Si quieres conversar con un specialist 1-on-1, responde aquí mismo.
```
**Footer:** *PEPTIQ MX · Investigación · Longevidad · México*
**Variables:**
- `{{1}}` = nombre
- `{{2}}` = stack/línea (ej: "TITAN Performance")
- `{{3}}` = URL del catálogo (ej: peptiqmx.com/catalogos/PEPTIQ-PRIME-Catalogo.pdf)

---

## 📋 Para registrarlos en el CRM (después de aprobación)

En `admin/crm.html` busca el array `PEPTIQ_TEMPLATES` y agrega:

```javascript
const PEPTIQ_TEMPLATES = [
  { name: 'reactivar_equipo', lang: 'es_MX', label: 'Reactivar conversación', params: ['nombre'], desc: '...' },
  // Nuevos:
  { name: 'peptiq_followup_warm', lang: 'es_MX', label: 'Follow-up Tibios',
    params: ['nombre'],
    desc: 'Hola {nombre}, soy SARA de PEPTIQ MX 👋 ¿Sigue en pie tu interés...'
  },
  { name: 'peptiq_lanzamiento_oferta', lang: 'es_MX', label: 'Oferta LANZA20',
    params: ['nombre'],
    desc: '{nombre}, último día de la oferta de lanzamiento PEPTIQ...'
  },
  { name: 'peptiq_reengagement_cold', lang: 'es_MX', label: 'Re-engagement Fríos',
    params: ['nombre', 'objetivo'],
    desc: 'Hola {nombre}, hace tiempo no platicamos. Acabamos de actualizar el inventario...'
  },
  { name: 'peptiq_post_evaluacion', lang: 'es_MX', label: 'Post-evaluación incompleta',
    params: ['nombre', 'stack', 'url_catalogo'],
    desc: '{nombre}, vi que completaste tu evaluación pero no revisaste {stack}...'
  },
];
```

---

## 💰 Costo estimado por campaña

| Segmento | ~Leads | Costo template (~$0.05/msg) |
|---|---|---|
| Hot | ~30 | ~$1.50 USD |
| Warm | ~80 | ~$4 USD |
| Cold | ~150 | ~$7.50 USD |
| **Mensual completo** | **260** | **~$13 USD** |

Si conviertes **1 stack TITAN ($14,999)** de los 260 = ROI 1100x sobre el costo.

---

## ⚠️ Reglas Meta para que aprueben

1. **NO mencionar precios específicos** en el cuerpo (solo "descuento" genérico)
2. **NO claims médicos** ("cura", "elimina dolor", "regenera")
3. **NO comparaciones** con marcas farmacéuticas (Ozempic, etc)
4. **SIEMPRE incluir** opt-out (footer "STOP para baja")
5. **Saludo personalizado** con `{{1}}` (primer nombre)
6. **Categoría MARKETING** para promo · **UTILITY** solo para confirmaciones/recordatorios de algo previo

Si te rechazan uno, ajusta el copy quitando lo que marquen y resubmit. Usualmente apruban en segundo intento.
