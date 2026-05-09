# PEPTIQ MX · Go-to-Market Strategy
**Última actualización:** 2026-05-09 (sesión Edson · pivot canales paid)
**Lanzamiento oficial:** 2026-04-20 (post-launch)
**Estado:** Funnel quiz → WA → SARA → Stripe operacional · CRM unificado · Meta restricted · Google atrapado en PMax · Pivot a Cold Email B2B + TikTok

---

## 🚦 Estado canales paid (2026-05-09)

| Canal | Estado | Bloqueo / Acción |
|-------|--------|------------------|
| Meta Ads | ❌ Restricted (ad account 32874886) | Apelación enviada · esperar 24-72h · NO se puede pautar |
| Google Ads | ⚠️  Cuenta nueva creada (ID 691-645-7743) · bono $7K MXN asignado · atrapada en wizard Performance Max | Pausar · necesita freelancer experto Google Ads MX para salir del wizard sin quemar lana en placements basura |
| TikTok Ads | 🟡 Pendiente crear cuenta | Setup limpio sin caja negra · más barato CPM · siguiente paso |
| Cold email B2B Resend | 🟢 LISTO · 255 clínicas con email confirmado | Disparar sequence 3-step esta semana |
| WhatsApp templates | ⚠️  Solo 4 leads warm reales (incluido Edson) · 256 cold son B2B sin WhatsApp | Sin volumen para mover aguja por WA |

**Realidad de la base SARA (auditada 9-may):** 261 leads totales · solo 5 con WhatsApp real · 255 son B2B email-only.

**Decisión sesión 9-may:**
1. Abandonar Google PMax (riesgo de quemar bonus en Display/YouTube basura)
2. Ejecutar Cold Email B2B 255 clínicas con sequence 3-step (HOY · costo $0)
3. Crear TikTok Ads cuenta limpia (mañana)
4. Meta Ads: solo cuando se reactive cuenta (apelación pendiente)

## 🎁 Activos producidos sesión 8-9 may

- **30 ads compliant** (10 originales + 5 masculinos + 10 beneficios B1-B10 + 5 niche C1-C5)
- **18 ads viejos rechazados** movidos a `/Users/end/Downloads/ads ig /_RECHAZADAS_META/`
- **10 ads V2 con HACK YOUR ___** generados en ChatGPT y verificados Meta-compliant
- **Sistema de 17 CTAs** "Hack Your [Hair/Skin/Strength/Sleep/Waist/Energy/Vitality/Mind/Recovery/Hormones/Healing/Comeback/Run/Burnout/Glow/Metabolism/Gut]"
- **Pixels instalados** en `/evaluacion` (GA4, Google Ads, Meta, TikTok) — placeholders listos para reemplazar
- **Launch pack** en `peptiqmx-design-review/launch-pack/`:
  - `01-google-ads-bulk-upload.csv` — 17 keywords + 36 headlines + 12 descriptions
  - `02-google-ads-negative-keywords.csv` — 30 negativas
  - `03-tiktok-ads-briefs.md` — 5 reels guionados
  - `04-meta-ads-mapping.md` — plan de 26 ads cuando se reactive
  - `05-utm-master-list.csv` — 24 URLs estandarizadas
- **Doc PIXEL-IDS-PENDIENTES.md** con 4 placeholders a reemplazar

---

## ✅ Construido en sesión 8-may (lo que YA funciona en producción)

### Funnel de captura
- **`peptiqmx.com/evaluacion`** — quiz 7 preguntas, 12 objetivos (longevidad, recovery, estética, cabello, bajar peso, grasa visceral, hipertrofia, libido, sueño, cognición, menopausia, gut). Single + multi-select + slider + back nav
- Backend `peptiq-quiz-submit` manda en paralelo:
  - WhatsApp texto personalizado (Meta API directo, no depende de SARA)
  - Catálogo PDF correcto según objetivo
  - Email Resend con HTML editorial
  - Lead push a SARA (cuando `SARA_API_KEY` esté en Netlify)
- **Verificado end-to-end** con número Edson 5610016226 — todo llega ✅

