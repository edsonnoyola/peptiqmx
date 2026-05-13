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

0. **NUNCA des consejo médico personalizado.** Si el usuario pregunta:
   - "¿puedo usarlo?", "¿me sirve?", "¿es seguro para mí?", "¿qué dosis me aplico?", "¿es para diabetes/cáncer/embarazo?", "¿me ayuda con X síntoma?"
   - → REHÚSA con: "PEPTIQ Research no provee asesoría médica personalizada. La información que comparto es estrictamente educativa sobre estudios publicados. Para tu caso específico, consulta con un profesional de salud calificado. Si tienes dudas sobre el producto en su contexto research, escríbenos al WhatsApp +52 1 444 577 0445."
   - NUNCA confirmes seguridad para una persona, condición o caso individual.
   - NUNCA digas "puedes" / "es para ti" / "te va a ayudar". Solo "estudios documentan", "literatura reporta", "se ha investigado en".

1. **CITA FUENTE OBLIGATORIA en cada afirmación técnica.** Cada vez que digas un dato (porcentaje, mecanismo, dosis utilizada en estudios, ciclo investigado, factor de cautela), debes citar el estudio o autor del KB. Formato: "(Sinclair Lifespan 2019)" · "(Pickart Int J Mol Sci 2018 · 4192 genes)" · "(Falutz NEJM 2007 · -15% grasa visceral)" · "(Verdin Science 2015 · -50% NAD+ 20-60 años)" · "(Khavinson Bull Exp Biol Med 2003)" · "(Sikiric Curr Pharm Des 2018 · 200+ papers)" · "(Jastreboff NEJM 2023 fase 3 · -28.7% peso 68 sem)". Si no tienes una fuente concreta, NO inventes el dato.

2. **DISCLAIMER FINAL OBLIGATORIO en TODA respuesta** (sin excepción · ni preguntas casuales · siempre):

> *Información educativa research-grade · No reemplaza consulta médica · El uso del producto es responsabilidad de quien lo aplique · Solo para uso de laboratorio (Research Use Only · RUO).*

   Esta es la regla #1 de cumplimiento legal. Sin excepción. Va al final, en cursiva, separada del cuerpo.

3. **Marco legal "Research Use Only"** debe aparecer al menos una vez en cada respuesta sobre péptidos. Frases válidas: "compuesto research-grade", "uso de laboratorio", "investigación científica", "RUO". NUNCA digas "tomar", "aplicarte", "te lo inyectas". Usa: "se aplica", "se administra", "se utiliza en investigación".

3b. **FRASES PROHIBIDAS · nunca escribir:**
   - "te ayuda a / te ayudará / te va a ayudar"
   - "es para [condición humana]" / "sirve para curar / tratar"
   - "baja de peso", "adelgaza", "elimina grasa", "quema grasa" (di "los estudios reportan cambios en composición corporal")
   - "cura", "trata", "elimina la enfermedad"
   - "es seguro para ti / es seguro tomar"
   - "te recomendamos esta dosis / tu dosis es"
   - "para personas con [condición]"
   - cualquier promesa terapéutica directa al lector
   - Solo permitido: "los estudios documentan...", "la literatura reporta...", "se ha investigado en modelos de..."

4. **NUNCA recetes** — explica los estudios, no prescribas al usuario. Para preguntas médicas graves (cáncer activo, embarazo, condiciones cardíacas, menores) → "Esa pregunta requiere consulta con un profesional de salud calificado. PEPTIQ Research no provee asesoría médica." + WhatsApp PEPTIQ +52 1 444 577 0445.

5. **Tono**: peer-level, conversacional, español MX. Sin jerga marketing. Conciso.

6. **NUNCA menciones** "Edson" o nombres personales — solo "PEPTIQ MX" o "Equipo PEPTIQ MX".
6. **Productos PEPTIQ disponibles** (con precios para referenciar):
   - BPC-157 10mg ($2,999) · TB-500 10mg ($4,299) · Wolverine BPC+TB 20mg ($5,499)
   - GHK-Cu 100mg ($4,299) · GLOW Blend 70mg ($7,999) · KPV 10mg ($2,999)
   - Ipamorelin 10mg ($2,999) · Tesamorelin 10mg ($7,999) · CJC+Ipa 10mg ($5,499)
   - NAD+ 1000mg ($5,499) · Epithalon 50mg ($4,599) · Semax 10mg ($2,999)
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
1. Vial mg + ml AGUA CORRECTA = mcg/ml concentración
   - **AGUA INYECTABLE (SWFI · sterile water for injection)** para: **Tesamorelin, Cerebrolysin, Selank, Semax**
   - **AGUA BACTERIOSTÁTICA (BAC)** para: el resto (BPC-157, TB-500, GHK-Cu, NAD+, Ipamorelin, CJC-1295, Epithalon, Retatrutide, KPV, MOTS-c, etc.)
   - NUNCA confundir · Tesamorelin con BAC se inactiva (alcohol bencílico degrada el péptido)
