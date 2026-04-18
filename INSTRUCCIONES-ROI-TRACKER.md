# 📊 CÓMO CREAR TU ROI TRACKER EN 2 MINUTOS

## PASO 1: Crear Google Sheet (30 seg)

1. Abre: **https://sheets.google.com**
2. Click en **"+ Blank"** (hoja en blanco)
3. Renombra: **"PEPTIQ ROI Tracker - Abril 2026"**

---

## PASO 2: Abrir Apps Script (30 seg)

1. En el menú superior: **Extensions → Apps Script**
2. Se abre una nueva pestaña con código default

---

## PASO 3: Pegar el script (30 seg)

1. **BORRA TODO** el código que dice `function myFunction() {`
2. Abre el archivo: `/Users/end/Desktop/tdi-peptidos/peptiqmx/create-roi-tracker.gs`
3. **Copia TODO** el contenido (⌘+A, ⌘+C)
4. **Pega** en Apps Script (⌘+V)

---

## PASO 4: Ejecutar (30 seg)

1. Click en **💾 Save** (o ⌘+S)
2. En el dropdown arriba, selecciona: **`setupROITracker`**
3. Click en **▶️ Run**
4. **Primera vez:** Aparece popup "Authorization required"
   - Click **"Review Permissions"**
   - Selecciona tu cuenta Google
   - Click **"Advanced"** → **"Go to Untitled project (unsafe)"**
   - Click **"Allow"**
5. Espera 10-15 segundos (verás "Running..." abajo)
6. Aparece popup: **"✅ ROI Tracker configurado!"**
7. Click **"OK"**

---

## PASO 5: Ver el resultado

1. **Regresa a la pestaña del Google Sheet**
2. Refresca la página (⌘+R)
3. **¡Listo!** Verás 6 pestañas:
   - ✅ DAILY TRACKING
   - ✅ WEEKLY SUMMARY
   - ✅ PRODUCT MIX
   - ✅ AD PERFORMANCE
   - ✅ MONTHLY P&L
   - ✅ GOALS & TARGETS

---

## 🎯 QUÉ INCLUYE

### DAILY TRACKING
- Headers con formato (negro/blanco)
- 2 semanas de datos ejemplo
- **Fórmulas automáticas:**
  - ROAS = Revenue / Ad Spend
  - CAC = Ad Spend / Ventas
  - AOV = Revenue / Ventas
- Totales semanales
- Formato moneda ($)

### WEEKLY SUMMARY
- Resumen semanal con KPIs
- Fórmulas de totales mensuales
- Top producto por semana

### PRODUCT MIX
- 8 productos PEPTIQ
- Ventas por semana
- Revenue total por producto
- % de revenue automático

### AD PERFORMANCE
- Tracking de ads individuales
- CTR, CPC, CPA, ROAS
- Status (✅ Active, ❌ Paused)
- Acción recomendada

### MONTHLY P&L
- Ingresos
- Costos variables (COGS, envíos, fees)
- Costos fijos (ads, media buyer, tools)
- **Profit Neto calculado automáticamente**
- ROI % y Margen %

### GOALS & TARGETS
- Metas mensuales (Abr-Jun)
- **Semáforo de salud:**
  - Verde ✅ / Amarillo ⚠️ / Rojo ❌
  - ROAS, CAC, WhatsApp CR, etc.

---

## 📅 CÓMO USARLO DIARIAMENTE (10 min cada mañana)

### 9:00 AM - Actualizar DAILY TRACKING:

1. Abre **Meta Ads Manager** → Anota Ad Spend de ayer
2. Abre **WhatsApp Business** → Cuenta mensajes y ventas de ayer
3. Abre **Instagram Insights** → Posts y Reels publicados ayer
4. **Llena la fila de ayer** en DAILY TRACKING:
   - Fecha
   - Día
   - Ad Spend
   - Posts IG
   - Reels
   - WhatsApp Msgs recibidos
   - Ventas cerradas (#)
   - Productos vendidos (texto)
   - Revenue total
   - Notas importantes
5. **Las fórmulas calculan automáticamente:** ROAS, CAC, AOV

### Viernes 5:00 PM - Resumen semanal:

1. Revisa fila "TOTAL SEM X" en DAILY TRACKING
2. Llena **WEEKLY SUMMARY** con totales de la semana
3. Actualiza **PRODUCT MIX** con ventas de cada producto
4. Revisa **AD PERFORMANCE** → Pausa ads con ROAS <2
5. Escribe 3 learnings de la semana en Notas

### Fin de mes - P&L completo:

1. Actualiza **MONTHLY P&L**
2. Compara vs **GOALS & TARGETS**
3. **Decisión:** ¿Escalamos presupuesto el próximo mes?

---

## ⚠️ TROUBLESHOOTING

### "Authorization required" no aparece
- Asegúrate de que seleccionaste `setupROITracker` en el dropdown
- Click en **Run** de nuevo

### "Exception: Service Spreadsheets failed"
- Refresca la página de Apps Script
- Intenta Run de nuevo

### No veo las 6 pestañas
- Refresca el Google Sheet (⌘+R)
- Si persiste: en Apps Script, click **Run** de nuevo

### Las fórmulas muestran "#REF!" o "#DIV/0!"
- Normal al inicio (no hay datos todavía)
- Desaparecen cuando llenas las celdas

---

## 🔗 PRÓXIMO PASO

Una vez creado el Sheet:

1. **Compártelo conmigo** (si quieres que yo revise):
   - Click en "Share" (arriba derecha)
   - Agregar: [tu email]
   - Permission: Editor

2. **Guarda el link** en un lugar seguro:
   - File → Add to Drive
   - Star (⭐) para acceso rápido

3. **Empieza a llenar HOY:**
   - Borra las filas de ejemplo (o déjalas como referencia)
   - Agrega fila con datos de hoy (14 abril)
   - Actualiza mañana (15 abril)

---

## ✅ CHECKLIST

- [ ] Google Sheet creado
- [ ] Apps Script pegado y ejecutado
- [ ] 6 pestañas visibles con formato
- [ ] Fórmulas funcionando (ROAS, CAC, AOV)
- [ ] Sheet guardado en Drive
- [ ] Bookmark del link
- [ ] Primera fila de HOY agregada

---

**Tiempo total:** ~2 minutos

**¿Listo para continuar con Prioridad #2 (WhatsApp Business)?**