### CRM (`peptiqmx.com/admin/crm.html`) — 5 tabs
1. **Pedidos** (Stripe + manuales) — 29 órdenes test purgadas, queda solo Rodolfo Morelia
2. **Leads** — listado SARA tenant PEPTIQ
3. **📐 Calculadora** — backend Netlify Blob (no localStorage), con celular, fecha/hora, status envío, tracking, paquetería
4. **📦 Inventario** — stock unificado con alertas críticas, márgenes, capital invertido, potencial Elite
5. **🎯 Retargeting** — 6 segmentos automáticos (ready_to_buy / hot / warm / cold / test / buyers) + broadcast WhatsApp dual-mode (texto gratis 24h | template paga ~$0.05/msg)

### SARA AI mejoras (deploy en Cloudflare Worker)
- Comando `leads` (+ `leads hoy/semana/hot/sin responder`) para CEO/admin PEPTIQ
- Detección conversacional de catálogos como admin (igual que leads)
- Patrón ANSWER → BRIDGE → PITCH en prompt
- 6 objeciones con scripts (precio, miedo aguja, "lo pienso", autenticidad, garantía, COFEPRIS)
- Cierre fuerte obligatorio en última frase
- Verify links auto-inyectados peptiqmx.com/verify/[slug]
- Reorder detector ("se me acabó" → Stripe link directo)
- Upsell automático pre-pago (BPC → Wolverine PRO con savings concretos)
- Fotos editoriales del producto + audio en objeciones críticas
- Videos contextuales (reconstitución, brand, B2B)

### Endpoints SARA backend nuevos
- `POST /api/peptiq/register-admin` — registrar phones como CEO PEPTIQ
- `POST /api/peptiq/register-customer` — crear lead delivered + NPS automático
- `POST /api/peptiq/purge-test-orders` — limpieza de Web Customer / E2E
- `GET /api/peptiq/leads-segments` — 6 segmentos calculados
- `POST /api/peptiq/leads-broadcast` — broadcast texto/template con dryRun
- Edson registrado como CEO PEPTIQ (5610016226 + 2224558475)

### Página `/verify` (COA)
- 17 productos en catálogo + alias (wolverine, bb20, wolverine-pro, BP10, TB10, CU100, etc.)
- BB20 renombrado de "HEAL STACK" a "WOLVERINE"
- WOLVERINE PRO como stack independiente con links a 3 componentes
- Contraste corregido (vars `--green` y `--beige` arregladas)

### App PWA `/app`
- QR scanner del vial → autopopula inventario
- Botón "Verificar COA" en cada vial
- Cloud sync state via `/api/state-sync` (HMAC token con `PEPTIQ_STATE_SECRET`)
- Push notifications (VAPID — pendiente generar keys)
- Stats dashboard: racha, adherencia 30d, heatmap calendario
- Webhook Stripe → auto-popula inventario del cliente
- Functions Netlify: `peptiq-stripe-webhook`, `peptiq-inventory-get`, `peptiq-push-subscribe`, `peptiq-state-sync`, `peptiq-sales-manual`, `peptiq-sales-master`, `peptiq-quiz-submit`

### NFC card
- URL para la cajita (re-pedido directo): `https://wa.me/5214445770445?text=Quiero%20repedir%20mi%20protocolo%20PEPTIQ`
- QR HD generado: `~/Desktop/peptiq-wa-repedido-qr-HD.png`
- Foto perfil WhatsApp Business 640x640: `~/Desktop/peptiq-wa-profile-640.png`

### Documentos creados (carpeta repo)
- `META-ADS-COMPLIANT-2026.md` — 10 creativos con copy/prompts/checklist anti-rechazo
- `PEPTIQ-META-ADS-HIGGSFIELD.md` — 10 imágenes + 5 reels para Higgsfield
- `PEPTIQ-WA-TEMPLATES-APROBACION.md` — 4 templates listos para Meta (peptiq_followup_warm, peptiq_lanzamiento_oferta, peptiq_reengagement_cold, peptiq_post_evaluacion)
- `generate-meta-ads-2026.js` — script Replicate Flux con rate limiting

---

## ⚠️ Bloqueos / pendientes accionables (orden por ROI)

### 🔴 HOY (sin esto no entra ningún peso)

1. **Setear env vars Netlify** → https://app.netlify.com/projects/peptiqmx/configuration/env
   - `SARA_API_KEY = 06b7a620de2d15e496f076f1151005eaa9e2371561ee3fafe52a653a82fe7d40` (sin esto leads quiz no entran a CRM)
   - `STRIPE_WEBHOOK_SECRET = whsec_...` (de Stripe Dashboard → Developers → Webhooks)
   - `PEPTIQ_STATE_SECRET = openssl rand -hex 32` (cloud sync app)
   - VAPID keys (`VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`) — generar con `npx web-push generate-vapid-keys`

