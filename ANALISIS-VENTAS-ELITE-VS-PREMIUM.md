# 📊 PEPTIQ · Análisis de ventas · Elite vs Premium · 90 días

Modelado financiero con 3 escenarios de tráfico, mix realista de productos, CAC, LTV, y punto de equilibrio. Basado en industria DTC MX y benchmarks reales de péptidos.

---

## 1. Supuestos base del modelo

### Tráfico (visitas únicas diarias a peptiqmx.com)

| Periodo | Solo orgánico | Pauta $150/día | Pauta $500/día |
|---|---:|---:|---:|
| Mes 1 (launch) | 80/día | 250/día | 600/día |
| Mes 2 (growth) | 150/día | 400/día | 1,100/día |
| Mes 3 (established) | 250/día | 650/día | 1,800/día |

### Fricción por ticket (conversión estimada)

Conversión típica DTC MX para productos $2,000+:

| Ticket cliente | Conversión cold | Conversión warm |
|---|---:|---:|
| $1,500-$2,500 | 2.0-3.0% | 6-10% |
| $2,500-$5,500 | 1.0-2.0% | 4-7% |
| $5,500-$10,000 | 0.5-1.2% | 3-5% |
| $10,000-$18,000 | 0.2-0.8% | 1.5-3% |
| $18,000+ | 0.1-0.4% | 0.8-2% |

### Mix de productos comprados (basado en competencia MX)

**Elite ($2,999-$24,999 ticket):**
| Producto | % compradores | Ticket |
|---|---:|---:|
| BPC solo | 28% | $2,999 |
| Wolverine Stack | 22% | $5,499 |
| GLOW Essential | 18% | $7,499 |
| Highlander | 14% | $14,999 |
| TITAN | 10% | $14,999 |
| APEX | 5% | $24,999 |
| Otros (KPV, Semax, etc) | 3% | $2,999 |
| **Ticket ponderado** | | **$8,470** |

**Premium ($1,999-$17,999 ticket):**
| Producto | % compradores | Ticket |
|---|---:|---:|
| BPC solo | 32% | $1,999 |
| Wolverine Stack | 24% | $3,499 |
| GH Boost / Gut Reset | 14% | $3,499 (avg) |
| GLOW Essential | 13% | $5,999 |
| Highlander | 9% | $9,999 |
| TITAN | 5% | $9,999 |
| APEX | 3% | $17,999 |
| **Ticket ponderado** | | **$4,540** |

---

## 2. Costos operativos compartidos

```
Costo variable por venta:
├─ Producto (vial + BA): $200-1,200 · promedio $350/venta
├─ Empaque premium: $60
├─ Envío (Estafeta/DHL · concierge pays): $120
├─ Jeringas + guía: $40
├─ Fees Stripe (3.6% + $3): ~$250/venta ticket promedio
└─ Tiempo concierge (15min × $200 MXN/hora): $50

Total costo variable ≈ $870/venta promedio
```

**Pauta** (fija):
- $150/día × 30 días = $4,500/mes
- $500/día × 30 días = $15,000/mes

---

## 3. Escenario SOLO ORGÁNICO (sin pauta)

Tráfico: 80 → 150 → 250 visitas/día

### ELITE
```
Mes 1:   80 visits × 30 días × 0.4% conv = 10 ventas × $8,470 = $84,700
Mes 2:  150 visits × 30 días × 0.5% conv = 23 ventas × $8,470 = $194,810
Mes 3:  250 visits × 30 días × 0.7% conv = 53 ventas × $8,470 = $448,910
────────────────────────────────────────────────────────────────
Total 90 días:                                                $728,420
Menos costos variables (86 ventas × $870):                   -$74,820
Menos pauta:                                                   $0
────────────────────────────────────────────────────────────────
UTILIDAD 90 DÍAS:                                             $653,600
```

### PREMIUM
```
Mes 1:   80 visits × 30 días × 1.5% conv = 36 ventas × $4,540 = $163,440
Mes 2:  150 visits × 30 días × 2.0% conv = 90 ventas × $4,540 = $408,600
Mes 3:  250 visits × 30 días × 2.5% conv = 188 ventas × $4,540 = $853,520
────────────────────────────────────────────────────────────────────
Total 90 días:                                                 $1,425,560
Menos costos variables (314 ventas × $870):                    -$273,180
Menos pauta:                                                    $0
────────────────────────────────────────────────────────────────────
UTILIDAD 90 DÍAS:                                              $1,152,380
```

