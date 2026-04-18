#!/usr/bin/env node
/**
 * PEPTIQ Automated Image Generator
 * Genera renders profesionales de todos los productos usando Replicate (FLUX.1)
 * Costo: ~$0.03 USD total (15 imágenes × $0.002)
 *
 * Setup:
 * 1. npm install replicate
 * 2. export REPLICATE_API_TOKEN="r8_..." (get from replicate.com/account/api-tokens)
 * 3. node generate-all-images.js
 */

const Replicate = require('replicate');
const fs = require('fs');
const https = require('https');
const path = require('path');

// Configuración
const IMG_DIR = path.join(__dirname, 'img');
const API_TOKEN = process.env.REPLICATE_API_TOKEN;

if (!API_TOKEN) {
  console.error('❌ Error: REPLICATE_API_TOKEN no encontrado');
  console.error('');
  console.error('Setup:');
  console.error('1. Registrate en https://replicate.com (gratis $5 de crédito)');
  console.error('2. Ve a https://replicate.com/account/api-tokens');
  console.error('3. Copia tu token');
  console.error('4. export REPLICATE_API_TOKEN="r8_tu_token_aqui"');
  console.error('5. node generate-all-images.js');
  process.exit(1);
}

const replicate = new Replicate({ auth: API_TOKEN });

// Productos con especificaciones exactas del PDF
const PRODUCTOS = [
  // GLOW - Beauty · Skin · Hair (beige/gold)
  {
    sku: 'SKU01',
    name: 'AHK-CU',
    line: 'GLOW™',
    dose: '50 mg',
    color: 'beige',
    filename: 'ahk-cu.jpg'
  },
  {
    sku: 'SKU02',
    name: 'GHK-CU',
    line: 'GLOW™',
    dose: '100 mg',
    color: 'beige',
    filename: 'ghk-cu.jpg'
  },
  {
    sku: 'SKU03',
    name: 'TRINITY',
    line: 'GLOW™',
    subtitle: 'BPC + GHK-Cu + TB-500',
    dose: '70 mg',
    color: 'beige',
    badge: 'SYSTEM',
    filename: 'trinity.jpg'
  },

  // HIGHLANDER - Longevity · Anti-aging (gold)
  {
    sku: 'SKU04',
    name: 'EPITHALON',
    line: 'HIGHLANDER™',
    dose: '50 mg',
    color: 'gold',
    filename: 'epithalon.jpg'
  },
  {
    sku: 'SKU05',
    name: 'NAD+',
    line: 'HIGHLANDER™',
    dose: '500 mg',
    color: 'gold',
    filename: 'nad.jpg'
  },

  // SHRED - Weight loss · Metabolism (beige)
  {
    sku: 'SKU06',
    name: 'RETATRUTIDE',
    line: 'SHRED™',
    dose: '30 mg',
    color: 'beige',
    filename: 'retatrutide.jpg'
  },
  {
    sku: 'SKU07',
    name: 'TIRZEPATIDE',
    line: 'SHRED™',
    dose: '30 mg',
    color: 'beige',
    filename: 'tirzepatide.jpg'
  },

  // WOLVERINE - Recovery · Healing (burgundy)
  {
    sku: 'SKU08',
    name: 'BPC-157',
    line: 'WOLVERINE™',
    dose: '10 mg',
    color: 'burgundy',
    filename: 'bpc-157.jpg'
  },
  {
    sku: 'SKU09',
    name: 'TB-500',
    line: 'WOLVERINE™',
    dose: '10 mg',
    color: 'burgundy',
    filename: 'tb-500.jpg'
  },
  {
    sku: 'SKU10',
    name: 'KPV',
    line: 'WOLVERINE™',
    dose: '10 mg',
    color: 'burgundy',
    filename: 'kpv.jpg'
  },
  {
    sku: 'SKU11',
    name: 'HEAL STACK',
    line: 'WOLVERINE™',
    subtitle: 'BPC-157 + TB-500',
    dose: '20 mg',
    color: 'burgundy',
    badge: 'SYSTEM',
    filename: 'heal-stack.jpg'
  },

  // PRIME - Growth Hormone · Performance (black/gold)
  {
    sku: 'SKU12',
    name: 'IPAMORELIN',
    line: 'PRIME™',
    dose: '10 mg',
    color: 'black',
    filename: 'ipamorelin.jpg'
  },
  {
    sku: 'SKU13',
    name: 'TESAMORELIN',
    line: 'PRIME™',
    dose: '10 mg',
    color: 'black',
    filename: 'tesamorelin.jpg'
  },
  {
    sku: 'SKU14',
    name: 'GH STACK',
    line: 'PRIME™',
    subtitle: 'CJC-1295 + IPAMORELIN',
    dose: '10 mg',
    color: 'black',
    badge: 'SYSTEM',
    filename: 'gh-stack.jpg'
  },

  // SUPPORT - Solvent · Utility (neutral)
  {
    sku: 'SKU15',
    name: 'BAC WATER',
    line: 'SUPPORT™',
    dose: '3 ml',
    color: 'neutral',
    filename: 'bac-water.jpg'
  }
];

