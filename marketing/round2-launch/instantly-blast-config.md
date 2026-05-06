# INSTANTLY.AI BLAST CONFIG · ROUND 2 LAUNCH

**Lista:** 374 leads Nova B2B + 300 cold templates
**Total:** 674 contactos
**Modelo:** A/B/C 3-arm con drip secuencial 8 días

---

## CAMPAIGN STRUCTURE

### Day 1 — Initial split (50/50)
- **374 Nova leads** → Version A (Authority play)
- **300 cold templates** → Version B (Pain-point play)

### Day 4 — Re-targeting (no-respondedores)
- A no-respondedores → Version C (Curiosity play)
- B no-respondedores → Version A
- Email subject: "Re: {{previous_subject}}"

### Day 8 — Bump
- Versión corta de un solo párrafo:
  ```
  Hola {{first_name}},

  ¿Llegó el email del programa B2B PEPTIQ? Si te interesa pero quedó en pendientes, te dejo de nuevo el WhatsApp directo:

  +52 444 577 0445

  15 min y te explico todo. Sin presión.

  — Equipo PEPTIQ MX
  ```

---

## VERSION A — Authority Play (Euromonitor stats)

**Subject lines (rotate 3 al azar):**
- Euromonitor abril 2026: tus pacientes ya están pidiendo esto
- +$6.7B USD en H&W para 2040 — y México apenas tiene un proveedor que cumpla
- {{first_name}}, los datos de Euromonitor explican lo que ya estás viendo en consulta

**Preview text:** "+$6.7B en H&W para 2040, 30% paga 20% premium por endorsement médico. Aquí lo que sí cumple el estándar."

**Body:** [Ver press-release.md o stories-euromonitor.md sección Story #1]

**CTA:** Agenda 15 min con specialist via WhatsApp

---

## VERSION B — Pain-point Play (peso + GLP-1)

**Subject lines:**
- 17% de tus pacientes son obesos clínicos. ¿Tienes el catálogo de péptidos que usan en NYC?
- Tirzepatide research-grade en México (con COA, factura, concierge)
- {{first_name}}, ¿tus pacientes ya te están preguntando por Mounjaro?

**Preview text:** "Tirzepatide research-grade, GHK-Cu, NAD+, Tesamorelin... sin importadores grises. COA Janoshik público."

**CTA:** Demo 15 min via WhatsApp

---

## VERSION C — Curiosity Play (gateway)

**Subject lines:**
- Lo que L'Oréal compró por $300M y aún no llega a México
- Eli Lilly se volvió la farma más valiosa del mundo. Aquí lo que está adentro.
- 87 SKUs de neuropeptides crecieron 8.4% CAGR. ¿Tienes acceso?

**Preview text:** "Mitochondrial peptides para piel, GLP-1 dual para peso, neuropéptidos para foco — el catálogo completo, en MX, con COA público."

**CTA:** Ver catálogo peptiqmx.com + WhatsApp

---

## SETTINGS INSTANTLY.AI

```yaml
campaign_name: PEPTIQ Round 2 — Launch B2B Q2 2026
sending_account: edson@peptiqmx.com (rotate con info@peptiqmx.com si está)
daily_send_limit: 80 emails/account/day (warm-up gradual: 30 → 80 over 7 days)
schedule:
  timezone: America/Mexico_City
  send_window: 09:00 - 18:00
  business_days_only: true
tracking:
  open_tracking: ON
  click_tracking: ON
  reply_detection: ON
  unsubscribe_link: required (footer)
sequence:
  step_1: Day 0 (initial)
  step_2: Day 4 (if no_open AND no_reply)
  step_3: Day 8 (if still no_reply)
  step_4: Day 14 (final manual review — no automated send)
attachments: NONE (avoid spam filters)
```

---

## MÉTRICAS DE ÉXITO (medir Day 14)

| Métrica | Target | Calidad |
|---|---|---|
| Open rate (paso 1) | >35% | Email reputation OK |
| Click rate (CTA) | >5% | Subject + body alineados |
| Reply rate | >2% | Mensaje resonó |
| Reply qualifying (interés real) | >0.5% | =3-5 leads cualificados de la lista |
| Demo booked | >10 demos en 14 días | Conversión funnel sano |
| WhatsApp opened | >30 conversaciones | CTA potente |

Si reply rate <1%, pausar campaña y revisar segmentación + subject lines.

---

## FOLLOW-UP ON RESPONDERS

Cuando alguien responde:
1. Mover a Pipeline "B2B Demo Booking"
2. Specialist responde manualmente <2h en horario laboral
3. Agendar demo 15 min Calendly (link: calendly.com/peptiqmx-b2b-demo)
4. Post-demo: enviar catálogo PDF + COA muestra + propuesta tier B2B
5. Follow-up 48h post-demo si no commit

---

## SAMPLE FOOTER LEGAL (todos los emails)

```
---
PEPTIQ MX · Hack Your Limits
peptiqmx.com · WhatsApp +52 444 577 0445

Productos research-grade · for research use only.
No aprobados por COFEPRIS para uso humano. No son medicamentos.

Si no quieres recibir más comunicaciones, [unsubscribe aquí].
Equipo PEPTIQ MX · CDMX, México
```