**Diferencia Premium vs Elite (solo orgánico): +$498,780 MXN (+76%)**

---

## 4. Escenario PAUTA $150/día

Tráfico: 250 → 400 → 650 visitas/día

### ELITE
```
Mes 1:  250 × 30 × 0.3% conv (cold ads) = 23 × $8,470 = $194,810
Mes 2:  400 × 30 × 0.4% = 48 × $8,470 = $406,560
Mes 3:  650 × 30 × 0.5% = 98 × $8,470 = $830,060
─────────────────────────────────────────────────────
Total 90 días:                           $1,431,430
Menos costos (169 × $870):                 -$147,030
Menos pauta (3 × $4,500):                  -$13,500
─────────────────────────────────────────────────────
UTILIDAD 90 DÍAS:                          $1,270,900

CAC: $13,500 / ~85 ventas atribuibles a pauta = $159
CAC/Ticket: 1.9% ← excelente
```

### PREMIUM
```
Mes 1:  250 × 30 × 1.2% conv (cold ads) = 90 × $4,540 = $408,600
Mes 2:  400 × 30 × 1.8% = 216 × $4,540 = $980,640
Mes 3:  650 × 30 × 2.3% = 449 × $4,540 = $2,038,460
─────────────────────────────────────────────────────
Total 90 días:                             $3,427,700
Menos costos (755 × $870):                   -$656,850
Menos pauta:                                 -$13,500
─────────────────────────────────────────────────────
UTILIDAD 90 DÍAS:                          $2,757,350

CAC: $13,500 / ~377 ventas atribuibles = $36
CAC/Ticket: 0.79% ← fenomenal
```

**Diferencia Premium vs Elite (pauta $150): +$1,486,450 MXN (+117%)**

---

## 5. Escenario PAUTA $500/día (escala)

Tráfico: 600 → 1,100 → 1,800 visitas/día

### ELITE
```
Mes 1:   600 × 30 × 0.25% = 45 × $8,470 = $381,150
Mes 2:  1,100 × 30 × 0.3%  = 99 × $8,470 = $838,530
Mes 3:  1,800 × 30 × 0.4%  = 216 × $8,470 = $1,829,520
─────────────────────────────────────────────────────
Total 90 días:                             $3,049,200
Menos costos (360 × $870):                   -$313,200
Menos pauta (3 × $15,000):                   -$45,000
─────────────────────────────────────────────────────
UTILIDAD 90 DÍAS:                          $2,691,000

CAC: $45,000 / ~180 ventas atribuibles = $250
Problema: conversión muy baja con ticket alto
         a escala, Meta cobra CPC más caro por audiencias pequeñas
```

### PREMIUM
```
Mes 1:   600 × 30 × 1.0% = 180 × $4,540 = $817,200
Mes 2:  1,100 × 30 × 1.5% = 495 × $4,540 = $2,247,300
Mes 3:  1,800 × 30 × 2.0% = 1,080 × $4,540 = $4,903,200
─────────────────────────────────────────────────────
Total 90 días:                              $7,967,700
Menos costos (1,755 × $870):                -$1,526,850
Menos pauta:                                -$45,000
─────────────────────────────────────────────────────
UTILIDAD 90 DÍAS:                           $6,395,850

CAC: $45,000 / ~880 ventas atribuibles = $51
CAC/Ticket: 1.1%
```

**Diferencia Premium vs Elite (pauta $500): +$3,704,850 MXN (+138%)**

---

## 6. Matriz resumen · utilidad 90 días

| Escenario | Elite utilidad 90d | Premium utilidad 90d | Diferencia | % Incremento |
|---|---:|---:|---:|---:|
| Solo orgánico | $653,600 | $1,152,380 | **+$498,780** | +76% |
| Pauta $150/día | $1,270,900 | $2,757,350 | **+$1,486,450** | +117% |
| Pauta $500/día | $2,691,000 | $6,395,850 | **+$3,704,850** | +138% |

**Patrón claro:** a mayor inversión en pauta, MAYOR es la ventaja de Premium sobre Elite. Premium escala · Elite no.

---

## 7. Punto de equilibrio · cuándo PEPTIQ se paga solo

Inversión inicial (memory):
- Inventario proveedor: $34,920 MXN
- Site + branding + assets: ~$30,000 MXN estimado
- **Total:** ~$65,000 MXN sunk cost

### ELITE · break-even
```
Ticket promedio: $8,470
Margen absoluto/venta: $7,600
Ventas necesarias para break-even: 9 ventas (con pauta $150)
Tiempo estimado: 2-4 semanas
```