2. **Status cuenta Meta Business** — verificar si está restricted/banned en `business.facebook.com/settings/account-quality`. Sin esto no se puede pautar.

3. **Pixel ID Meta** — `business.facebook.com → Events Manager → Pixel ID` (16 dígitos). Inyectar en `/evaluacion` para tracking conversiones.

4. **Submit 4 templates WA** a Meta Business Manager (texts en `PEPTIQ-WA-TEMPLATES-APROBACION.md`). Aprobación 24-48h. Categoría MARKETING / es_MX. Sin esto retargeting cold no se puede.

### 🟡 ESTA SEMANA (creativos para campaña)

5. **Generar las 30 imágenes editoriales** — opciones:
   - **Higgsfield (recomendado)** — manual web, pegar 10 prompts del MD `PEPTIQ-META-ADS-HIGGSFIELD.md`. ~1h trabajo.
   - **ImageFX gratis** (`labs.google/fx/tools/image-fx`) — login Google, pegar prompts.
   - **Replicate** — necesita tarjeta agregada en `replicate.com/account/billing` (~$2-3 USD las 30). Script listo en `generate-meta-ads-2026.js`.
   - Solo se generaron 2/30 hasta ahora: `01-profesionales_1080x1350.png` y `10-logo-tagline_1080x1920.png`

6. **Producir 3 reels Higgsfield Video** (5seg cada uno × 3 clips) — para Reels/Stories Meta. Prompts listos en MD.

### 🟢 ARRANQUE CAMPAÑA META

7. **Audiencias Meta Ads:**
   - Top Funnel: 38-60 MX, intereses wellness/longevity/biohacking
   - Lead Gen: Lookalike 1% de quiz completers (cuando haya 100+)
   - Retargeting: visitas web 30d sin quiz

8. **Estructura sugerida** ($300/día arranque, ramp a $550/día):
   - Conjunto Awareness: $200 → top funnel, 4 imágenes statics
   - Conjunto Lead Gen: $250 → lead form Meta, 4 imágenes + 1 reel
   - Conjunto Retargeting: $100 → traffic, 2 imágenes story

9. **Objetivo de campaña: Lead Generation (NO Sales)** — apunta a `peptiqmx.com/evaluacion?utm_source=meta&utm_campaign=longevidad`

---

## 📊 KPIs · qué medir cada lunes
- CPL (target <$150 MXN) · Quiz completion >40% · Lead→sale 10% · AOV $7K+ · Re-order 60d 30%

## 📈 Proyección honesta
- **Mes 1:** $16K spend · 150 leads · 12 sales · $90K revenue · ROAS 5.6x
- **Mes 3:** $30K spend · 400 leads · 50 sales · $450K revenue · ROAS 15x

---

## ⚙️ Cómo arrancar mañana (60 min)
1. (10 min) Setear las 4 env vars Netlify críticas
2. (5 min) Submit 4 templates WA en Meta Business Manager
3. (45 min) Generar 5 imágenes Higgsfield prioritarias (01, 02, 04, 05, 10)
4. Lunes: lanzar conjunto Awareness $200/día con 4 imágenes
5. Martes: medir CPL · si <$200 → escalar a Lead Gen $250/día

---
---
*Sección original abril 2026 abajo (referencia histórica)*
---

**Estado original:** Brand live · 8+ posts · 5 carruseles · 9 historias listas · 386 leads B2B · 2,254 leads Nova

---

## Tesis estratégica

PEPTIQ es **DTC premium research-grade**. No vendemos como wellness genérico ni como Nova B2B. Diferenciador único en MX: **COA Janoshik por lote** (laboratorio independiente). Nadie más lo tiene.

Competencia GoutoGo et al = resellers genéricos sin trazabilidad. Nuestra ventaja: trust signal verificable + branding luxury.

---

## Los 6 canales · prioridad y peso

