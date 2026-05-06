#!/usr/bin/env python3
"""Build 4 PEPTIQ consumer-direct landing pages from template + stack-builder widget."""
from pathlib import Path

ROOT = Path('/Users/end/Desktop/tdi-peptidos/peptiqmx')
TPL = (ROOT / '_solucion-template.html').read_text(encoding='utf-8')

PAGES = {
    'dormir-mejor': {
        'title': 'Dormir mejor · Sleep stack research-grade',
        'meta_desc': 'No duermes profundo? Stack peptídico Ipamorelin + Epithalon · sueño profundo + ritmo circadiano restaurado · COA Janoshik · MX 24-72h.',
        'eyebrow': '😴 Para los que despiertan a las 3 AM',
        'h1': 'Sueño profundo es la <em>nueva moneda.</em>',
        'lede': 'Si te despiertas exactamente a las 3am · si te tardas 45 min en dormir · si no recuerdas tus sueños · no es estrés, es decline natural de GH y melatonina pineal a partir de los 35. Hay solución científica · no es una pastilla.',
        'problem_h2': '¿Te suena alguno?',
        'problem_lede': 'Estos son los 4 patrones que vemos repetidos en clientes 35-65 que terminan ordenando el Sleep stack.',
        'problem_cards': [
            ('Despierto a las 3 AM exacto', 'No es coincidencia · es el pico fisiológico de cortisol que NO debería estar elevado a esa hora. Indica decline de GH nocturno y disrupción HPA-axis.'),
            ('Tardo 45+ min en dormir', 'No es ansiedad sola · es disrupción del ritmo circadiano de melatonina pineal. Empeora con edad, pantallas y estrés crónico.'),
            ('Sueño ligero · me despierta cualquier ruido', 'Pérdida de ondas delta (sueño profundo). A los 50 años, ya solo tienes 50% del sueño profundo que tenías a los 20. Se siente "cansado al despertar".'),
            ('No recuerdo mis sueños', 'REM disminuido · indicador de sueño no restaurador. Asociado a brain fog, memoria a corto plazo y fatiga cognitiva.'),
        ],
        'stack_name': 'Sleep Stack',
        'stack_desc': 'Dos péptidos sinérgicos que restauran las dos fases del sueño que pierdes con la edad: profundo (Ipamorelin) y circadiano (Epithalon). 6 semanas de protocolo · efectos visibles desde día 7.',
        'stack_items': [
            ('Ipamorelin 10mg', 'GHRP selectivo nocturno · induce pulso GH sin cortisol · ondas delta profundas · 200-300mcg pre-sueño SC'),
            ('Epithalon 50mg', 'Tetrapéptido AEDG · restaura melatonina pineal · ciclo Khavinson 10 días on / 20 off · 5-10mg SC nocturno'),
            ('+ Agua bact + kit', 'Agua bacteriostática USP + jeringas estériles + guía protocolo · sin costo'),
        ],
        'stack_price': '$9,698',
        'stripe_link': 'https://buy.stripe.com/14kdRuauP1zJ44k28kbZK01',  # Sleep stack
        'science_h4': 'Por qué Ipamorelin + Epithalon es el stack validado',
        'science_body': 'Ipamorelin es el GHRP más selectivo del mercado · a diferencia de GHRP-2/6, no incrementa cortisol ni prolactina. Induce pulso GH endógeno fisiológico que profundiza ondas delta del sueño (Sigalos 2018). Epithalon, desarrollado por Dr. Vladimir Khavinson en St. Petersburg Institute of Bioregulation, es el único péptido con evidencia preclínica de restauración del ritmo circadiano de melatonina pineal. El protocolo cíclico 10-on/20-off es el estándar Khavinson.',
        'science_cite': 'Sigalos JT et al. Sex Med Rev 2018 · Khavinson VK · St. Petersburg Institute of Bioregulation 1980-presente · Anisimov VN, Khavinson VKh 2010',
        'faq': [
            ('¿En cuánto tiempo lo siento?', 'Ipamorelin: pulso GH la primera noche · sueño profundo notable entre día 4-7. Epithalon ciclo Khavinson: efecto circadiano completo se ve a la 2da semana del primer ciclo.'),
            ('¿Es legal en México?', 'Sí. Productos research-grade · for research use only. NO aprobados por COFEPRIS, NO son medicamentos. Marco legal de productos para investigación científica. Tu compra es legal · tu uso es responsabilidad personal.'),
            ('¿Necesito médico?', 'Recomendado. PEPTIQ no recomienda uso sin supervisión médica. Si no tienes médico aliado, te referimos a uno (concierge WhatsApp).'),
            ('¿Y si no funciona en mí?', 'Tienes garantía de pureza COA Janoshik (si reporta &lt;97% reponemos sin costo). El protocolo 6-8 sem ha mostrado eficacia en 80%+ de usuarios reportados.'),
            ('¿Qué incluye el envío?', 'Vials liofilizados + agua bacteriostática USP estéril + jeringas + guía protocolo paso a paso. Empaque térmico cuando aplica · 24-72h MX.'),
        ],
    },

    'grasa-visceral': {
        'title': 'Grasa visceral · Stack PRIME · Tesamorelin research-grade',
        'meta_desc': 'Grasa abdominal resistente a dieta y ejercicio? Tesamorelin + CJC+Ipa stack · único FDA-approved para grasa visceral · COA · MX 24-72h.',
        'eyebrow': '⚡ Para hombres 40+ con barriga resistente',
        'h1': 'La grasa visceral <em>no se va con dieta.</em>',
        'lede': 'Si bajas de peso pero la barriga sigue · si tienes ya BMI normal pero te ves con "barril" · si te subiste 5kg después de los 40 que no salen · es grasa visceral · diferente fisiológicamente. La hormona de crecimiento la disuelve. Tesamorelin es el único secretagogo FDA-approved para esto.',
        'problem_h2': '¿Te suena alguno?',
        'problem_lede': 'Patrón típico hombres 40-55 con éxito profesional · 30+ patientes mes que ordenan PRIME stack.',
        'problem_cards': [
            ('Bajé peso pero no la barriga', 'Subcutánea baja con dieta · visceral NO. La visceral responde a hormona de crecimiento, no a calorías. Por eso "estás flaco con panza".'),
            ('Después de los 40, no la pierdo', 'Decline de GH 50% entre 30 y 50 años · mientras menos GH, más visceral acumulas. No es metabolismo lento · es declive hormonal específico.'),
            ('Tomo testo y la panza no baja', 'Testosterona NO afecta visceral directamente. Necesitas el eje GH/IGF-1, no el androgénico. Por eso TRT solo NO resuelve.'),
            ('Hago HIIT y crossfit · sigue ahí', 'Ejercicio quema subcutánea, no visceral. Visceral se elimina vía lipólisis hormonal. Necesitas la señal GH para activar la quema en ese tejido específico.'),
        ],
        'stack_name': 'PRIME GH Stack',
        'stack_desc': 'Stack de los hombres ejecutivos 40-55 que en 12 semanas pierden -18% grasa visceral documentado. Tesamorelin (FDA-approved · selectivo visceral) + CJC+Ipa (pulso GH nocturno fisiológico).',
        'stack_items': [
            ('Tesamorelin 10mg', 'GHRH análogo · único FDA-approved para grasa visceral · 1-2mg SC/día · 8-12 sem'),
            ('CJC + Ipamorelin 10mg', 'GH stack nocturno · pulso fisiológico sin cortisol · 200-400mcg pre-sueño'),
            ('+ Agua bact + kit', 'Agua USP + jeringas + guía protocolo + DEXA tracking pre/post (concierge)'),
        ],
        'stack_price': '$14,999',
        'stripe_link': 'https://buy.stripe.com/4gM00E5aB2DN10Ydqi8wQ02',  # PRIME TITAN $14,999
        'science_h4': 'Por qué Tesamorelin · único FDA-approved para grasa visceral',
        'science_body': 'Tesamorelin es análogo sintético de GHRH aprobado por FDA (Egrifta · EMD Serono) específicamente para reducción de grasa visceral en lipodistrofia HIV. Off-label, los biohackers C-suite y clínicas performance lo usan en hombres 40-65 con grasa visceral resistente. Mecanismo: activa receptor GHRH en hipófisis · induce pulso GH fisiológico · efecto selectivo sobre adipocitos viscerales vía lipólisis inducida por GH · preserva masa magra (Falutz et al. 2010 NEJM). Combinado con CJC+Ipa nocturno extiende el pulso GH durante el sueño profundo · efecto sinérgico documentado.',
        'science_cite': 'Falutz J et al. NEJM 2010 · Egrifta FDA approval 2010 · Sigalos JT, Sex Med Rev 2018',
        'faq': [
            ('¿Cuánto bajo en cuánto tiempo?', 'Estudios fase 3 (Falutz NEJM 2010): -18% grasa visceral en 26 sem con Tesamorelin solo. Con stack CJC+Ipa potencia. Se ve a partir semana 6-8 con DEXA scan.'),
            ('¿Y si tengo TRT también?', 'Cross-compatible. Muchos hacen TRT + GH peptídico · sinérgico para body recomp. Requiere monitoreo lipid + glucose.'),
            ('¿Mareos · efectos secundarios?', 'Tesamorelin: leve hinchazón puntos inyección, transitoria. Ipamorelin: sin cortisol spike · perfil más limpio que GHRP-2/6. Reportar a médico cualquier cosa fuera de protocolo.'),
            ('¿Por qué no HGH directo?', 'HGH exógeno suprime el eje endógeno · perfil regulatorio más complejo · cara $5-15k USD/mes. CJC+Ipa estimula tu PROPIO GH · más fisiológico, sostenible y costo manejable.'),
            ('¿Qué incluye?', '2 vials Tesamorelin + 1 vial CJC+Ipa + agua bact + jeringas + guía 12 semanas + DEXA tracking pre/post (concierge).'),
        ],
    },

    'cerebro-foco': {
        'title': 'Cerebro y foco · Nootropic stack · NAD+ Semax',
        'meta_desc': 'Brain fog, pierdes el hilo, memoria corto plazo? Stack Semax + NAD+ · BDNF + mitocondrial · neuroprotection · COA · MX 24-72h.',
        'eyebrow': '🧠 Para los que pierden el hilo en juntas',
        'h1': 'Brain fog no es <em>edad · es bioquímica.</em>',
        'lede': 'Si te quedas en blanco buscando un nombre · si no sostienes una junta de 90 min sin café · si lees el mismo párrafo 3 veces sin entender · no es estrés y no es Alzheimer · es decline de BDNF y NAD+ celular. Hay stack peptídico + IV específicos que lo arreglan.',
        'problem_h2': '¿Te suena alguno?',
        'problem_lede': 'Patrón ejecutivos 40-65 · directores · founders · que llegan a peptiqmx.com googleando "brain fog" o "no me concentro como antes".',
        'problem_cards': [
            ('Pierdo el hilo a media junta', 'Decline de BDNF (factor de crecimiento neuronal) limita plasticidad sináptica. A los 50, tienes 35% del BDNF que tenías a los 25. Solución: estimulación específica BDNF.'),
            ('Memoria corto plazo · "¿qué iba a hacer?"', 'NAD+ celular declina 50% entre 40 y 60. NAD+ es cofactor de 500+ reacciones · sin él, mitocondria neuronal produce menos ATP · neuronas literalmente con menos energía.'),
            ('Necesito 3 cafés para arrancar', 'Adaptación crónica al estrés · cortisol + adenosina desregulados. Cafeína es solo bandita · resuelve la causa (mitocondrial + neurotransmisor).'),
            ('Olvidé mi cumpleaños o evento importante', 'Memoria episódica afectada · indicador temprano de neurodegeneración subclínica. NO es Alzheimer aún · es ventana para intervenir antes.'),
        ],
        'stack_name': 'Cognitive Longevity Stack',
        'stack_desc': 'Stack neuroprotector que combina Semax (BDNF nootropic intranasal · usado en Rusia clínicamente desde 80s) con NAD+ (mitocondrial · ATP neuronal). 8-10 semanas de protocolo · efectos cognitivos visibles desde día 5.',
        'stack_items': [
            ('Semax 10mg', 'Nootrópico ACTH-derived · ↑BDNF · ↑NGF · neuroprotector documentado · 200-600mcg intranasal'),
            ('NAD+ 1000mg', '500+ reacciones celulares · activa 7 sirtuinas · cofactor mitocondrial · 250-1000mg IV/SC'),
            ('+ Agua bact + kit', 'Agua bacteriostática USP + jeringas + guía protocolo + ciclo recomendado'),
        ],
        'stack_price': '$8,398',
        'stripe_link': 'https://buy.stripe.com/00w7sW6eF38R9oI44sbZK02',  # Cognitive stack
        'science_h4': 'Por qué Semax + NAD+ es el stack cognitivo definitivo',
        'science_body': 'Semax es derivado sintético del ACTH (4-10) desarrollado en Rusia · oficialmente aprobado para uso clínico desde los 80s · referente nootropic peptídico mundial. Mecanismo: aumenta BDNF (Brain-Derived Neurotrophic Factor), incrementa NGF (Nerve Growth Factor), modula sistema dopaminérgico y serotoninérgico, mejora plasticidad sináptica. NAD+ por su parte declina ~50% entre 40 y 60 años (Verdin · Buck Institute) · su reposición parenteral activa las 7 sirtuinas (SIRT1-SIRT7) · restaura producción ATP mitocondrial neuronal. Combinados: BDNF (estructura) + NAD+ (energía) = optimización cognitiva sistémica.',
        'science_cite': 'Levitskaya NG et al. Russ Acad Sci · Sinclair DA, Harvard · Verdin E, Buck Institute',
        'faq': [
            ('¿En cuánto tiempo siento la diferencia?', 'Semax intranasal: efecto agudo 30-60 min post-aplicación · efecto sostenido a partir día 5-7. NAD+ IV: energía + claridad mental el mismo día · acumulativo en 2-3 sesiones.'),
            ('¿Es seguro · adicción?', 'Semax NO es adictivo (no es psicoestimulante tipo modafinil/Adderall). NAD+ es endógeno · tu cuerpo ya lo tiene · solo lo repones. Perfil de seguridad superior a nootrópicos sintéticos.'),
            ('¿Y si tomo café o nootrópicos OTC?', 'Cross-compatible. Muchos usan Semax como "café 2.0" · permite eliminar 1-2 cafés/día. Con nootrópicos comerciales, monitorea no exceder.'),
            ('¿Cómo se administra Semax?', 'Intranasal · 1-3 gotas en cada fosa · 200-600mcg dosis. Te llega con cuentagotas estéril + protocolo de gradación de dosis.'),
            ('¿NAD+ IV o SC?', 'IV es más biodisponible (95% vs 25% SC), pico inmediato. SC es mantenimiento. Recomendamos arrancar con 2-3 sesiones IV en clínica aliada · mantenimiento SC en casa.'),
        ],
    },

    'funcion-sexual': {
        'title': 'Función sexual · Performance stack · CJC+Ipamorelin',
        'meta_desc': 'Disminución erección, energía pareja? Stack CJC+Ipa + BPC-157 · GH + circulación · alternativa fisiológica antes de TRT · COA · MX.',
        'eyebrow': '💪 Para hombres 40+ que valoran su energía',
        'h1': 'Antes que <em>Viagra · arregla la causa.</em>',
        'lede': 'Si tu energía sexual no es lo que era · si tu erección es menos firme · si tu deseo bajó · 80% de las veces no es psicológico · es decline de hormona de crecimiento + circulación periférica + recuperación lenta. Hay stack específico antes de saltar a TRT o pastillas.',
        'problem_h2': '¿Te suena alguno?',
        'problem_lede': 'Patrón hombres 40-60 que llegan después de probar Viagra/Cialis sin resolver la causa raíz.',
        'problem_cards': [
            ('Erección menos firme que antes', 'Decline de óxido nítrico endotelial + circulación periférica. BPC-157 modula angiogénesis (formación vasos nuevos) · efecto documentado en regeneración vascular.'),
            ('Energía pareja baja · libido', 'GH afecta directamente libido (ejes hipotalámicos) y energía mitocondrial. CJC+Ipa restaura pulso GH nocturno · efecto en libido reportado a 4-6 semanas.'),
            ('Recuperación post-actividad lenta', 'Tiempo refractario aumentado · indicador de decline hormonal multifactorial. Stack de GH + recuperación tisular lo acelera.'),
            ('Tomé Viagra · funciona pero no es lo mismo', 'Viagra resuelve síntoma agudo pero no la causa. Si necesitas pastilla siempre, eres candidato a stack regenerativo · ataca la fisiología subyacente.'),
        ],
        'stack_name': 'Performance · Function Stack',
        'stack_desc': 'Stack pre-TRT / pre-pastillas para hombres 40-60. CJC+Ipamorelin (GH nocturno fisiológico) + BPC-157 (angiogénesis + recuperación). 8-12 semanas · efecto sostenido · sin dependencia de pastillas.',
        'stack_items': [
            ('CJC+Ipamorelin 10mg', 'GH stack nocturno · pulso fisiológico sin cortisol · libido + energía · 200-400mcg pre-sueño'),
            ('BPC-157 10mg', 'Body Protection Compound · angiogénesis · circulación periférica · neuroprotección · 250-500mcg 2×/día'),
            ('+ Agua bact + kit', 'Agua USP + jeringas + guía protocolo 8-12 semanas'),
        ],
        'stack_price': '$8,498',
        'stripe_link': 'https://buy.stripe.com/3cI8xa9qN52V58o8wIbZK03',  # Performance stack
        'science_h4': 'Por qué este stack antes de TRT o pastillas',
        'science_body': 'Decline en función sexual masculina 40+ es multifactorial: GH/IGF-1 decline (50% a 50 años) afecta libido y energía · óxido nítrico endotelial decline afecta erección · circulación periférica decline afecta sensibilidad. Viagra/Cialis (PDE5 inhibitors) resuelven SOLO el síntoma agudo de erección · NO trabajan la causa. CJC+Ipamorelin restaura el pulso GH nocturno fisiológico (sin cortisol spike, sin supresión hipotalámica). BPC-157 documentado para angiogénesis (Sikiric et al. 2010+) · forma vasos nuevos, mejora circulación periférica · efecto sostenido. Stack es la opción más fisiológica antes de saltar a TRT exógeno (que suprime tu eje natural) o dependencia de pastillas.',
        'science_cite': 'Sikiric P et al. Curr Pharm Des 2010 · Sigalos JT Sex Med Rev 2018 · Falutz J NEJM 2010',
        'faq': [
            ('¿Cuándo se siente?', 'CJC+Ipa: energía + sueño profundo desde semana 1 · libido se nota a 4-6 sem. BPC-157: angiogénesis y circulación visible a 6-8 semanas con efecto sostenido.'),
            ('¿Sustituye a Viagra/Cialis?', 'Para muchos sí, después de 8-12 sem. Para otros, stack reduce frecuencia de uso de pastillas. NO es "Viagra natural" inmediato · es stack regenerativo de causa raíz.'),
            ('¿Y si ya estoy en TRT?', 'Compatible. Muchos combinan TRT + GH peptídico para body recomp + libido. Requiere monitoreo lipid + glucose con tu endocrinólogo.'),
            ('¿Es legal?', 'Research-grade · for research use only · no aprobado por COFEPRIS para uso humano. Marco legal de productos para investigación científica. Tu uso es responsabilidad personal.'),
            ('¿Necesito médico?', 'Recomendado · especialmente si combinas con TRT, anticoagulantes o medicamentos cardiovasculares. Te referimos a médico aliado si no tienes.'),
        ],
    },
}


