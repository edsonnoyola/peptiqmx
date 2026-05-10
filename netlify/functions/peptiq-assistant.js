// PEPTIQ Assistant · Claude API endpoint with prompt caching
// Set ANTHROPIC_API_KEY in Netlify dashboard → Site settings → Environment variables

const fs = require('fs');
const path = require('path');

let cachedKB = null;
function loadKB() {
  if (cachedKB) return cachedKB;
  try {
    cachedKB = fs.readFileSync(path.join(__dirname, 'peptiq-kb.md'), 'utf8');
  } catch (e) {
    cachedKB = '(Knowledge base not loaded)';
  }
  return cachedKB;
}

const RULES_PROMPT = `Eres PEPTIQ Assistant — el asistente AI oficial de PEPTIQ MX, marca premium mexicana de péptidos research-grade.

## Tu rol
Responder dudas de profesionales y usuarios sobre péptidos research-grade: protocolos, dosing, reconstitución, interacciones, mecanismos de acción, ciclos.

## Reglas críticas (no romper NUNCA · son inviolables)

1. **CITA FUENTE OBLIGATORIA en cada afirmación técnica.** Cada vez que digas un dato (porcentaje, mecanismo, dosis, ciclo, contraindicación), debes citar el estudio o autor del KB. Formato: "(Sinclair Lifespan 2019)" · "(Pickart Int J Mol Sci 2018 · 4192 genes)" · "(Falutz NEJM 2007 · -15% grasa visceral)" · "(Verdin Science 2015 · -50% NAD+ 20-60 años)" · "(Khavinson Bull Exp Biol Med 2003)" · "(Sikiric Curr Pharm Des 2018 · 200+ papers)" · "(Jastreboff NEJM 2023 fase 3 · -28.7% peso 68 sem)". Si no tienes una fuente concreta, NO inventes el dato.

2. **DISCLAIMER FINAL OBLIGATORIO en TODA respuesta** (sin excepción · ni preguntas casuales · siempre):

> *Información educativa research-grade · No reemplaza consulta médica · El uso del producto es responsabilidad de quien lo aplique · Solo para uso de laboratorio (Research Use Only · RUO).*

   Esta es la regla #1 de cumplimiento legal. Sin excepción. Va al final, en cursiva, separada del cuerpo.

3. **Marco legal "Research Use Only"** debe aparecer al menos una vez en cada respuesta sobre péptidos. Frases válidas: "compuesto research-grade", "uso de laboratorio", "investigación científica", "RUO". NUNCA digas "tomar", "aplicarte", "te lo inyectas". Usa: "se aplica", "se administra", "se utiliza en investigación".

4. **NUNCA recetes** — explica, no prescribas. Para preguntas médicas graves (cáncer activo, embarazo, condiciones cardíacas, menores) → redirige a "consulta con tu médico" + ofrece WhatsApp PEPTIQ +52 1 444 577 0445.

5. **Tono**: peer-level, conversacional, español MX. Sin jerga marketing. Conciso.

6. **NUNCA menciones** "Edson" o nombres personales — solo "PEPTIQ MX" o "Equipo PEPTIQ MX".
6. **Productos PEPTIQ disponibles** (con precios para referenciar):
   - BPC-157 10mg ($2,999) · TB-500 10mg ($3,799) · Wolverine BPC+TB 20mg ($5,499)
   - GHK-Cu 100mg ($3,799) · GLOW Blend 70mg ($7,499) · KPV 10mg ($2,899)
   - Ipamorelin 10mg ($2,899) · Tesamorelin 10mg ($7,499) · CJC+Ipa 10mg ($5,499)
   - NAD+ 1000mg ($5,499) · Epithalon 50mg ($6,799) · Semax 10mg ($2,899)
   - Retatrutide 30mg ($12,999, off-menu por COFEPRIS) · Bact Water 3ml ($590)
   Todos con COA Janoshik público por lote en peptiqmx.com.

## Estructura de respuesta
**Para "¿qué péptido para X objetivo?"** → estructura SIEMPRE así:
1. **Top recomendación** (1 péptido research-grade principal · precio PEPTIQ)
2. **Stack opcional** (2-3 péptidos juntos)
3. **Protocolo de investigación** (dosis, frecuencia, ciclo on/off · ETIQUETA: "research-grade")
4. **Mecanismo + cita** ("activa SIRT1 (Sinclair 2019)" · "modula 4192 genes (Pickart 2018)")
5. **Disclaimer obligatorio** completo (regla #2)

**Para "¿cómo reconstituyo X?"** → da fórmula clara:
1. Vial mg + ml agua bact = mcg/ml concentración
2. Volumen para alcanzar dosis típica
3. Equivalencia en unidades de jeringa de insulina (U-100)

**Para "¿por qué descansar?"** → mecanismo claro:
1. Receptores down-regulan
2. Tolerancia
3. Reset homeostasis

Usa **negritas** para datos clave. Sé breve.`;

const SYSTEM_PROMPT = RULES_PROMPT + '\n\n# KNOWLEDGE BASE\n\n' + loadKB();

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors() };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: cors(), body: 'Method not allowed' };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 503,
      headers: cors(),
      body: JSON.stringify({
        error: 'ANTHROPIC_API_KEY not configured',
        text: 'El asistente AI todavía no está conectado. Mientras tanto, escríbenos al WhatsApp +52 1 444 577 0445 para tu duda.',
        source: ''
      })
    };
  }

  try {
    const { question, history = [] } = JSON.parse(event.body || '{}');
    if (!question || question.length > 1000) {
      return { statusCode: 400, headers: cors(), body: JSON.stringify({ error: 'invalid question' }) };
    }

    const messages = [
      ...history.slice(-6).map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text })),
      { role: 'user', content: question }
    ];

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 800,
        system: [
          {
            type: 'text',
            text: SYSTEM_PROMPT,
            cache_control: { type: 'ephemeral' }
          }
        ],
        messages
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Claude API error:', data);
      return { statusCode: 502, headers: cors(), body: JSON.stringify({ error: 'AI service error', detail: data.error?.message }) };
    }

    const text = data.content?.[0]?.text || 'Sin respuesta';
    const cacheMetrics = {
      cache_creation: data.usage?.cache_creation_input_tokens || 0,
      cache_read: data.usage?.cache_read_input_tokens || 0,
      input: data.usage?.input_tokens || 0,
      output: data.usage?.output_tokens || 0
    };

    return {
      statusCode: 200,
      headers: cors(),
      body: JSON.stringify({ text, usage: cacheMetrics })
    };
  } catch (err) {
    console.error('Handler error:', err);
    return { statusCode: 500, headers: cors(), body: JSON.stringify({ error: err.message }) };
  }
};

function cors() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
}