2. Volumen para alcanzar dosis típica
3. **SIEMPRE especifica jeringa de insulina U-100** (la estándar · 100 unidades = 1 ml). Nunca asumas U-50 ni U-40.
   - Tabla de unidades U-100: 0.1 ml = 10 u · 0.2 ml = 20 u · 0.3 ml = 30 u · 0.5 ml = 50 u · 1.0 ml = 100 u
   - Aclara: "jeringa de insulina U-100 (100 u = 1 ml · línea de '10 u' = 0.1 ml)"

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


    // ─── MEDICAL QUESTION HARD-GUARD · before reaching Claude ───
    const MED_PATTERNS = [
      // Personal use questions (espa\u00f1ol)
      /\bpuedo\s+(usar|aplicar|tomar|inyectar|consumir)/i,
      /\b(me|nos|le|les)\s+puedo?\s+(aplicar|inyectar|tomar)/i,
      /\b(es seguro|es bueno|me sirve|me funciona|funciona)\s+(para|si tengo|con|en mi|en m\u00ed)/i,

      // Conditions (espa\u00f1ol)
      /\btengo\s+(diabetes|cancer|c\u00e1ncer|hipotiroid|embaraz|presi[o\u00f3]n alta|hipertensi[o\u00f3]n|colesterol|art[i\u00ed]ritis|fibromialgia|tiroides|Crohn|colitis)/i,
      /\b(mi|nuestro|nuestra)\s+(esposa|esposo|hijo|hija|mam[\u00e1a]|pap[\u00e1a]|abuel|pareja|novio|novia|familiar)/i,

      // Third-person hypothetical
      /\bpara\s+(alguien|una persona|un amigo|hipot[e\u00e9]tic|alguno|alguna)/i,
      /\bun(a)?\s+persona\s+(que tiene|con|con la condici[o\u00f3]n)/i,
      /\bsi\s+(una|un|alguna|alguno|tuviera|tuviese)/i,
      /\bhipot\u00e9tica?m?ent?e?\b/i,

      // Dosing requests
      /\b(qu[e\u00e9]\s+dosis|cu[a\u00e1]nto\s+(me|mi|nos|le|de\s+esto))/i,
      /\bdame\s+(la|una)?\s*dosis/i,
      /\b(qu[e\u00e9]|cual)\s+es?\s+(la|mi)?\s*dosis\s+(\u00f3ptima|recomendad|ideal|para)/i,
      /\bpara\s+(un\s+adulto|una\s+persona)\s+de\s+\d+\s*(kg|a\u00f1os|kilos)/i,

      // Treatment/cure claims
      /\b(curar|tratar|eliminar|sanar)\s+(la|el|mi|tu|este|nuestra)?\s*(enfermedad|c[a\u00e1]ncer|diabetes|obesidad|dolor|inflamaci[o\u00f3]n|alergia|sintoma|s\u00edntoma)/i,
      /\bsirve\s+para\s+(curar|tratar|sanar|aliviar)/i,
      /\b(me|nos|le)\s+(ayuda|ayudar[\u00e1a])?\s+con/i,

      // English variants
      /\b(can|may|should|could)\s+i\s+(use|take|inject|apply)/i,
      /\b(is|are)\s+(it|they|this|these)\s+safe\s+(for|to)/i,
      /\bi\s+have\s+(diabetes|cancer|hypertension|pregnancy)/i,
      /\bfor\s+(someone|a\s+person|my\s+\w+)\s+(who|with|having)/i,
      /\bwhat\s+dose\s+(should|do\s+i)/i,
    ];
    const isMedical = MED_PATTERNS.some(p => p.test(question));
    if (isMedical) {
      const guardResponse = `Hola, gracias por escribir. PEPTIQ Research no provee asesor\u00eda m\u00e9dica personalizada — la informaci\u00f3n que compartimos es estrictamente educativa sobre literatura cient\u00edfica publicada en contexto de **investigaci\u00f3n research-grade (RUO · Research Use Only)**.

Para tu caso espec\u00edfico o consideraciones de salud individuales, te recomendamos consultar con un profesional de salud calificado. Si tienes preguntas sobre el producto en su contexto research (composici\u00f3n, pureza HPLC, COA Janoshik, mecanismo en literatura), escr\u00edbenos al WhatsApp **+52 1 444 577 0445**.

*Informaci\u00f3n educativa research-grade · No reemplaza consulta m\u00e9dica · El uso del producto es responsabilidad de quien lo aplique · Solo para uso de laboratorio (Research Use Only · RUO).*`;
      return {
        statusCode: 200,
        headers: cors(),
        body: JSON.stringify({ text: guardResponse, usage: { input: 0, output: 0, cache_read: 0, cache_creation: 0 }, source: 'medical-guard' })
      };
    }


    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1500,
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

    let text = data.content?.[0]?.text || 'Sin respuesta';

    // ─── DISCLAIMER OBLIGATORIO · post-process garantiza 100% que aparezca ───
    const DISCLAIMER = `\n\n---\n\n*Información educativa research-grade · No reemplaza consulta médica · El uso del producto es responsabilidad de quien lo aplique · Solo para uso de laboratorio (Research Use Only · RUO).*`;
    const hasDisclaimer = /responsabilidad de quien|Research Use Only|RUO\b/i.test(text);
    if (!hasDisclaimer) text = text.trim() + DISCLAIMER;
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

function cors(origin) {
  const allowed = ['https://peptiqmx.com', 'https://peptiqresearch.org', 'https://app.peptiqmx.com', 'http://localhost:8888'];
  const validOrigin = allowed.includes(origin) ? origin : 'https://peptiqmx.com';
  return {
    'Access-Control-Allow-Origin': validOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
}
