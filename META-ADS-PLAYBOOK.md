# 🎯 PEPTIQ Meta Ads · Playbook lanzamiento (4 días)

## Setup · 1 hora HOY

### 1. Pixel + CAPI (10 min)
- Meta Business Suite → Eventos Manager → crear pixel para `peptiqmx.com`
- Instalar el script en `<head>` de todas las páginas
- Eventos a trackear: `PageView`, `Lead` (en /exclusive form), `Purchase` (Stripe webhook → CAPI)

### 2. 3 Campañas paralelas

#### Campaña A · "Biohackers fitness premium" · $50/día
- **Objetivo:** Conversiones (Lead)
- **Audiencia:**
  - Edad: 28-50
  - Ubicación: CDMX, GDL, MTY, Querétaro, Mérida
  - Intereses: Biohacking, Bryan Johnson, Andrew Huberman, Peter Attia, Tim Ferriss, Joe Rogan, Crossfit, Gold's Gym, Smart Fit, Sport City, Ironman, Ayuno intermitente, Suplementos deportivos, Whoop, Oura Ring, Eight Sleep
  - Comportamientos: Compradores premium online, viajes frecuentes, business decision makers
- **Lookalike:** crear 1% lookalike de tu lista de 357 leads ya cargada
- **Landing:** peptiqmx.com/exclusive (waitlist)
- **CTA:** "Solicitar acceso"

#### Campaña B · "Médicos / Clínicas B2B" · $60/día
- **Objetivo:** Conversiones (Lead)
- **Audiencia:**
  - Edad: 28-55
  - MX nacional
  - Cargos: Médico, Dermatólogo, Nutriólogo, Director Clínico, Owner Spa Médico
  - Intereses: Medicina estética, Medicina funcional, Anti-aging, GLP-1, Ozempic, Mounjaro, Aesthetic Pharma (competencia), MercadoLibre médicos
- **Landing:** peptiqmx.com/b2b-clinicas (tier B2B)
- **CTA:** "Ver tier B2B"

#### Campaña C · "Longevidad 50+" · $40/día
- **Objetivo:** Conversiones (Lead)
- **Audiencia:**
  - Edad: 50-70
  - CDMX, GDL, MTY zona pudiente
  - Intereses: Anti-aging, Longevidad, NAD+, Medicina regenerativa, David Sinclair, Lifespan, Oura, Whoop
  - Income proxy: Apple buyers, Tesla, gym premium membership
- **Landing:** peptiqmx.com/60-mas
- **CTA:** "Reporte gratuito"

**Total spend:** $150/día x 4 días = $600 USD ($12k MXN)

### 3. Creatives · 3 ads por campaña (rotar)

**Campaña A (biohackers):**
- Image 1: Hero highlander stack vials + texto "El protocolo de los próximos 20 años"
- Image 2: Foto biohacker premium midlife + "NAD+ cae 50% antes de los 50"
- Reel 15s: dropper de NAD+ slow-motion + voiceover técnico

**Campaña B (médicos):**
- Image: tabla de tiers B2B (-15/-25/-35%)
- Image: COA Janoshik con QR + "Único proveedor MX que publica COA por lote"
- Carrusel: 5 razones para integrar péptidos en tu clínica

**Campaña C (60+):**
- Image: pareja 60+ activa + "30% del gasto mundial lo generan ustedes"
- Image: stat hero "+133% growth wellness 60+ a 2040"
- Reel 30s: testimonial style médico explicando longevity protocol

### 4. Budget split por día
- $150 total = 50% audiencias frías + 50% retargeting (después del día 2)
- Día 1-2: aprendizaje (50% A, 30% B, 20% C)
- Día 3-4: shift a la que mejor convierta
- Si CPL > $300 MXN en una campaña → pausarla

## Targeting expandido (scraping IG / lookalikes)

### Cuentas competencia para scraping
- @aestheticpharmamx (followers son tu target médico)
- @xtlabs_mexico
- @singularbiotech
- @goutogo.mx
- @retatrutide.mx

### Cuentas relevantes a scrapear (custom audience)
- Gimnasios: @goldsgymmx, @smartfit_mx, @sportcity, @ironman_mx
- Influencers fitness MX: @yamiformx, @fer_lopez, @david_marchante (consulta lista)
- Clínicas premium: @cosmedicalclinic, @dermatologamx, @medicinaregenerativa
- Bryan Johnson MX, Sinclair MX en español

### Cómo scrapear (legal · usar API o tool)
1. **Phantombuster** (~$60/mes) → exporta followers de cualquier cuenta IG
2. **Apify Instagram Scraper** → followers + bio + tel/email si público
3. **HypeAuditor** → lista de IG users por edad/género/MX
4. **Meta Custom Audience** → upload CSV de teléfonos/emails → match audience

### Workflow propuesto
1. Scraping followers de @aestheticpharmamx (~10-20k followers MX)
2. Filter por bio que contenga "Dr.", "Dra.", "MD", "clínica", "spa"
3. Extract teléfonos públicos (~500-2000)
4. Upload a Meta Custom Audience
5. Crear lookalike 1% de esa custom audience
6. Targeting: biohackers + lookalike

## Whats next concretos · TÚ haces (necesito tu auth)

1. **Crear cuenta Meta Ads Manager** si no tienes (15 min)
2. **Cargar tarjeta** con $200 USD límite test
3. **Avísame cuando esté listo** → yo te paso ad copy + creatives en SVG/text
4. **Yo NO puedo** crear cuenta ni meter tarjeta por seguridad — eso lo haces tú
5. Una vez creada cuenta, podemos automatizar resto via API

## Alternativa rápida sin Meta Ads · DM masivo via Phantombuster

Si Meta Ads se siente largo:
1. Suscribir Phantombuster ($59/mes 20h)
2. Phantom: "Instagram DM Sender" o "Auto-DM-er"
3. Target: followers de @aestheticpharmamx
4. Mensaje DM: "Hola Dr/Dra · vimos que sigues a Aesthetic. PEPTIQ tiene tier B2B -25% con COA Janoshik público + crédito 15 días. ¿Te interesa el deck?"
5. Volume: 80-100 DMs/día (anti-spam Meta)
6. Esperado: 5-10% reply = 4-10 leads/día qualified

## Budget total semana

- Meta Ads: $600 USD ($12k MXN)
- Phantombuster: $60 USD
- Total: $660 USD = ~$13k MXN
- Si cierra UNA venta Highlander = ROI 1.1x en margen
- Si cierra UNA APEX TOTAL ($24,999) = ROI 2x en margen