def render_problem_cards(cards):
    return '\n'.join(
        f'<div class="problem-card"><h3>{title}</h3><p>{body}</p></div>'
        for title, body in cards
    )


def render_stack_items(items):
    return '\n'.join(
        f'<div class="stack-item"><div class="nm">{nm}</div><div class="role">{role}</div></div>'
        for nm, role in items
    )


def render_faq(faqs):
    return '\n'.join(
        f'<details><summary>{q}</summary><p>{a}</p></details>'
        for q, a in faqs
    )


for slug, cfg in PAGES.items():
    html = TPL
    html = html.replace('{{TITLE}}', cfg['title'])
    html = html.replace('{{META_DESC}}', cfg['meta_desc'])
    html = html.replace('{{SLUG}}', slug + '.html')
    html = html.replace('{{EYEBROW}}', cfg['eyebrow'])
    html = html.replace('{{H1}}', cfg['h1'])
    html = html.replace('{{LEDE}}', cfg['lede'])
    html = html.replace('{{PROBLEM_H2}}', cfg['problem_h2'])
    html = html.replace('{{PROBLEM_LEDE}}', cfg['problem_lede'])
    html = html.replace('{{PROBLEM_CARDS}}', render_problem_cards(cfg['problem_cards']))
    html = html.replace('{{STACK_NAME}}', cfg['stack_name'])
    html = html.replace('{{STACK_NAME_URL}}', cfg['stack_name'].replace(' ', '%20'))
    html = html.replace('{{STACK_DESC}}', cfg['stack_desc'])
    html = html.replace('{{STACK_ITEMS}}', render_stack_items(cfg['stack_items']))
    html = html.replace('{{STACK_PRICE}}', cfg['stack_price'])
    html = html.replace('{{STRIPE_LINK}}', cfg['stripe_link'])
    html = html.replace('{{SCIENCE_H4}}', cfg['science_h4'])
    html = html.replace('{{SCIENCE_BODY}}', cfg['science_body'])
    html = html.replace('{{SCIENCE_CITE}}', cfg['science_cite'])
    html = html.replace('{{FAQ_ITEMS}}', render_faq(cfg['faq']))

    out = ROOT / f'{slug}.html'
    out.write_text(html, encoding='utf-8')
    print(f'✅ {out.name}')

print('\n🎉 4 landing pages built. Deploy with: netlify deploy --prod')