// Función para generar prompt según producto
function generatePrompt(producto) {
  const basePrompt = `professional pharmaceutical product photography, medical glass vial with white label`;

  // Texto de la etiqueta
  const labelText = `"${producto.line} ${producto.name} ${producto.dose} PEPTIQ MX"`;

  // Color scheme según línea
  let colorScheme = '';
  if (producto.color === 'beige') {
    colorScheme = 'beige and gold accent lettering';
  } else if (producto.color === 'gold') {
    colorScheme = 'gold lettering on white background';
  } else if (producto.color === 'burgundy') {
    colorScheme = 'burgundy red and gold lettering';
  } else if (producto.color === 'black') {
    colorScheme = 'matte black label with gold foil lettering';
  } else {
    colorScheme = 'minimal white and black design';
  }

  // Badge si es stack/system
  const badge = producto.badge ? `, small gold "SYSTEM" badge on label` : '';

  // Composición
  const composition = `black matte background, dramatic side lighting from left creating subtle shadow, certificate of analysis paper visible beside vial with "99.6% HPLC Janoshik" text, minimalist premium aesthetic, scientific elegance, ultra sharp focus, 8k studio photography, high-end pharmaceutical advertising`;

  return `${basePrompt} labeled ${labelText}, clear liquid inside, ${colorScheme}${badge}, ${composition}`;
}

// Función para descargar imagen
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download: ${res.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(filepath);
      res.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });

      fileStream.on('error', (err) => {
        fs.unlink(filepath, () => {});
        reject(err);
      });
    }).on('error', reject);
  });
}

// Función principal
async function generateAllImages() {
  console.log('🚀 PEPTIQ Image Generator');
  console.log('');
  console.log(`📦 Generando ${PRODUCTOS.length} imágenes...`);
  console.log(`💰 Costo estimado: $${(PRODUCTOS.length * 0.002).toFixed(3)} USD`);
  console.log('');

  // Crear carpeta img si no existe
  if (!fs.existsSync(IMG_DIR)) {
    fs.mkdirSync(IMG_DIR, { recursive: true });
  }

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < PRODUCTOS.length; i++) {
    const producto = PRODUCTOS[i];
    const filepath = path.join(IMG_DIR, producto.filename);

    console.log(`[${i + 1}/${PRODUCTOS.length}] ${producto.line} ${producto.name}...`);

    try {
      const prompt = generatePrompt(producto);

      console.log(`  → Prompt: ${prompt.substring(0, 80)}...`);
      console.log(`  → Generando con FLUX.1 Pro...`);

      const output = await replicate.run(
        "black-forest-labs/flux-1.1-pro",
        {
          input: {
            prompt: prompt,
            aspect_ratio: "1:1",
            output_format: "jpg",
            output_quality: 90,
            safety_tolerance: 2,
            prompt_upsampling: true
          }
        }
      );

      const imageUrl = typeof output === 'string' ? output : output[0];

      console.log(`  → Descargando imagen...`);
      await downloadImage(imageUrl, filepath);

      console.log(`  ✅ Guardado en img/${producto.filename}`);
      console.log('');

      successCount++;

    } catch (error) {
      console.error(`  ❌ Error: ${error.message}`);
      console.log('');
      errorCount++;
    }

    // Rate limiting (max 50 requests/min)
    if (i < PRODUCTOS.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }

  console.log('');
  console.log('═══════════════════════════════════════');
  console.log(`✅ Completado: ${successCount}/${PRODUCTOS.length}`);
  if (errorCount > 0) {
    console.log(`❌ Errores: ${errorCount}`);
  }
  console.log('═══════════════════════════════════════');
  console.log('');
  console.log('Próximos pasos:');
  console.log('1. Revisa las imágenes en /img/');
  console.log('2. node update-html.js (para actualizar el sitio)');
  console.log('3. Deploy a Netlify');
}

// Ejecutar
generateAllImages().catch(console.error);