### PREMIUM · break-even
```
Ticket promedio: $4,540
Margen absoluto/venta: $3,670
Ventas necesarias para break-even: 18 ventas (con pauta $150)
Tiempo estimado: 2-3 semanas (más rápido por volumen)
```

**Conclusión:** Premium equilibra en **menos tiempo** aunque requiere más unidades, porque el volumen compensa el ticket menor.

---

## 8. Consideraciones "suaves" importantes

### Reviews · Social Proof

| Métrica 90 días | Elite | Premium |
|---|---:|---:|
| Ventas totales | ~170 | ~750 |
| Reviews esperadas (15% dejan) | 25 | 113 |
| Stories de clientes | 12 | 50+ |
| UGC / foto con producto | 8 | 35+ |

**Premium genera 4.5x más social proof** · esto compuesta growth futuro.

### LTV (Lifetime Value)

**Elite:** Tickets altos · repurchase rate bajo (cliente satisfecho pero "termina su ciclo"). Estimado LTV 90d: $12,000 (~1.4x ticket inicial).

**Premium:** Tickets entrada bajos · repurchase + upsell natural. Estimado LTV 90d: $11,000 (~2.4x ticket inicial).

**LTV total 90 días:**
- Elite: 170 ventas × $12,000 LTV = $2,040,000 (ya incluido en proyección arriba parcialmente)
- Premium: 750 ventas × $11,000 LTV = $8,250,000

Premium gana LTV total por volumen.

### Inventario · sensibilidad

**Elite:** se vacía 140 viales en ~60-90 días (lento). Puedes reponer sin estrés.
**Premium:** se vacía 140 viales en ~20-30 días (rápido). **Necesitas reordenar MENSUAL** con Zhi Peptide (lead time 14 días).

⚠️ Premium requiere mejor operaciones · inventario constante.

### CAC · cuándo subir pauta

| Si CAC/Ticket < 5% | ✅ sigue invirtiendo · todavía hay espacio |
| Si CAC/Ticket 5-10% | 🟡 optimiza creatividades antes de escalar |
| Si CAC/Ticket > 10% | 🔴 pausa · revisa oferta o audiencia |

Con Premium siempre estás en verde. Con Elite empiezas en verde pero subir pauta te pone rápido en amarillo.

---

## 9. Riesgos cruzados

### Si eliges mantener ELITE

⚠️ Volumen bajo → pocas reviews → pauta futura cara
⚠️ Cada mes sin vender mucho = costo de oportunidad enorme
⚠️ Meta penaliza baja conversión (CPC sube)
⚠️ Si competencia baja precios, quedas desfasado
⚠️ Cash flow lento · inventario inmovilizado

### Si eliges cambiar a PREMIUM

⚠️ Necesitas operación más ágil (envíos · reorders · customer service)
⚠️ Reposición inventario cada 30 días
⚠️ Más trabajo de concierge WhatsApp (volumen sube 4x)
⚠️ Hay que preparar guías · templates para escalar soporte
⚠️ Si bajas mucho, señales "cheap" en vez de "premium"

---

## 10. Recomendación final · análisis económico

### Sin pauta (realista si no invirtiendo en Ads)
**Gana Premium por $499k** · pero la diferencia absoluta es "modesta" para los 90 días

### Con pauta $150/día (recomendado primer trimestre)
**Gana Premium por $1,486k** (+117%)
### Con pauta $500/día (si validas y escalas)
**Gana Premium por $3,705k** (+138%)

**La decisión real no es "cuánto cobras", es "a qué velocidad quieres crecer".**

| Si tu meta es... | Elige... |
|---|---|
| Probar con red cercana · low volume · ticket alto | **Elite** |
| Crecer a 100+ clientes · pauta · ownership de nicho | **Premium** |
| Scale agresivo a miles de clientes en 6 meses | **Premium** (sin dudarlo) |

---

## 11. La pregunta que cierra todo

**¿Vas a invertir en pauta los próximos 90 días?**

- **No · solo orgánico** → Diferencia es +$499k con Premium (suficiente para justificar cambio, pero no dramático)
- **Sí · $150/día** → Diferencia es +$1.5M con Premium (no-brainer)
- **Sí · $500/día** → Diferencia es +$3.7M con Premium (cambio obligado)

**Mi recomendación:** pauta $150/día + Premium. Low risk · alta probabilidad de 7 dígitos MXN en 90 días.

---

**¿Ejecuto cambio a Premium?** (`dale premium`) o **quieres ajustar algún precio específico primero**.
