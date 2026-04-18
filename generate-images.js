#!/usr/bin/env node
/**
 * PEPTIQ Image Generator
 * Genera todas las imágenes del catálogo con Imagen 3 de Google
 * Uso: node generate-images.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Google API Key (la misma de Cesantoni)
const GOOGLE_API_KEY = 'AIzaSyDhdB_pgL8D6s1ax7-eF4h4FJMFN38U_tc';
const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict';

// Directorio de imágenes
const IMG_DIR = path.join(__dirname, 'img');

// Productos a generar
const PRODUCTS = [
  {
    id: 'hero-peptiq',
    name: 'Hero Image Principal',
    prompt: 'luxury pharmaceutical still life, single glass vial labeled "PEPTIQ MX" on black marble surface, dramatic side lighting creating long shadow, certificate of analysis paper beside vial with visible "99.6% HPLC" text, gold lettering on vial, minimalist premium aesthetic, scientific elegance, ultra sharp focus, 8k studio photography, high-end pharmaceutical advertising',
    priority: 1
  },
  {
    id: 'bpc-157',
    name: 'BPC-157 10mg',
    prompt: 'professional pharmaceutical product photography, medical glass vial labeled "BPC-157 10mg PEPTIQ MX", clear liquid inside, black matte background, dramatic side lighting from left, gold accent on label, certificate of analysis visible beside vial, minimalist composition, premium scientific aesthetic, ultra sharp focus, 8k quality, pharmaceutical studio photography',
    priority: 1
  },
  {
    id: 'tb-500',
    name: 'TB-500 10mg',
    prompt: 'professional pharmaceutical product photography, medical glass vial labeled "TB-500 10mg PEPTIQ MX", clear liquid inside, black matte background, soft professional lighting, gold lettering on label, scientific elegance, certificate paper with "99.3% purity" visible, minimalist luxury, ultra sharp focus, 8k studio quality',
    priority: 1
  },
  {
    id: 'nad-plus',
    name: 'NAD+ 1000mg',
    prompt: 'professional pharmaceutical vial photography, glass vial labeled "NAD+ 1000mg PEPTIQ MX", clear solution inside, black background with subtle gradient, premium lighting setup, gold PEPTIQ logo on label, anti-aging elegance, certificate beside vial, ultra sharp pharmaceutical photography, 8k quality',
    priority: 2
  },
  {
    id: 'ghk-cu',
    name: 'GHK-Cu 100mg',
    prompt: 'professional medical vial photography, glass vial with "GHK-Cu 100mg PEPTIQ MX" label, slight blue tint in liquid, black matte surface, dramatic rim lighting, copper accent color on label detail, premium scientific presentation, certificate of analysis visible, ultra sharp focus, pharmaceutical studio shot, 8k quality',
    priority: 2
  },
  {
    id: 'retatrutide',
    name: 'Retatrutide 30mg',
    prompt: 'professional pharmaceutical photography, premium glass vial labeled "Retatrutide 30mg PEPTIQ MX", clear liquid, black background, gold premium lettering, weight loss category elegance, certificate with "99.8% HPLC" visible, minimalist luxury composition, studio lighting, 8k ultra sharp',
    priority: 2
  },
  {
    id: 'tesamorelin',
    name: 'Tesamorelin 10mg',
    prompt: 'pharmaceutical product photography, glass vial "Tesamorelin 10mg PEPTIQ MX", clear solution, black premium background, soft key light, gold accents on label, growth hormone category, certificate paper visible, minimalist scientific aesthetic, 8k studio quality',
    priority: 3
  },
  {
    id: 'semax',
    name: 'Semax 10mg',
    prompt: 'professional vial photography, medical glass vial labeled "Semax 10mg PEPTIQ MX", clear liquid, black background, cognitive enhancement aesthetic, gold lettering, certificate beside vial showing "99.5% purity", premium minimalist composition, 8k pharmaceutical studio shot',
    priority: 3
  },
  {
    id: 'epithalon',
    name: 'Epithalon 50mg',
    prompt: 'pharmaceutical product photo, glass vial "Epithalon 50mg PEPTIQ MX", clear solution, black matte surface, longevity aesthetic with gold accents, certificate of analysis visible, professional studio lighting, minimalist premium presentation, ultra sharp 8k quality',
    priority: 3
  },
  {
    id: 'kpv',
    name: 'KPV 10mg',
    prompt: 'professional pharmaceutical photography, medical vial labeled "KPV 10mg PEPTIQ MX", clear liquid, black background, inflammation category aesthetic, gold PEPTIQ lettering, certificate paper with purity results, minimalist scientific elegance, 8k studio quality',
    priority: 3
  },
  {
    id: 'cjc-ipa',
    name: 'CJC-1295 + Ipamorelin',
    prompt: 'pharmaceutical product photography, premium glass vial labeled "CJC+Ipa 10mg PEPTIQ MX", clear solution, black background with gradient, growth hormone stack aesthetic, gold premium accents, two certificates visible, minimalist luxury, 8k ultra sharp',
    priority: 3
  },
  {
    id: 'ipamorelin',
    name: 'Ipamorelin 10mg',
    prompt: 'professional vial photography, glass vial "Ipamorelin 10mg PEPTIQ MX", clear liquid, black matte background, growth hormone aesthetic, gold lettering, certificate showing "99.2% HPLC", premium scientific presentation, studio lighting, 8k quality',
    priority: 3
  },
  {
    id: 'glow',
    name: 'GLOW Stack',
    prompt: 'pharmaceutical product photography, premium glass vial labeled "GLOW Protocol PEPTIQ MX", slight pink tint aesthetic, black background, beauty and skin category, rose gold accents on label, certificate of analysis, feminine elegance meets science, minimalist luxury, 8k studio shot',
    priority: 2
  },
  {
    id: 'agua-bact',
    name: 'Agua Bacteriostática',
    prompt: 'professional pharmaceutical photography, sterile water vial labeled "Bacteriostatic Water 10ml PEPTIQ MX", crystal clear liquid, black background, medical grade aesthetic, silver blue accents on label, support product category, minimalist clean composition, 8k quality',
    priority: 2
  },
  {
    id: 'box-wolverine',
    name: 'Wolverine Stack Box',
    prompt: 'premium pharmaceutical box packaging, matte black box labeled "WOLVERINE PROTOCOL - PEPTIQ MX", gold embossed lettering, minimalist design, box contains 3 vials visible through cutout window, dark burgundy accent stripe, premium unboxing aesthetic, studio photography with soft shadows, 8k quality, luxury pharmaceutical packaging',
    priority: 1
  },
  {
    id: 'box-titan',
    name: 'TITAN Stack Box',
    prompt: 'premium large pharmaceutical box, black with gold accents, "TITAN PROTOCOL - PEPTIQ MX" embossed, luxury system packaging, window revealing 6 vials organized in foam insert, maximum premium aesthetic, studio shot with dramatic lighting, flagship product presentation, 8k ultra quality packaging photography',
    priority: 2
  },
  {
    id: 'post-coa-verify',
    name: 'Post IG: Verificar COA',
    prompt: 'split screen composition, left side: PEPTIQ vial with certificate showing QR code, right side: smartphone screen displaying janoshik.com verification page with "99.6% purity" result highlighted, black background, educational infographic aesthetic, clean modern design, 8k quality',
    priority: 1
  }
];

// Función para llamar a Imagen 3 API
async function generateImage(prompt, filename) {
  return new Promise((resolve, reject) => {
    const requestData = JSON.stringify({
      instances: [{
        prompt: prompt
      }],
      parameters: {
        sampleCount: 1,
        aspectRatio: "1:1",
        safetySetting: "block_only_high",
        personGeneration: "allow_adult"
      }
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: `/v1beta/models/imagen-3.0-generate-001:predict?key=${GOOGLE_API_KEY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': requestData.length
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);

          if (response.predictions && response.predictions[0]) {
            const imageData = response.predictions[0].bytesBase64Encoded;
            const imagePath = path.join(IMG_DIR, `${filename}.jpg`);

            // Guardar imagen
            const buffer = Buffer.from(imageData, 'base64');
            fs.writeFileSync(imagePath, buffer);

            console.log(`✅ Generada: ${filename}.jpg`);
            resolve(imagePath);
          } else {
            reject(new Error(`Error en respuesta: ${JSON.stringify(response)}`));
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(requestData);
    req.end();
  });
}

// Función para esperar
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main
async function main() {
  console.log('🚀 PEPTIQ Image Generator\n');
  console.log(`Generando ${PRODUCTS.length} imágenes con Imagen 3...\n`);

  // Crear directorio si no existe
  if (!fs.existsSync(IMG_DIR)) {
    fs.mkdirSync(IMG_DIR, { recursive: true });
  }

  // Ordenar por prioridad
  const sortedProducts = PRODUCTS.sort((a, b) => a.priority - b.priority);

  let generated = 0;
  let failed = 0;

  for (const product of sortedProducts) {
    try {
      console.log(`\n[${generated + 1}/${PRODUCTS.length}] Generando: ${product.name}`);
      console.log(`Prompt: ${product.prompt.substring(0, 80)}...`);

      await generateImage(product.prompt, product.id);
      generated++;

      // Esperar 2 segundos entre requests para no saturar API
      await sleep(2000);

    } catch (error) {
      console.error(`❌ Error en ${product.name}:`, error.message);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`\n✅ Generadas: ${generated}/${PRODUCTS.length}`);
  if (failed > 0) {
    console.log(`❌ Fallidas: ${failed}`);
  }
  console.log(`\n📁 Guardadas en: ${IMG_DIR}`);
  console.log('\n' + '='.repeat(60));

  // Estimar costo (Imagen 3 es ~$0.04/imagen después del tier gratuito)
  console.log(`\n💰 Costo estimado: $${(generated * 0.04).toFixed(2)} USD`);
  console.log(`   (Primeras ~100 imágenes/mes son GRATIS en tier gratuito)\n`);
}

// Ejecutar
main().catch(console.error);