| # | Canal | Audiencia | ROI esperado | Status hoy |
|---|---|---|---|---|
| 1 | **TikTok Shop + TikTok orgánico** | DTC consumer 25-45 biohacker | ALTO (compra impulse) | **NO ARRANCADO** |
| 2 | **Cold email B2B** | Clínicas estética/peso/anti-aging | MEDIO (ticket alto recurrente) | 20 drafts listos, 366 pendientes |
| 3 | **Instagram orgánico** | Awareness DTC + B2B | MEDIO (long-game) | 8 posts + 5 carruseles activos |
| 4 | **WhatsApp blast** | Lista B2B Nova + interesados | ALTO MX | NO ejecutado, lista existe |
| 5 | **Meta Ads (FB+IG)** | Retargeting site visitors + lookalikes | ALTO con budget | NO arrancado |
| 6 | **SEO + Blog peptiqmx.com** | Long-tail "péptidos research grade México" | LARGO PLAZO | Sitio live, blog vacío |

---

## 1. TikTok Shop + TikTok Orgánico (PRIORITARIO — el gap más grande)

### Por qué es crítico
- TikTok Shop MX explotó 2025 — sellers wellness/supplements escalan a $200K+ MXN/mes
- Compra impulse + checkout in-app = conversion rate 3-5× superior a IG link-in-bio
- Algoritmo recompensa sellers nuevos primeros 30 días (boost orgánico)
- Pre-launch hype + scarcity drops = match perfecto para PEPTIQ luxury positioning

### Setup (semana 1)
1. **Cuenta TikTok Seller MX** — registro en seller.tiktok.com (RFC + datos fiscales). 24-48h verificación
2. **Catálogo:** 6 SKUs flagship (Wolverine, Highlander, Glow, Prime, Shred, Spa) — cada uno con video producto vertical 1080×1920 + foto pack-shot + COA visible
3. **Categorías:** "Wellness > Suplementos > Investigación" (importante: NO etiquetar como medicamento, eso te baja)
4. **Pricing TikTok Shop:** mismo de peptiqmx.com (NO descuento — premium positioning), pero ofrece **bundle/stack discounts** (-15% comprar 2)
5. **Cupón TT-LANZA20** primer pedido -20%
6. **Envíos:** integrar Estafeta/DHL via TikTok Shop fulfillment

### Contenido (semana 1-4 sostenido)
**3 videos/día** en @peptiqmx_mx TikTok (cuenta nueva, separada de IG):

| Tipo | Frecuencia | Duración |
|---|---|---|
| Educativo "qué es BPC-157" / "por qué COA importa" | 1/día | 45-60s |
| Lifestyle producto + ritual reconstitución | 1/día | 30s |
| Testimonial / social proof / behind-scenes | 1/día | 15-30s |

**Hooks que funcionan en péptidos TikTok 2026:**
- "El error que comete el 90% reconstituyendo péptidos"
- "POV: tu doctor te dijo que esto no existe en México"
- "Por qué este péptido cuesta $3,000 vs $300 en Amazon"
- "5 péptidos research-grade que cambian la conversación post-Ozempic"

### Creator partnerships (semana 2+)
- 5-10 micro-influencers MX (10K-100K) en biohacking/longevity/fitness
- Compensación: producto gratis + comisión 10-15% TikTok Shop
- Brief: educacional + COA visible + link al shop

### KPIs TikTok Shop (mes 1)
- 50K views totales
- 300 followers nuevos
- 30 ventas (conversion 0.06%)
- Ticket promedio $3,500 = $105K MXN revenue mes 1
- Mes 3 target: $300K MXN

---

## 2. Cold Email B2B (en ejecución)

### Lista
- **386 leads PEPTIQ-rebranded** en `outreach/peptiq-emails-clean.csv`
- Categorías: anti-aging (76), peso (61), spa médico (54), estética (49), nutriólogos (46), dermatología (46), péptidos directo (21)
- Top ciudades: CDMX 38, Tijuana 35, MTY 27, Los Cabos 26, Playa 24

### Templates
- 18 templates en `outreach/peptiq-emails-PREVIEW.md`
- Secuencia 3-step: Día 0 + Día 3 + Día 7
- Hooks Euromonitor abril 2026

### Sender domain (DECISIÓN PENDIENTE)
3 opciones — **ACCIÓN: tú decides cuál**

| Opción | Setup | Velocidad | Riesgo deliverability |
|---|---|---|---|
| **A.** edson@marketingtdi.com (actual) | 0 min | HOY | Medio (cross-brand) |
| **B.** Crear hello@peptiqmx.com en Workspace | 30 min | HOY | Bajo |
| **C.** Dominios secundarios + warming Instantly | 21 días | Día 21 | Mínimo |

