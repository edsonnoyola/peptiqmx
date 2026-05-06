# 📱 PEPTIQ · WhatsApp Template para Blast Nova Leads

## Template sugerido (requiere aprobación Meta Business)

### Nombre interno
`peptiq_lanzamiento_b2b_v1`

### Idioma
`es_MX`

### Categoría
`MARKETING`

### Header (Text)
```
🧬 PEPTIQ MX · Research-Grade Peptides
```

### Body
```
Dr./Dra. {{1}},

Soy del equipo PEPTIQ MX. Distribuimos péptidos research-grade con COA Janoshik público por lote (99%+ HPLC) — único proveedor con esto en México.

Varias clínicas de {{2}} en {{3}} ya los integran en sus protocolos:

• BPC-157 10mg — $2,999
• GHK-Cu 100mg — $3,799
• Wolverine Stack (BPC+TB) — $5,499

🎁 Código LANZA20 = -20% en primer pedido (válido 7 días).

¿Le mando catálogo PDF con COAs?
```

### Parámetros dinámicos
```
{{1}} = first_name del lead (ej. "Dr. Juan")
{{2}} = categoría (ej. "Medicina Estética", "Dermatología")
{{3}} = ciudad (ej. "Monterrey", "CDMX")
```

### Buttons (Quick Reply · 2)
```
1. "Mandar catálogo"
2. "Ya no gracias"
```

---

## Cómo aprobarla en Meta

1. Ir a Meta Business Manager → WhatsApp → Message Templates
2. Create Template
3. Pegar los datos arriba
4. Submit for review
5. Meta aprueba en 1-24h típicamente

**URL directa:** business.facebook.com/wa/manage/message-templates/?waba_id=2377523032729367

---

## Template actualmente aprobado (como fallback si tardan)

En Meta ya hay APPROVED:
- `nova_recuperacion` · con imagen
- `nova_longevidad`
- `nova_performance`
- `nova_belleza`
- `nova_catalogo`
- `catalogo_recuperacion`
- `catalogo_longevidad`
- `catalogo_performance`
- `bienvenida_nova`
- `seguimiento_nova`
- `promo_nova`
- `reactivar_nova`

**IDEA:** mientras Meta aprueba `peptiq_lanzamiento_b2b_v1`, podemos usar `promo_nova` rebranded en el body text · reemplazamos "Nova" → "PEPTIQ" en los parámetros dinámicos.

---

## Mensaje post-respuesta (cuando cliente reacciona al template)

Cuando el lead responda al template · entra ventana 24h · se puede mandar texto libre.

SARA bot ya está configurado para:
1. Detectar intent (wolverine/glow/etc)
2. Pedir nombre
3. Mandar 3 opciones pago (SPEI Banorte + Stripe + OXXO)

---

## Ejemplo de mensaje renderizado

Para Dr. Juan García (Medicina Estética · CDMX):

```
🧬 PEPTIQ MX · Research-Grade Peptides

Dr./Dra. Dr. Juan García,

Soy del equipo PEPTIQ MX. Distribuimos péptidos research-grade 
con COA Janoshik público por lote (99%+ HPLC) — único proveedor 
con esto en México.

Varias clínicas de Medicina Estética en CDMX ya los integran 
en sus protocolos:

• BPC-157 10mg — $2,999
• GHK-Cu 100mg — $3,799
• Wolverine Stack (BPC+TB) — $5,499

🎁 Código LANZA20 = -20% en primer pedido (válido 7 días).

¿Le mando catálogo PDF con COAs?

[Mandar catálogo]  [Ya no gracias]
```
