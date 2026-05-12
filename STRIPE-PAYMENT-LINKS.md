# 💳 PEPTIQ · Stripe Payment Links · Copy-Paste Ready

**Proceso para cada producto:** Stripe Dashboard → **Payment Links** → **+ New** → pega los campos de abajo → **Create link** → copia el URL `buy.stripe.com/...`

---

## CONFIG GLOBAL (aplicar a TODOS los links)

```
Currency:              MXN
Collect address:       ✅ Shipping address (México)
Collect phone number:  ✅
Custom fields:         ✅ "Nombre completo" (required)
After payment:         Redirect to → https://peptiqmx.com/gracias
Limit customers:       1 per link (opcional)
Automatic tax:         OFF (por ahora · activar cuando tengas RFC facturación)
Inventory:             Manual (no trackear en Stripe)
Promotion codes:       ✅ Permitir (para cupones launch)
Shipping:              Flat rate $200 MXN · nacional · Estafeta/DHL
                       O "Free shipping" si ticket > $5,000
```

---

## 🛒 LINK 1 · Wolverine (hero recuperación)

```
Product name:     PEPTIQ Wolverine — Stack Recuperación
Price:            $5,499.00 MXN
Description:      Stack de recuperación avanzado con BPC-157 + TB-500 
                  (Wolverine Blend 20mg) + agua bacteriostática. 
                  Protocolo 4 semanas. Research-use only. 
                  El uso de este producto es responsabilidad de 
                  quien lo use, solo para investigación.
Image:            img/ig/lineup-02-wolverine.png
SKU / ref:        PQ-WV-5499
```

---

## 🛒 LINK 2 · GLOW Essential (hero estética)

```
Product name:     PEPTIQ GLOW Essential — Anti-Aging Piel
Price:            $7,999.00 MXN
Description:      GLOW blend 70mg (BPC-157 + GHK-Cu + TB-500) + 
                  agua bacteriostática. Protocolo piel/anti-aging 
                  6 semanas. Research-use only. El uso de este 
                  producto es responsabilidad de quien lo use, 
                  solo para investigación.
Image:            img/ig/lineup-05-glow.png
SKU / ref:        PQ-GLW-7999
```

---

## 🛒 LINK 3 · Highlander (hero longevidad · alto margen)

```
Product name:     PEPTIQ Highlander — Longevidad Premium
Price:            $14,999.00 MXN
Description:      Stack longevidad máximo: NAD+ 1000mg + Epithalon 
                  50mg + GHK-Cu 100mg + 3× agua bacteriostática. 
                  Protocolo 12 semanas con concierge 1-on-1. 
                  Research-use only. El uso de este producto es 
                  responsabilidad de quien lo use, solo para 
                  investigación.
Image:            img/ig/lineup-03-highlander.png
SKU / ref:        PQ-HL-14999
```

---

## 🛒 LINK 4 · TITAN (hero performance)

```
Product name:     PEPTIQ TITAN — Performance GH Stack
Price:            $14,999.00 MXN
Description:      Stack GH completo: Tesamorelin 10mg + Ipamorelin 
                  10mg + NAD+ 1000mg + 3× agua bacteriostática. 
                  Protocolo performance/recomposición 12 semanas 
                  con concierge. Research-use only. El uso de este 
                  producto es responsabilidad de quien lo use, 
                  solo para investigación.
Image:            img/ig/lineup-04-prime.png
SKU / ref:        PQ-TT-14999
```

---

## 🛒 LINK 5 · GH Boost (entry price GH)

```
Product name:     PEPTIQ GH Boost — Performance Entry
Price:            $5,499.00 MXN
Description:      CJC-1295 + Ipamorelin 10mg + agua bacteriostática. 
                  Protocolo GH suave 4 semanas. Research-use only. 
                  El uso de este producto es responsabilidad de 
                  quien lo use, solo para investigación.
Image:            img/ig/lineup-04-prime.png
SKU / ref:        PQ-GHB-5499
```

---

## 🛒 LINK 6 · Gut Reset (nicho viral)

```
Product name:     PEPTIQ Gut Reset — Reparación Intestinal
Price:            $5,999.00 MXN
Description:      BPC-157 10mg + KPV 10mg + 2× agua bacteriostática. 
                  Protocolo reparación intestinal/anti-inflamatorio 
                  4 semanas. Research-use only. El uso de este 
                  producto es responsabilidad de quien lo use, 
                  solo para investigación.
Image:            img/ig/lineup-02-wolverine.png
SKU / ref:        PQ-GR-5999
```

---

## 🛒 LINK 7 · APEX TOTAL (statement VIP)

```
Product name:     PEPTIQ APEX TOTAL — Stack Máximo Premium
Price:            $24,999.00 MXN
Description:      El stack más completo: Retatrutide 30mg + 
                  Tesamorelin 10mg + NAD+ 1000mg + BPC-157 10mg + 
                  4× agua bacteriostática. Protocolo 16 semanas 
                  con concierge VIP + membership Elite. 
                  Research-use only. El uso de este producto es 
                  responsabilidad de quien lo use, solo para 
                  investigación. Producto off-menu — consulta 
                  por WhatsApp antes de comprar.
Image:            img/ig/lineup-01-cover.png
SKU / ref:        PQ-APEX-24999
```

---

## 🛒 LINK 8 · GLOW PRO (upsell glow)

```
Product name:     PEPTIQ GLOW PRO — Anti-Aging Avanzado
Price:            $9,999.00 MXN
Description:      GLOW blend 70mg + GHK-Cu 100mg + 2× agua 
                  bacteriostática. Protocolo anti-aging intensivo 
                  8 semanas. Research-use only. El uso de este 
                  producto es responsabilidad de quien lo use, 
                  solo para investigación.
Image:            img/ig/lineup-05-glow.png
SKU / ref:        PQ-GLW-9999
```

---

## 📋 Después de crear los 8 links

Pega las URLs aquí (yo las integro al sitio):

```
Wolverine      → https://buy.stripe.com/_____________
GLOW Essential → https://buy.stripe.com/_____________
Highlander     → https://buy.stripe.com/_____________
TITAN          → https://buy.stripe.com/_____________
GH Boost       → https://buy.stripe.com/_____________
Gut Reset      → https://buy.stripe.com/_____________
APEX TOTAL     → https://buy.stripe.com/_____________
GLOW PRO       → https://buy.stripe.com/_____________
```

---

## ⚠️ Off-menu (NO crear Payment Link · solo WhatsApp)

- **Shred** $12,999 — Retatrutide
- **Shred PRO** $14,999 — Retatrutide + Ipamorelin

Riesgo COFEPRIS sobre Retatrutide. Se venden bajo pedido vía WhatsApp privado.

---

## 🔒 Notas de seguridad Stripe

1. **Industry** debe ser `Scientific equipment & supplies` — NO pharma, NO supplements
2. **Descripciones** siempre terminan con `research-use only · no para consumo humano`
3. **Imágenes producto** no deben mostrar personas tomándose/inyectándose el péptido
4. Si Stripe pide verificación adicional: responder que es `laboratory reagent for research institutions`
5. Mantener chargeback rate <0.5% · política de devoluciones visible en el sitio