### Plan ejecución (asume opción B aprobada)
- **Hoy:** 20 drafts Día 0 listos en Gmail (50 leads top — anti-aging + peso)
- **Día +1:** 50 más Día 0 (resto categorías)
- **Día +3:** Follow-up Step 2 a no-responders
- **Día +7:** Follow-up Step 3 final (last chance)
- **Throttle:** 30/día por sender para no quemar

### KPIs B2B (mes 1)
- 386 emails enviados
- Open rate target 35% = 135 abren
- Reply rate target 8% = 30 respuestas
- Sample requests target 15
- Conversiones a primer pedido target 5 = $50K-150K MXN (clínicas piden $10-30K stack inicial)

---

## 3. Instagram Orgánico (sostenido)

### Lo publicado
- 8 posts iniciales + 5 carruseles educativos (NO esteroides, NAD+, Wolverine, Mapa MX, Hipertrofia)
- Reglas guardadas en memoria: máx 5 slides por carrusel, mínimo 1 story diaria

### Plan abril–mayo
- **Carruseles:** 2/semana — temas educativos (péptidos por categoría, COA explainer, comparativas)
- **Posts simples:** 1/semana — drops, behind-scenes, testimonios
- **Reels:** 1/semana — Veo 3 (~$16/reel) cinematográficos · ya tenemos playbook
- **Stories:** mínimo 1/día (stack de 9 listo, rotar)
- **Highlights:** COA, Productos, Envíos, Stacks, FAQ (covers ya creados)

### KPIs IG (mes 1)
- Followers: 500 → 2,500
- Reach mensual: 100K
- DMs/inquiries: 50

---

## 4. WhatsApp (canal MX nativo — ALTO ROI)

### Activos existentes
- WhatsApp +52 444 577 0445 (compartido con Nova)
- Bot SARA architecture
- Lista `outreach/peptiq-whatsapp-clean.csv`

### Riesgo crítico
**Mass-blast no opt-in = ban en <1h.** WhatsApp Business prohíbe broadcasts a non-saved contacts.

### Plan seguro
1. **Semana 1:** click-to-WhatsApp en cada email + post + bio IG
2. **Bot setup:** flujo respuestas "Quiero info" → catálogo + COA + agenda asesoría
3. **Solo respuesta a inbound** primero, no outbound mass
4. **Semana 4+:** una vez con 200+ contactos opt-in, broadcast list segmentado

### KPIs WhatsApp (mes 1)
- 50 inbound chats
- 30 conversiones a venta
- Ticket promedio $2,500-5,000 MXN

---

## 5. Meta Ads (Facebook + Instagram)

### Setup (semana 2)
- Pixel peptiqmx.com instalado (verificar)
- Catálogo productos en Commerce Manager
- 3 audiencias:
  - **A.** Retargeting site visitors 30 días (warm)
  - **B.** Lookalike 1% de compradores (cuando tengamos 100+)
  - **C.** Interest stack: biohacking + longevity + Tim Ferriss + Andrew Huberman + Bryan Johnson

### Creative
- Reels Veo 3 ya producidos (Wolverine, Highlander, etc) → adaptar como ads
- Carruseles educativos → static ads
- UGC creators TikTok → reuse cross-platform

### Budget mes 1
- $200 USD/día = $6,000 USD/mes ($120,000 MXN)
- Split: 60% retargeting, 30% lookalike, 10% prospecting frío

### KPIs Meta Ads (mes 1)
- CPM target $250 MXN
- CTR target 2%
- ROAS target 2.5× = $300K MXN revenue

---

## 6. SEO + Blog peptiqmx.com

### Plan
- 4 artículos/mes, 1,500+ palabras cada uno, optimizados long-tail:
  - "BPC-157 en México: dónde comprarlo legal en 2026"
  - "Diferencia entre péptidos research-grade y compounded"
  - "Cómo leer un COA Janoshik (guía completa)"
  - "Stack post-Ozempic: por qué tu cuerpo necesita BPC-157"
- Schema markup (FAQ, Product, Article)
- Internal linking a productos
- Backlinks: outreach a 5 blogs longevity/biohacking MX

### KPIs SEO (mes 3+)
- 5K visitas orgánicas/mes
- 50 conversiones SEO/mes
- Posicionar "péptidos research grade México" página 1

---

## Timeline ejecutiva (semanas 1–8)

