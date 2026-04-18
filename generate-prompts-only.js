#!/usr/bin/env node
/**
 * PEPTIQ Prompt Generator (Solo prompts, sin API)
 * Genera todos los prompts para usar manualmente en ImageFX/DALL-E/Midjourney
 *
 * Uso: node generate-prompts-only.js
 */

const fs = require('fs');

// Productos (mismo array que generate-all-images.js)
const PRODUCTOS = [
  // GLOW
  { sku: 'SKU01', name: 'AHK-CU', line: 'GLOW™', dose: '50 mg', color: 'beige', filename: 'ahk-cu.jpg' },
  { sku: 'SKU02', name: 'GHK-CU', line: 'GLOW™', dose: '100 mg', color: 'beige', filename: 'ghk-cu.jpg' },
  { sku: 'SKU03', name: 'TRINITY', line: 'GLOW™', subtitle: 'BPC + GHK-Cu + TB-500', dose: '70 mg', color: 'beige', badge: 'SYSTEM', filename: 'trinity.jpg' },

  // HIGHLANDER
  { sku: 'SKU04', name: 'EPITHALON', line: 'HIGHLANDER™', dose: '50 mg', color: 'gold', filename: 'epithalon.jpg' },
  { sku: 'SKU05', name: 'NAD+', line: 'HIGHLANDER™', dose: '500 mg', color: 'gold', filename: 'nad.jpg' },

  // SHRED
  { sku: 'SKU06', name: 'RETATRUTIDE', line: 'SHRED™', dose: '30 mg', color: 'beige', filename: 'retatrutide.jpg' },
  { sku: 'SKU07', name: 'TIRZEPATIDE', line: 'SHRED™', dose: '30 mg', color: 'beige', filename: 'tirzepatide.jpg' },

  // WOLVERINE
  { sku: 'SKU08', name: 'BPC-157', line: 'WOLVERINE™', dose: '10 mg', color: 'burgundy', filename: 'bpc-157.jpg' },
  { sku: 'SKU09', name: 'TB-500', line: 'WOLVERINE™', dose: '10 mg', color: 'burgundy', filename: 'tb-500.jpg' },
  { sku: 'SKU10', name: 'KPV', line: 'WOLVERINE™', dose: '10 mg', color: 'burgundy', filename: 'kpv.jpg' },
  { sku: 'SKU11', name: 'HEAL STACK', line: 'WOLVERINE™', subtitle: 'BPC-157 + TB-500', dose: '20 mg', color: 'burgundy', badge: 'SYSTEM', filename: 'heal-stack.jpg' },

  // PRIME
  { sku: 'SKU12', name: 'IPAMORELIN', line: 'PRIME™', dose: '10 mg', color: 'black', filename: 'ipamorelin.jpg' },
  { sku: 'SKU13', name: 'TESAMORELIN', line: 'PRIME™', dose: '10 mg', color: 'black', filename: 'tesamorelin.jpg' },
  { sku: 'SKU14', name: 'GH STACK', line: 'PRIME™', subtitle: 'CJC-1295 + IPAMORELIN', dose: '10 mg', color: 'black', badge: 'SYSTEM', filename: 'gh-stack.jpg' },

  // SUPPORT
  { sku: 'SKU15', name: 'BAC WATER', line: 'SUPPORT™', dose: '3 ml', color: 'neutral', filename: 'bac-water.jpg' }
];

function generatePrompt(producto) {
  const basePrompt = `professional pharmaceutical product photography, medical glass vial with white label`;

  const labelText = `"${producto.line} ${producto.name} ${producto.dose} PEPTIQ MX"`;

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

  const badge = producto.badge ? `, small gold "SYSTEM" badge on label` : '';

  const composition = `black matte background, dramatic side lighting from left creating subtle shadow, certificate of analysis paper visible beside vial with "99.6% HPLC Janoshik" text, minimalist premium aesthetic, scientific elegance, ultra sharp focus, 8k studio photography, high-end pharmaceutical advertising`;

  return `${basePrompt} labeled ${labelText}, clear liquid inside, ${colorScheme}${badge}, ${composition}`;
}

// Generar archivo markdown con todos los prompts
let markdown = `# PROMPTS PARA GENERAR IMÁGENES PEPTIQ\n\n`;
markdown += `**Total:** ${PRODUCTOS.length} productos\n\n`;
markdown += `**Usa estos prompts en:**\n`;
markdown += `- ImageFX (Google): https://aitestkitchen.withgoogle.com/tools/image-fx\n`;
markdown += `- DALL-E (OpenAI): https://labs.openai.com\n`;
markdown += `- Midjourney: /imagine [prompt]\n\n`;
markdown += `**Instrucciones:**\n`;
markdown += `1. Copia cada prompt\n`;
markdown += `2. Pega en la herramienta\n`;
markdown += `3. Genera 4 variaciones\n`;
markdown += `4. Selecciona la mejor\n`;
markdown += `5. Descarga como JPG\n`;
markdown += `6. Guarda en /img/ con el filename indicado\n\n`;
markdown += `---\n\n`;

PRODUCTOS.forEach((producto, i) => {
  markdown += `## ${i + 1}. ${producto.line} ${producto.name}\n\n`;
  markdown += `**Filename:** \`${producto.filename}\`\n\n`;
  markdown += `**Prompt:**\n\n`;
  markdown += `\`\`\`\n${generatePrompt(producto)}\n\`\`\`\n\n`;
  markdown += `---\n\n`;
});

// Guardar archivo
fs.writeFileSync('PROMPTS-PEPTIQ.md', markdown);

console.log('✅ Prompts generados en PROMPTS-PEPTIQ.md');
console.log('');
console.log(`📋 ${PRODUCTOS.length} prompts listos para usar en ImageFX/DALL-E/Midjourney`);
console.log('');
console.log('Abre el archivo y copia cada prompt manualmente.');
