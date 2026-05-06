# 🚀 PEPTIQ MX · Launch Runbook · 3-may-2026

## Estado actual del sistema

### ✅ Listo y deployed
- **App PEPTIQ Tracker** v1.9 · `peptiqmx.com/app/`
- **13 carruseles IG** publicados @peptiqmx
- **Stories cron activo** · 4 stories día 1 publicadas + 45 programadas días 2-14
- **3 templates WhatsApp** PENDING aprobación Meta
- **Sistema legal** v1.5 · Netlify Blobs + e-signature
- **49 stories** con 27 lifestyle photos rotando

### 📦 Lanzamiento email blast (este runbook)
- **218 leads únicos** con email actionable (Supabase Nova tenant)
- **18 templates rebrandeados** PEPTIQ MX (6 categorías × 3 steps)
- **Disclaimer legal** auto-añadido a cada body

---

## Distribución leads por categoría

| Categoría | Leads | Template a usar |
|---|---|---|
| Medicina General | 67 | `medicina_general.csv` → templates `peso` o `spa_medico` |
| Otros | 93 | `otros.csv` → templates `peso` (default amplio) |
| Nutriólogos | 24 | `nutriologos.csv` → `templates-nutriologos/` |
| Bariátrica | 18 | `bariatrica.csv` → `templates-peso/` |
| Dermatología | 15 | `dermatologia.csv` → `templates-dermatologia/` |
| Medicina Estética | 1 | `estetica.csv` → `templates-estetica/` |

---

## Pasos para activar Instantly.ai (15 min)

### 1. Login Instantly
https://app.instantly.ai/

### 2. Subir cada CSV como Lista
- Lists → New List
- Nombre: "PEPTIQ Cold · {categoría} · 3-may-2026"
- Upload CSV de `marketing/launch-may3/instantly-{cat}.csv`
- Map fields: email → email · first_name → first_name · custom: ciudad, name

### 3. Crear Campaign por categoría
**Plantilla**: 3 emails con delays 0d, 3d, 7d (dripping orgánico)

Por cada categoría:
- Campaigns → New Campaign
- Connect List
- Email Step 1 (Day 0): pegar `templates-{cat}/step-1-day0.txt`
- Email Step 2 (Day 3): pegar `step-2-day3.txt`
- Email Step 3 (Day 7): pegar `step-3-day7.txt`
- Schedule: 9am-6pm MX · solo lun-vie · 30 emails/día max por mailbox

### 4. Verificar IMAP/SMTP en Instantly
Settings → Email Accounts → asegurar 2-3 cuentas warm-up:
- edson@marketingtdi.com
- ventas@peptiqmx.com (crear si no existe)
- info@peptiqmx.com (crear si no existe)

Cada cuenta empieza con 20 emails/día y escala. **Total ~60 emails/día** = 218 leads ÷ 60 = ~4 días para enviar todo el primer paso.

### 5. Activar campañas
Toggle Active en cada campaign · monitor reply rate diario.

---

## ⚙️ Auto-tracking que YA está armado

- **UTMs en cada link** del email body: `?utm_source=instantly&utm_medium=email&utm_campaign={cat}`
- **Pixel Meta + GA4** ya en `peptiqmx.com` capturan conversiones
- **SARA backend** detecta replies a WhatsApp `+52 444 577 0445` y mete el lead a CRM PEPTIQ tenant
- **Visit tracker** en cada landing log a Netlify Blobs `peptiq-legal/visit/`

---

## 🎯 Goals primer 7 días

| Métrica | Target |
|---|---|
| Open rate | >35% |
| Reply rate | >5% (~11 respuestas) |
| WhatsApp inbound | >15 |
| Visitas landing | >150 (UTM email) |
| **Primera venta** | **1** (validation) |

---

## 🔗 Stack publicación coordinado próximos 14 días

### Día 1 (HOY · sáb 3-may)
- ✅ 4 stories ya publicadas (cron auto las días 2-14)
- 🎬 19:00 MX → **Reel Wolverine** (script en REELS-SCRIPTS.md)
- 📧 09:00 MX → Activar Instantly campaign Nutriólogos (24 leads)

### Día 2 (dom 4-may)
- 🎬 19:00 → Reel Highlander
- 📧 09:00 → Activar Bariátrica (18 leads)

### Día 3 (lun 5-may)
- 🎬 19:00 → Reel Glow
- 📧 09:00 → Activar Dermatología (15) + Estética (1)

### Día 4-7
- 🎬 19:00 → 1 reel/día (Prime · Shred · Spa · Menopausia)
- 📧 step 2 follow-ups (auto via Instantly)

### Día 8-13
- 🎬 19:00 → reels condition (Sueño · Cabello · Cerebro · Función Sexual · Grasa Visceral · 60+)
- 📧 step 3 closers + activar Medicina General (67) + Otros (93) en lotes

---

## 📊 Daily monitoring checklist

```bash
# Ver stories cron health
netlify logs:function peptiq-stories-cron

# Ver visits del día
netlify blobs:list peptiq-legal --prefix="$(date -u +%Y-%m-%d)/visit/"

# Reply rate Instantly
# Login app.instantly.ai → Dashboard → Last 7 days

# IG insights manual
business.facebook.com/latest/insights
```

---

## 🚨 Si una venta cierra

1. SARA auto registra lead en Supabase tenant peptiq
2. Lead recibe sequence post-compra (ya configurada en `peptiqEmailSequence.ts`)
3. Tracking en `peptiq-legal` con `record_type:cta_click`
4. Manual: marcar lead como "won" en CRM admin · post a slack/whatsapp interno

---

## 📝 Pendiente que NO depende de mí

- [ ] User: subir CSVs a Instantly + activar campañas (15 min)
- [ ] User: producir 13 reels en Descript (10 min c/u · 130 min total) — scripts en `REELS-SCRIPTS.md`
- [ ] User: aprobación Meta de los 3 templates WhatsApp (1-24h, ya enviados)
- [ ] User: confirmar al primer cliente real para validation
