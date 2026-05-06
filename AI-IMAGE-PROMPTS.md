# 🎨 PEPTIQ · Prompts AI para generar imágenes producto

**Referencia:** la foto real que ya tienes (BA3 + Tesamorelin con etiqueta blanca/negra PEPTIQ · fondo negro mate · vial glass + cap silver).

**Objetivo:** generar imágenes consistentes para los 13+ productos restantes, manteniendo EXACTAMENTE la misma estética.

---

## Cómo usar estos prompts

### En ChatGPT (DALL-E 3)
1. Abre chat.openai.com
2. Pega el prompt completo
3. ChatGPT genera 1 imagen 1024x1024 o 1024x1792
4. Si no se ve correcta: pide "regenerate with the exact same style as reference, keep label format"

### En Gemini (Imagen 3 / Imagen 4)
1. Abre gemini.google.com
2. Click "Crear imagen" o pega el prompt directo
3. Mejor calidad para vials clínicos

### En Midjourney / Veo3
1. Discord o web Midjourney
2. `/imagine` + prompt
3. Aspect ratio: `--ar 1:1` para producto, `--ar 9:16` para stories

---

## PROMPT MASTER (úsalo para TODOS los productos)

Reemplaza solo `{{NOMBRE_PEPTIDO}}` y `{{LINEA}}` para cada producto.

```
Photorealistic product photography of a single pharmaceutical glass vial 
on a matte black surface with deep black gradient background. The vial 
is small, transparent crystal-clear glass containing a clear lyophilized 
liquid, with a brushed silver aluminum crimp cap on top reflecting subtle 
studio light. The vial label has TWO horizontal bands: 
- TOP BAND: solid black background with the word "PEPTIQ" in elegant 
  serif font (Playfair Display style) in white, centered, with letter-spacing.
- BOTTOM BAND: solid white background with two lines of text in clean 
  sans-serif (Inter style) in black:
  Line 1 (large, bold): "{{NOMBRE_PEPTIDO}}"
  Line 2 (smaller): "{{LINEA}}"

Studio lighting from upper left creating soft reflection on the glass and 
metallic cap. Subtle shadow on the matte black floor below the vial. 
Fashion-editorial pharmaceutical aesthetic. Hyper-detailed, sharp focus, 
8K quality, commercial product photography, no text artifacts, no logos 
other than PEPTIQ. Aspect ratio 1:1 portrait close-up.
```

---

## Productos a generar · 13 imágenes

### Línea WOLVERINE (recuperación)
1. `BPC-157` / `WOLVERINE`
2. `TB-500` / `WOLVERINE`
3. `KPV` / `WOLVERINE`

### Línea HIGHLANDER (longevidad)
4. `NAD+` / `HIGHLANDER`
5. `EPITHALON` / `HIGHLANDER`
6. `GHK-Cu` / `HIGHLANDER`

### Línea GLOW (estética)
7. `TRINITY` / `GLOW`
8. `AHK-Cu` / `GLOW`

### Línea PRIME (performance/GH)
9. `CJC + IPAMORELIN` / `PRIME`
10. `IPAMORELIN` / `PRIME`
11. `SEMAX` / `PRIME`

### Línea SHRED (peso · ya tienes BA3 + Tesamorelin)
12. `RETATRUTIDE` / `SHRED`

### Stack hero (3 vials together)
13. **Highlander Stack:** 3 vials side by side (NAD+ · Epithalon · GHK-Cu)

Para el Stack agrega al prompt:
```
Three vials standing in a row, slightly overlapping, on the same matte 
black surface. Center vial slightly forward. Each labeled differently: 
NAD+ (left), EPITHALON (center), GHK-Cu (right). All "HIGHLANDER" in 
the bottom band line 2. Same pharmaceutical aesthetic.
```

---

## Variaciones para stories / ads

### Stack lifestyle (mano sosteniendo vial)
```
Same vial as base prompt, but held by a man's hand (well-manicured, 
white shirt cuff visible) over a dark wooden desk. Dark library or 
office bokeh in background. Same matte black aesthetic but slightly 
warmer tone. Editorial Hermès-meets-laboratory feel.
```

### Stack hero scene (3 vials editorial)
```
Three pharmaceutical vials with PEPTIQ labels arranged in a triangular 
composition on dark walnut wood surface. Soft side lighting from a 
window. One vial slightly tipped/leaning. Background: blurred vintage 
library shelves. Premium longevity protocol aesthetic.
```

### Detail shot (etiqueta close-up)
```
Macro photography of a single PEPTIQ vial label, extreme close-up showing 
crisp typography. The black "PEPTIQ" header band and white product band 
in sharp focus. Background completely blurred matte black. Studio macro 
lighting revealing texture of the label paper.
```

---

## Específico para ChatGPT 4 (DALL-E 3)

ChatGPT a veces falla en mantener texto del label preciso. Usa este suffix:

```
IMPORTANT: The label must read EXACTLY:
- "PEPTIQ" in the black top band (no other words)
- "{{NOMBRE_PEPTIDO}}" as large text in white band
- "{{LINEA}}" as smaller text below
Do not add any other words, numbers, or graphics on the label.
```

Si genera con texto incorrecto, regenera con: "Same vial style but fix the label text to read exactly: PEPTIQ / {{NOMBRE}} / {{LINEA}}"

---

## Específico para Gemini

Gemini a veces hace los vials demasiado grandes. Add:

```
Vial proportions should be small (50ml medical research vial), not large 
pharmaceutical bottle. Cap should be approximately 1/4 of vial height.
```

---

## Después de generar · cómo procesarlas

1. Descarga cada imagen como PNG
2. Súbelas a `/Users/end/Desktop/tdi-peptidos/peptiqmx/img/products-real/` con nombres:
   - `bpc-157.png`
   - `tb-500.png`
   - `kpv.png`
   - `nad-plus.png`
   - `epithalon.png`
   - `ghk-cu.png`
   - `trinity.png`
   - `ahk-cu.png`
   - `cjc-ipamorelin.png`
   - `ipamorelin.png`
   - `semax.png`
   - `retatrutide.png`
   - `highlander-stack.png` (3 vials)
3. Avísame cuando estén subidas
4. Yo actualizo automáticamente:
   - vip.html (Highlander Stack)
   - sara-backend (NOVA_CATALOG image_urls)
   - app PEPTIQ Tracker
   - Carrusel 60+ slides
   - Catálogo PDF (siguiente versión)

---

## Mientras tanto · ¿stories IG?

Para los 3 stories de IG VIP del playbook anterior, **YA TIENES** la foto perfecta: la que me mandaste (BA3 + Tesamorelin). Esa misma puede ser:

- **Story 1:** corta solo el lado izquierdo (BA3) o usa los 2 vials juntos
- **Story 2:** crop del Tesamorelin solo
- **Story 3:** el split-screen completo (los 2 lado a lado)

No necesitas generar nuevas para las primeras stories.