### Semana 1 (29 abr – 5 may)
- ✅ Carruseles #6-#10 publicados
- ⬜ Decidir sender email (A/B/C arriba)
- ⬜ Mandar 20 drafts Día 0
- ⬜ Crear cuenta TikTok Seller MX
- ⬜ Producir 9 videos TikTok (3/día sem 1)
- ⬜ Setup pixel Meta Ads + Commerce Manager
- ⬜ 1 story IG/día

### Semana 2 (6–12 may)
- ⬜ TikTok Shop live (catálogo 6 SKUs)
- ⬜ 50 más leads Día 0 + 20 Día 3 follow-up
- ⬜ Lanzar Meta Ads $200/día
- ⬜ 21 videos TikTok (3/día)
- ⬜ Outreach 5 micro-influencers TikTok
- ⬜ 1 carrusel + 1 reel + stories diarias IG

### Semana 3 (13–19 may)
- ⬜ Día 7 follow-up final 70 leads
- ⬜ 21 videos TikTok continuos
- ⬜ Primer creator drop TikTok
- ⬜ Blog: artículo #1 publicado
- ⬜ Empezar SEO outreach backlinks

### Semana 4 (20–26 may)
- ⬜ Lanzar Día 0 a siguientes 100 leads
- ⬜ Optimizar Meta Ads: pausar low-ROAS, escalar winning
- ⬜ Activar broadcast list WhatsApp (si tenemos 200 opt-ins)
- ⬜ Blog: artículo #2

### Semanas 5-8
- Sostener cadencia de publicación
- Escalar Meta Ads top winners
- Lanzar Día 0 al resto de los 386 leads
- Onboard 5+ creators TikTok recurrentes
- Mes 1 review: KPIs vs target → ajustar

---

## Budget mensual (mes 1) — todo en MXN

| Ítem | Costo |
|---|---|
| Meta Ads | $120,000 |
| TikTok Ads (refuerzo orgánico) | $40,000 |
| Producción TikTok videos (90 mes) | $30,000 |
| Veo 3 Reels (4-6 al mes) | $1,500 |
| Workspace Google (sender peptiqmx.com) | $300 |
| Mailtrack Pro (tracking emails) | $100 |
| Instantly.ai (cuando arranque dominios) | $1,500 |
| Creator partnerships (10 × $1,500 producto + comisión) | $15,000 |
| **TOTAL mes 1** | **$208,400 MXN** |

---

## Tracking centralizado (CRÍTICO)

### Single source of truth
**peptiqmx.com/admin/crm.html** — todo se trackea aquí.

### Per channel UTM convention
```
?utm_source=tiktok|email|ig|fb_ads|whatsapp|google
&utm_medium=organic|paid|cold_email|story|reel|carousel
&utm_campaign=launch_apr26|ozempic_2026|nad_longevity|...
&utm_content=lead_id_53|video_42|carousel_6|...
```

### Dashboards weekly review
- Google Analytics 4 → Acquisition by source
- TikTok Seller Center → conversion rate by SKU
- Meta Ads Manager → ROAS by ad set
- Gmail (Mailtrack) → open/reply rate by template
- WhatsApp Business → response time + conversion

### Decisión cada lunes
- Top 3 channels por ROAS → escalar budget +50%
- Bottom 1 → pausar/iterar
- Iterar templates con <20% open rate

---

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| TikTok ban categoría wellness/péptidos | Posicionar "research-grade investigación" + disclaimer + COA Janoshik visible |
| Sender domain quemado por cold email | Usar dominio secundario warming 14 días antes |
| Meta Ads low ROAS primer mes | Empezar conservador $100/día, escalar solo winners |
| Stockouts en SKUs hot | Forecast inventory mensual basado en TikTok Shop velocity |
| Competencia GoutoGo descuenta -50% | NO match price war. Doblar en COA + asesoría 1-on-1 + branding luxury |
| Bot WhatsApp ban por mass | Solo inbound primer mes, broadcast list opt-in semana 4+ |

---

## Decisiones que necesito de ti AHORA

1. **Sender email** A/B/C arriba — ¿cuál?
2. **TikTok Seller registro** — ¿lo abro yo via tu RFC o tú directamente?
3. **Budget mes 1 confirmado** $208K MXN aprobado o ajustamos?
4. **Producción videos TikTok** — ¿UGC creators o producción in-house tu equipo?
5. **Creators MX shortlist** — ¿tienes contactos o yo busco?

Confirma estos 5 y arranco mañana ejecución completa.
