# GENERADOR DE IMÁGENES PEPTIQ

Genera renders profesionales de los 15 productos PEPTIQ automáticamente.

---

## OPCIÓN A: Automatizado con Replicate (RECOMENDADO)

**Costo:** $0.03 USD total (~50 centavos MXN)  
**Tiempo:** 10-15 minutos  
**Calidad:** Excelente (FLUX.1 Pro)

### Setup (solo primera vez):

```bash
cd /Users/end/Desktop/tdi-peptidos/peptiqmx

# 1. Instalar dependencias
npm install

# 2. Obtener API token
# - Ve a https://replicate.com
# - Regístrate (gratis, $5 de crédito inicial)
# - Ve a https://replicate.com/account/api-tokens
# - Copia tu token (empieza con "r8_...")

# 3. Configurar token
export REPLICATE_API_TOKEN="r8_tu_token_aqui"

# 4. Generar todas las imágenes
npm run generate
```

### Resultado:
- ✅ 15 imágenes JPG en `/img/`
- ✅ Calidad profesional
- ✅ Nombres correctos (bpc-157.jpg, tb-500.jpg, etc.)
- ✅ Listas para usar en el sitio

---

## OPCIÓN B: Manual con ImageFX (GRATIS)

**Costo:** $0  
**Tiempo:** 30-45 minutos  
**Calidad:** Muy buena

### Pasos:

```bash
cd /Users/end/Desktop/tdi-peptidos/peptiqmx

# 1. Generar archivo de prompts
node generate-prompts-only.js

# 2. Abre el archivo generado
open PROMPTS-PEPTIQ.md
```

Luego:
1. Ve a https://aitestkitchen.withgoogle.com/tools/image-fx
2. Copia cada prompt del archivo PROMPTS-PEPTIQ.md
3. Genera 4 variaciones
4. Descarga la mejor
5. Guarda en `/img/` con el filename indicado
6. Repite para los 15 productos

---

## Comparación

| Aspecto | Opción A (Replicate) | Opción B (ImageFX) |
|---------|---------------------|-------------------|
| Costo | $0.03 USD | Gratis |
| Tiempo | 10-15 min | 30-45 min |
| Calidad | Excelente | Muy buena |
| Trabajo manual | Ninguno | Alto |

---

## Después de generar las imágenes:

```bash
# 1. Verifica que todas estén en /img/
ls -la img/

# 2. Abre index.html y verifica que las rutas sean correctas
# (ya deberían estar bien si los filenames coinciden)

# 3. Deploy a Netlify
# (si tienes netlify CLI: netlify deploy --prod)
```

---

## Productos a generar:

### GLOW™ (3)
- ahk-cu.jpg
- ghk-cu.jpg
- trinity.jpg

### HIGHLANDER™ (2)
- epithalon.jpg
- nad.jpg

### SHRED™ (2)
- retatrutide.jpg
- tirzepatide.jpg

### WOLVERINE™ (4)
- bpc-157.jpg
- tb-500.jpg
- kpv.jpg
- heal-stack.jpg

### PRIME™ (3)
- ipamorelin.jpg
- tesamorelin.jpg
- gh-stack.jpg

### SUPPORT™ (1)
- bac-water.jpg

**Total: 15 imágenes**

---

## ¿Problemas?

**Error: REPLICATE_API_TOKEN no encontrado**
```bash
export REPLICATE_API_TOKEN="r8_tu_token_aqui"
```

**Error: npm command not found**
```bash
# Instala Node.js primero:
brew install node
```

**Imágenes no se ven bien**
- Regenera con variaciones diferentes
- Ajusta el prompt en generate-all-images.js
- O usa ImageFX manualmente para tener más control

---

## Recomendación:

Si tienes $0.03 USD → **Usa Opción A** (5 minutos vs 45 minutos)  
Si quieres 100% gratis → **Usa Opción B** (más control creativo)
