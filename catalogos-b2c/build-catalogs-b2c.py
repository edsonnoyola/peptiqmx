#!/usr/bin/env python3
"""
PEPTIQ Catalog Generator
Genera 5 catálogos premium (Wolverine · Highlander · Prime · Shred · Spa)
Catálogos B2C · enfoque consumidor final · biohackers · ejecutivos · wellness premium personal.
"""
import os, re, subprocess, sys
from pathlib import Path

ROOT = Path('/Users/end/Desktop/tdi-peptidos/peptiqmx/catalogos-b2c')
TEMPLATE = ROOT / 'PEPTIQ-GLOW-B2C-2026.html'
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
sys.path.insert(0, str(ROOT))
from category_deep_content import DEEP

# Category configurations
CATEGORIES = {
    'WOLVERINE': {
        'title': 'La ciencia de la',
        'title_em': 'reparación tisular.',
        'cover_lede': 'La línea para volver a entrenar después de una lesión que normalmente tomaría meses. Atletas amateurs, biohackers y profesionales que cuidan su cuerpo como un activo. Con COA Janoshik público por lote.',
        'line_intro_title': 'Recuperación tisular',
        'line_intro_title_em': 'avanzada.',
        'line_intro_lede': 'BPC-157, TB-500 y KPV son los péptidos que la medicina deportiva profesional usa para reparar tendones, ligamentos y mucosa gástrica. Hoy disponibles para tu uso personal con la misma trazabilidad clínica.',
        'line_eyebrow': 'Línea WOLVERINE · Para tu recuperación',
        'category_name': 'Wolverine',
        'target': 'atletas amateurs, biohackers, profesionales 30-55 con lesiones crónicas o post-cirugía',
        'euromonitor_lever_1': ('Por qué los atletas profesionales lo usan', 'BPC-157 acelera recuperación de tendón en 40-60% según literatura preclínica. Lo que en medicina convencional toma 6-9 meses (tendinitis, ligamento parcial, mucosa gástrica), con protocolo péptido baja a 6-12 semanas. No es magia — es bioseñal.'),
        'euromonitor_lever_2': ('BPC-157 · 1,200+ estudios desde 1991', 'Aislado del jugo gástrico humano por el Prof. Sikiric en Zagreb. Estimula angiogénesis (formación de vasos nuevos en sitio de lesión), modula inflamación sin afectar inmunidad. El péptido reparador más documentado en literatura científica.'),
        'euromonitor_lever_3': ('TB-500 · Para músculo y tejido profundo', 'Fragmento de Timosina Beta-4 (péptido endógeno). Activa migración celular para reparar lesiones musculares profundas, tejido cardiaco y conectivo. Combinado con BPC-157 cubre las dos vías de regeneración: vascular y celular.'),
        'products': [
            {'name':'BPC-157', 'dose':'10mg', 'price':2999, 'subtitle':'Body Protection Compound · gold standard', 'image':'products-v2/bpc-157-studio.png', 'category':'Pentadecapeptide · 10mg',
             'desc':'BPC-157 (Body Protection Compound) es un fragmento pentadecapéptido derivado de una proteína del jugo gástrico humano. 1,200+ estudios preclínicos desde 1991. Referente absoluto en regeneración de tejido blando, reparación intestinal y neuroprotección.',
             'mech':'Acelera angiogénesis vía VEGFR2 y FGF1 · incrementa óxido nítrico endotelial · estimula migración de fibroblastos · efecto neuroprotector documentado · modula eje gut-brain · protege mucosa gastrointestinal contra úlceras.',
             'applications':'• Lesiones tendinosas crónicas (tendinitis · epicondilitis · fascitis plantar)<br>• Recuperación post-cirugía ortopédica y deportiva<br>• Síndrome de intestino permeable · colitis · úlceras gástricas<br>• Post-operatorio de ginecología y urología<br>• Neuroprotección en pacientes con trauma cerebral leve',
             'dose_research':'250-500mcg 2×/día', 'route':'SC local + sistémica', 'duration':'4-6 semanas', 'purity':'99.654% verificada'},
            {'name':'TB-500', 'dose':'10mg', 'price':3799, 'subtitle':'Thymosin Beta-4 fragment · cell migration', 'image':'products-v2/tb-500-studio.png', 'category':'Thymosin Fragment · 10mg',
             'desc':'Fragmento sintético del Thymosin Beta-4 (TB4) · proteína abundante en plaquetas y secreciones. Único mecanismo: promueve migración de células progenitoras al sitio de daño · complementa perfectamente la angiogénesis de BPC-157.',
             'mech':'Secuestra G-actina libre · regula polimerización F-actina del citoesqueleto · activa macrófagos M2 pro-reparadores · reduce TNF-α e IL-6 · promueve migración de fibroblastos y células endoteliales · upregula factor de crecimiento VEGF.',
             'applications':'• Lesiones musculares agudas y crónicas (desgarros · contracturas)<br>• Post-cirugía cardíaca (mejora función ventricular)<br>• Cicatrización de heridas crónicas y úlceras de presión<br>• Lesiones de ligamento cruzado · meniscales<br>• Recuperación atlética de alto rendimiento',
             'dose_research':'2-5mg 2×/semana', 'route':'Subcutánea', 'duration':'6-8 semanas', 'purity':'99.328% verificada'},
            {'name':'KPV', 'dose':'10mg', 'price':2899, 'subtitle':'α-MSH tripeptide · anti-inflammatory', 'image':'products-v2/kpv-studio.png', 'category':'Tripeptide · 10mg',
             'desc':'Tripéptido Lys-Pro-Val · fragmento C-terminal del α-MSH. Único por su dualidad antiinflamatoria sin efecto inmunosupresor. Ideal complemento de BPC-157 cuando hay componente inflamatorio intestinal o dérmico.',
             'mech':'Inhibe activación de NF-κB en células epiteliales · reduce IL-1β, IL-6, TNF-α localmente · efecto antimicrobiano selectivo contra C. albicans y S. aureus · modula receptor MC1R en piel e intestino · sin supresión inmune sistémica.',
             'applications':'• Colitis ulcerativa · enfermedad de Crohn (off-label research)<br>• Acné inflamatorio severo · hidradenitis supurativa<br>• Dermatitis atópica recalcitrante<br>• SIBO y disbiosis intestinal<br>• Protocolos de recuperación con componente inflamatorio',
             'dose_research':'500-1000mcg 2-3×/día', 'route':'Oral (GI) · SC (sistémica)', 'duration':'3-4 semanas', 'purity':'99%+ verificada'},
            {'name':'NAD+', 'dose':'1000mg', 'price':5499, 'subtitle':'Mitocondrial fuel · 500+ reactions', 'image':'products-v2/nad-plus-studio.png', 'category':'Nicotinamide Adenine Dinucleotide · 1000mg',
             'desc':'NAD+ es la coenzima más abundante del cuerpo humano · cofactor esencial de 500+ reacciones metabólicas. En protocolos de recuperación acelera síntesis de ATP y repara daño DNA por estrés oxidativo post-cirugía o entrenamiento.',
             'mech':'Activa 7 sirtuinas (SIRT1-SIRT7) reguladoras de longevidad · precursor para reparación DNA vía PARP · cofactor de complejo I mitocondrial · restaura ratio NAD:NADH para producción óptima ATP · acelera biogénesis mitocondrial.',
             'applications':'• Recuperación post-cirugía mayor (cardiovascular · ortopédica)<br>• Fatiga crónica post-entrenamiento intenso<br>• Protocolo athletic longevity premium<br>• Neuroprotección post-TBI (traumatismo cerebral)<br>• Enfermedades mitocondriales y fatiga adrenal',
             'dose_research':'250-1000mg IV/SC', 'route':'IV drip · SC', 'duration':'14 días reconstituido', 'purity':'99.500% verificada'},
            {'name':'GHK-Cu', 'dose':'100mg', 'price':3799, 'subtitle':'Copper tripeptide · tissue remodeling', 'image':'products-v2/ghk-cu-studio.png', 'category':'Copper Tripeptide · 100mg',
             'desc':'Glycyl-Histidyl-Lysyl-Cu²⁺ · el péptido más estudiado en dermatología regenerativa desde 1973. En protocolos Wolverine complementa cicatrización de heridas quirúrgicas · acelera remodelación de cicatrices · efecto antioxidante nivel farmacéutico.',
             'mech':'Activa síntesis colágeno I/III vía SPARC y decorina · inhibe metaloproteinasas (MMPs) que degradan matriz extracelular · efecto antioxidante vía SOD · estimula angiogénesis cutánea · acelera remodelación tisular post-herida.',
             'applications':'• Cicatrización post-cirugía estética · ortopédica<br>• Remodelación de cicatrices hipertróficas y queloides<br>• Post-quemaduras · post-injertos cutáneos<br>• Complemento a protocolos de recuperación facial post-procedimiento<br>• Stack con TRINITY para regeneración dérmica integral',
             'dose_research':'1-2mg SC local', 'route':'SC · mesoterapia', 'duration':'90 días refrigerado', 'purity':'99%+ verificada'},
        ],
        'stack_1_name':'🐺 Wolverine Stack', 'stack_1_tag':'Wolverine · 4-8 semanas', 'stack_1_price':5499,
        'stack_1_title':'Recuperación tisular','stack_1_title_em':'total.',
        'stack_1_desc':'Protocolo integral de recuperación 4-8 semanas · enfoque en tendón, ligamento y post-operatorio · la combinación gold standard.',
        'stack_1_comp_1_name':'BPC-157 10mg','stack_1_comp_1_desc':'Angiogénesis + reparación vascular',
        'stack_1_comp_2_name':'TB-500 10mg','stack_1_comp_2_desc':'Migración celular + remodelación actina',
        'stack_1_comp_3_name':'+ Agua Bact. + Kit','stack_1_comp_3_desc':'Reconstitución + jeringas + guía',
        'stack_1_subtitle':'Protocolo 4-8 semanas · 2 viales principales + starter kit · ahorra $799 vs compra individual',
        'stack_1_save':'MXN · ahorras $799 vs individual',
        'stack_2_name':'💪 Wolverine PRO', 'stack_2_tag':'Wolverine PRO · 8-12 semanas', 'stack_2_price':6999,
        'stack_2_title':'Protocolo extendido','stack_2_title_em':'pro athletes.',
        'stack_2_desc':'Stack avanzado 8-12 semanas · viales separados para flexibilidad de dosis · ideal atletas élite y lesiones crónicas.',
        'stack_2_comp_1_name':'BPC-157 + TB-500','stack_2_comp_1_desc':'Viales separados · dosis flexible',
        'stack_2_comp_2_name':'+ 2× Agua Bact.','stack_2_comp_2_desc':'Reconstitución fases 1 y 2',
        'stack_2_comp_3_name':'+ Protocolo 1-on-1','stack_2_comp_3_desc':'Specialist asignado · follow-up mensual',
        'stack_2_subtitle':'Ideal lesiones crónicas 3+ meses · post-cirugía mayor · protocolo fases diferenciadas',
        'stack_2_save':'MXN · ahorras $889 vs individual',
    },
    'HIGHLANDER': {
        'title': 'La ciencia de la',
        'title_em': 'longevidad celular.',
        'cover_lede': 'Para quien decidió que la próxima década no se vea como la última. Péptidos para reset mitocondrial, telómeros y energía celular. La longevidad como protocolo personal, no como esperanza.',
        'line_intro_title': 'Biological age',
        'line_intro_title_em': 'reversal.',
        'line_intro_lede': 'Línea NAD+, Epithalon y moduladores mitocondriales. Diseñada para protocolos de longevidad sistémica, reactivación de telomerasa y optimización metabólica.',
        'line_eyebrow': 'Línea HIGHLANDER · Longevity',
        'category_name': 'Highlander',
        'target': 'profesionales 35-65 con foco en biological age, mitocondria y energía sostenida',
        'euromonitor_lever_1': ('Lever #1 · Pivote global anti-aging → longevity', 'L\'Oréal rebrandeó Lancôme × Timeline como "mitochondrial skincare". Biotherm pivotó a "functional hydration". El mercado abandonó "anti-aging" · las clínicas que siguen con esa narrativa pierden 30% en willingness-to-pay (Euromonitor Beauty Survey 2025).'),
        'euromonitor_lever_2': ('Lever #2 · NAD+ y sirtuinas · ingrediente #4 más solicitado', 'NAD+ supplements crecen +6% CAGR. Richard Branson, Jeff Bezos y David Sinclair han puesto al NAD+ en el mapa mainstream. Clínicas que ofrecen IV drips NAD+ facturan +$120k USD/año solo con esta modalidad.'),
        'euromonitor_lever_3': ('Lever #3 · Epithalon · gap de mercado', 'Telomerase reactivation · único péptido con evidencia preclínica de elongación telomérica. Gap de mercado en MX: competencia casi nula. Clínicas pioneras posicionadas como "longevity specialists" premium.'),
        'products': [
            {'name':'NAD+', 'dose':'1000mg', 'price':5499, 'subtitle':'Combustible mitocondrial · 500+ reacciones', 'image':'products-v2/nad-plus-studio.png', 'category':'Nicotinamide Adenine Dinucleotide · 1000mg',
             'desc':'NAD+ declina aprox. 50% entre 40 y 60 años. Reposición parenteral se convirtió en pilar de longevity clinics globalmente. El protocolo IV drip PEPTIQ se usa en las clínicas de mayor ticket en México.',
             'mech':'Activa las 7 sirtuinas (SIRT1-SIRT7) · precursor reparación DNA vía PARP · cofactor complejo I mitocondrial · restaura ratio NAD:NADH · acelera biogénesis mitocondrial · modula expresión génica de longevidad.',
             'applications':'• IV drip longevity (500mg-1g · 2-4×/mes)<br>• Fatiga crónica post-COVID · Long COVID<br>• Deterioro cognitivo leve · neurodegenerativas<br>• Biological age reversal protocol<br>• Pre y post cirugía como acelerador regenerativo',
             'dose_research':'250-1000mg IV/SC', 'route':'IV drip · SC', 'duration':'14 días refrig.', 'purity':'99.500% verificada'},
            {'name':'Epithalon', 'dose':'50mg', 'price':6799, 'subtitle':'Telomerase reactivation · AEDG tetrapeptide', 'image':'products-v2/epithalon-studio.png', 'category':'Tetrapeptide AEDG · 50mg',
             'desc':'Ala-Glu-Asp-Gly · desarrollado por Dr. Vladimir Khavinson en St. Petersburg Institute of Bioregulation. Único péptido con evidencia preclínica de reactivación de telomerasa humana · referente en longevity research.',
             'mech':'Reactiva expresión telomerasa (hTERT) · elonga telómeros en células somáticas · restaura ritmo circadiano de melatonina pineal · modula expresión génica longevidad · efecto documentado sobre sueño profundo y recuperación neuroendocrina.',
             'applications':'• Ciclo Khavinson 10-ON/20-OFF · 3-6 ciclos anuales<br>• Restauración sueño profundo pacientes 50+<br>• Programa biological age reversal premium<br>• Stack longevity con NAD+<br>• Disautonomía · trastornos del ritmo circadiano',
             'dose_research':'5-10mg SC nocturno', 'route':'SC nocturna', 'duration':'10 días on · 20 off', 'purity':'99%+ verificada'},
            {'name':'GHK-Cu', 'dose':'100mg', 'price':3799, 'subtitle':'Copper tripeptide · mitochondrial modulator', 'image':'products-v2/ghk-cu-studio.png', 'category':'Copper Tripeptide · 100mg',
             'desc':'GHK-Cu no solo es dérmico · tiene efectos sistémicos profundos sobre expresión génica. Upregula 4,192 genes de reparación tisular · downregula 1,876 genes pro-inflamatorios · el perfil más anti-aging sistémico documentado en péptidos.',
             'mech':'Activa síntesis colágeno I/III (matriz extracelular) · modula 4,192 genes de reparación · inhibe p16/p21 (senescencia) · restaura función de células madre · efecto antioxidante superior a vitamina C y E combinadas (modelos in vitro).',
             'applications':'• Complemento IV drip longevity<br>• Protocolo dérmico-sistémico integrado<br>• Medicina regenerativa con enfoque epigenético<br>• Stack NAD+ + Epithalon + GHK-Cu<br>• Pre-hormoneroplacement therapy en mujeres 45+',
             'dose_research':'1-2mg SC/día', 'route':'SC · IV (compounding)', 'duration':'90 días refrig.', 'purity':'99%+ verificada'},
            {'name':'BPC-157', 'dose':'10mg', 'price':2999, 'subtitle':'Systemic regeneration · neuroprotection', 'image':'products-v2/bpc-157-studio.png', 'category':'Pentadecapeptide · 10mg',
             'desc':'En protocolos longevity, BPC-157 se integra por su efecto sistémico: neuroprotección, reparación de mucosa gastrointestinal (clave en inflamación crónica de bajo grado) y modulación del eje gut-brain.',
             'mech':'Angiogénesis vía VEGFR2 · neuroprotección (upregula BDNF y GDNF) · restaura permeabilidad intestinal · modula microbiota · estimula células madre · efecto documentado sobre recuperación post-daño cerebral leve.',
             'applications':'• Longevity stack + NAD+ · efecto sinérgico<br>• Pacientes con inflamación intestinal crónica<br>• Protocolo post-TBI leve · post-concusión<br>• Estrés crónico con síntomas GI<br>• Preparación pre-ayuno prolongado',
             'dose_research':'250-500mcg 2×/día', 'route':'SC · oral (GI)', 'duration':'4-6 semanas', 'purity':'99.654% verificada'},
            {'name':'Semax', 'dose':'10mg', 'price':2899, 'subtitle':'ACTH-derived nootropic · BDNF upregulation', 'image':'products-v2/semax-studio.png', 'category':'Heptapeptide · 10mg',
             'desc':'Derivado sintético del ACTH (4-10) desarrollado en Rusia · aprobado oficialmente para uso clínico en Rusia desde los 80s. Nootrópico con efecto directo sobre BDNF y NGF · referente en neuroprotección peptídica longevity.',
             'mech':'Aumenta BDNF (Brain-Derived Neurotrophic Factor) · incrementa NGF (Nerve Growth Factor) · modula sistema dopaminérgico y serotoninérgico · efecto neuroprotector documentado en stroke · mejora plasticidad sináptica.',
             'applications':'• Protocolo deterioro cognitivo leve (MCI)<br>• Prevención Alzheimer familiar (antecedentes)<br>• Performance cognitiva ejecutivos C-suite<br>• Post-stroke · recuperación neurológica<br>• Complemento a programa biological age',
             'dose_research':'200-600mcg intranasal', 'route':'Intranasal', 'duration':'14-21 días ciclos', 'purity':'99%+ verificada'},
        ],
        'stack_1_name':'🕰️ Highlander Longevity', 'stack_1_tag':'Highlander · 12 semanas', 'stack_1_price':14999,
        'stack_1_title':'Biological age','stack_1_title_em':'reversal protocol.',
        'stack_1_desc':'Protocolo sistémico 12 semanas · activa sirtuinas · restaura mitocondria · elonga telómeros · resultado medible con biomarcadores biológicos.',
        'stack_1_comp_1_name':'NAD+ 1000mg','stack_1_comp_1_desc':'Combustible mitocondrial',
        'stack_1_comp_2_name':'Epithalon 50mg','stack_1_comp_2_desc':'Telomerase reactivation',
        'stack_1_comp_3_name':'GHK-Cu 100mg','stack_1_comp_3_desc':'Modulador génico · dérmico',
        'stack_1_subtitle':'12 semanas · 3 viales principales + 3× agua bact + protocolo Khavinson + seguimiento mensual',
        'stack_1_save':'MXN · ahorras $2,768 vs individual',
        'stack_2_name':'⚡ Neuro Focus Stack', 'stack_2_tag':'Neuro · 6 semanas', 'stack_2_price':8999,
        'stack_2_title':'Cognitive','stack_2_title_em':'longevity.',
        'stack_2_desc':'Protocolo cognitivo 6 semanas · nootropic + telomerase · ideal ejecutivos · pacientes MCI · prevención neurodegenerativa.',
        'stack_2_comp_1_name':'Semax 10mg','stack_2_comp_1_desc':'BDNF + nootropic intranasal',
        'stack_2_comp_2_name':'Epithalon 50mg','stack_2_comp_2_desc':'Circadian + telomerase',
        'stack_2_comp_3_name':'+ 2× Agua + Kit','stack_2_comp_3_desc':'Reconstitución + guía protocolo',
        'stack_2_subtitle':'6 semanas · stack cognitivo completo · follow-up con evaluación neuropsicológica recomendada',
        'stack_2_save':'MXN · ahorras $1,679 vs individual',
    },
    'PRIME': {
        'title': 'La ciencia del',
        'title_em': 'rendimiento.',
        'cover_lede': 'El estado en el que todo se alinea: composición corporal, recuperación, energía y libido al nivel de los 25. Péptidos que reactivan el GH endógeno sin tocar tu eje hormonal. Para hombres y mujeres 35+ que entrenan en serio.',
        'line_intro_title': 'GH optimization,',
        'line_intro_title_em': 'composición corporal.',
        'line_intro_lede': 'Línea de secretagogos de hormona de crecimiento · Ipamorelin · CJC-1295 · Tesamorelin. Para protocolos de optimización metabólica, composición corporal y performance en pacientes maduros.',
        'line_eyebrow': 'Línea PRIME · Performance',
        'category_name': 'Prime',
        'target': 'hombres y mujeres 35+ que entrenan, biohackers, ejecutivos en optimización personal',
        'euromonitor_lever_1': ('Lever #1 · Hombres 40+ · mercado en expansión', 'Euromonitor: el segmento wellness hombre 40-65 creció +22% en los últimos 2 años. Performance y composición corporal pasaron de "vanidad" a "salud preventiva". Clínicas endocrinológicas premium facturan ticket 3× vs 2020.'),
        'euromonitor_lever_2': ('Lever #2 · Decline GH natural', 'La hormona de crecimiento declina aprox. 50% entre los 30 y 50 años. Los secretagogos peptídicos (CJC+Ipa · Tesamorelin) estimulan producción endógena · perfil de seguridad superior a HGH recombinante · regulatorio más favorable.'),
        'euromonitor_lever_3': ('Lever #3 · Tesamorelin · único con FDA', 'Tesamorelin es el único análogo de GHRH con aprobación FDA (Egrifta) para reducción de grasa visceral en pacientes HIV. Off-label: biohackers y clínicas performance lo usan para recomposición corporal pacientes 40+.'),
        'products': [
            {'name':'CJC+Ipamorelin', 'dose':'10mg', 'price':5499, 'subtitle':'GH Stack · nighttime reparation cascade', 'image':'products-v2/gh-stack-studio.png', 'category':'Growth Hormone Stack · 10mg blend',
             'desc':'Blend pre-mezclado CJC-1295 sin DAC + Ipamorelin. La combinación más solicitada por clínicas endocrinológicas por su efecto sinérgico: pulso GH más amplio + duración extendida · optimiza ciclo nocturno de reparación celular.',
             'mech':'CJC-1295 activa receptor GHRH (amplitud de pulso GH) · Ipamorelin activa receptor GHSR (frecuencia de pulso · sin efecto sobre cortisol) · efecto combinado produce pulso GH nocturno 3-5× vs baseline · mimetiza ritmo circadiano natural.',
             'applications':'• Composición corporal hombres 40+ (disminución grasa abdominal)<br>• Recuperación muscular atletas máster (40-55 años)<br>• Insomnio con despertar temprano · sueño profundo reducido<br>• Protocolo pre-terapia testosterona<br>• Wellness preventive para C-suite',
             'dose_research':'200-400mcg pre-sueño', 'route':'Subcutánea nocturna', 'duration':'4-6 semanas ciclos', 'purity':'99%+ verificada'},
            {'name':'Tesamorelin', 'dose':'10mg', 'price':7499, 'subtitle':'GHRH analog · visceral fat specialist', 'image':'products-v2/tesamorelin-studio.png', 'category':'GHRH-analog · 10mg',
             'desc':'Tesamorelin es análogo sintético del GHRH · aprobado por FDA (Egrifta) para lipodistrofia. Único secretagogo con efecto selectivo documentado sobre grasa visceral (peri-abdominal) · complemento ideal a Retatrutide en protocolo body recomposition.',
             'mech':'Activa receptor GHRH en hipófisis · estimula secreción endógena de GH con pulso fisiológico · incrementa IGF-1 dentro de rango normal · efecto selectivo sobre adipocitos viscerales vía lipólisis inducida por GH · preserva masa magra.',
             'applications':'• Grasa visceral resistente (andrópicos clásicos)<br>• Recomposición corporal pacientes 45+<br>• Stack con Retatrutide para sinergia GLP-1 + GH<br>• Lipodistrofia post-corticoides<br>• Performance cognitiva en pacientes con alto cortisol',
             'dose_research':'1-2mg SC/día', 'route':'Subcutánea diaria', 'duration':'8-12 semanas', 'purity':'99%+ verificada'},
            {'name':'Ipamorelin', 'dose':'10mg', 'price':2899, 'subtitle':'Selective GHRP · no cortisol spike', 'image':'products-v2/ipamorelin-studio.png', 'category':'Growth Hormone Releasing Peptide · 10mg',
             'desc':'Ipamorelin es el GHRP más selectivo del mercado · a diferencia de GHRP-2 y GHRP-6, no incrementa cortisol, prolactina ni ACTH. Perfil de seguridad superior · ideal para protocolos de largo plazo.',
             'mech':'Activa receptor GHSR (ghrelin receptor) selectivamente · induce pulso GH sin efecto sobre cortisol · no estimula hambre (diferencia clave vs GHRP-6) · efecto sobre frecuencia (no amplitud) de pulso GH.',
             'applications':'• Protocolo monoterapia pacientes sensibles a efectos secundarios<br>• Mujeres wellness 40+ (sin efectos sobre prolactina)<br>• Sueño profundo en pacientes con insomnio medio<br>• Recuperación muscular atletas jóvenes (25-35)<br>• Complemento a protocolos de pérdida de peso',
             'dose_research':'200-300mcg 2-3×/día', 'route':'Subcutánea', 'duration':'6-8 semanas', 'purity':'99%+ verificada'},
            {'name':'NAD+', 'dose':'1000mg', 'price':5499, 'subtitle':'Mitocondrial fuel · performance optimization', 'image':'products-v2/nad-plus-studio.png', 'category':'Nicotinamide Adenine Dinucleotide · 1000mg',
             'desc':'En protocolos PRIME, NAD+ se integra por su efecto sobre producción ATP y reparación DNA en pacientes con alto output físico o mental. IV drip pre-competencia o pre-sesión de high-intensity training.',
             'mech':'Activa sirtuinas (SIRT1-SIRT7) · cofactor mitocondrial · restaura NAD:NADH · acelera biogénesis mitocondrial · upregula genes reparación DNA · documentado en performance atlético de alto rendimiento.',
             'applications':'• IV drip pre-competencia (atletas máster)<br>• Ejecutivos C-suite jet-lag y fatiga cognitiva<br>• Recuperación post-entrenamiento alta intensidad<br>• Stack con CJC+Ipa para full reparación nocturna<br>• Adyuvante en protocolos anti-aging performance',
             'dose_research':'250-1000mg IV/SC', 'route':'IV drip · SC', 'duration':'14 días refrig.', 'purity':'99.500% verificada'},
            {'name':'BPC-157', 'dose':'10mg', 'price':2999, 'subtitle':'Systemic repair · injury prevention', 'image':'products-v2/bpc-157-studio.png', 'category':'Pentadecapeptide · 10mg',
             'desc':'En protocolos PRIME, BPC-157 previene lesiones sub-clínicas por entrenamiento intenso y acelera recuperación entre sesiones. Complemento esencial del stack GH en pacientes atléticos.',
             'mech':'Angiogénesis · migración fibroblastos · reparación tendón y ligamento · modulación inflamación sistémica · protección mucosa intestinal (clave en atletas con GI distress).',
             'applications':'• Prevención lesiones en atletas máster<br>• Recuperación acelerada entre sesiones HIIT<br>• Tendinosis crónica (epicondilitis · Aquiles)<br>• Complemento a Tesamorelin en protocolo body recomp<br>• GI distress en atletas endurance',
             'dose_research':'250-500mcg 2×/día', 'route':'SC local + sistémica', 'duration':'4-6 semanas', 'purity':'99.654% verificada'},
        ],
        'stack_1_name':'⚡ TITAN Stack', 'stack_1_tag':'TITAN · Performance · 12 semanas', 'stack_1_price':14999,
        'stack_1_title':'Performance','stack_1_title_em':'completo.',
        'stack_1_desc':'Protocolo GH + metabolismo + mitocondrial · 12 semanas · optimiza composición corporal y rendimiento en pacientes 40+.',
        'stack_1_comp_1_name':'Tesamorelin 10mg','stack_1_comp_1_desc':'Grasa visceral · GH',
        'stack_1_comp_2_name':'Ipamorelin 10mg','stack_1_comp_2_desc':'Pulso GH selectivo nocturno',
        'stack_1_comp_3_name':'NAD+ 1000mg','stack_1_comp_3_desc':'Mitocondrial · cognitive',
        'stack_1_subtitle':'12 semanas · stack TITAN completo · 3 viales + 3× agua + protocolo personalizado + follow-up mensual',
        'stack_1_save':'MXN · ahorras $1,398 vs individual',
        'stack_2_name':'💪 GH Boost Stack', 'stack_2_tag':'GH Boost · Entry · 4 semanas', 'stack_2_price':5499,
        'stack_2_title':'GH Optimization','stack_2_title_em':'entry protocol.',
        'stack_2_desc':'Stack entry-level 4 semanas · GH optimization + sueño profundo · ideal primer ciclo PRIME · conversión a TITAN.',
        'stack_2_comp_1_name':'CJC+Ipa 10mg','stack_2_comp_1_desc':'Stack GH nocturno completo',
        'stack_2_comp_2_name':'+ Agua Bact.','stack_2_comp_2_desc':'Reconstitución USP estéril',
        'stack_2_comp_3_name':'+ Starter Kit','stack_2_comp_3_desc':'Jeringas + guía + calculadora dosis',
        'stack_2_subtitle':'4 semanas · ciclo entry · ideal primer paciente PRIME · conversión natural a TITAN o Highlander',
        'stack_2_save':'MXN · precio entry · sin stack ahorro',
    },
    'SHRED': {
        'title': 'La ciencia del',
        'title_em': 'cuerpo lean.',
        'cover_lede': 'El peso como variable controlada, no como destino. Triple agonistas GLP-1/GIP/glucagón, lipolíticos puros y moduladores metabólicos research-grade. La categoría que está reescribiendo lo que entendíamos por pérdida de peso.',
        'line_intro_title': 'GLP-1 beyond',
        'line_intro_title_em': 'weight loss.',
        'line_intro_lede': 'Línea Retatrutide, Tirzepatide y moduladores metabólicos. Diseñada para clínicas de obesidad que buscan diferenciación vs Ozempic · mejor eficacia · preservación muscular · ticket premium.',
        'line_eyebrow': 'Línea SHRED · GLP-1 Evolution',
        'category_name': 'Shred',
        'target': 'personas con sobrepeso o composición corporal subóptima · 30-65 años · que ya probaron lo convencional',
        'euromonitor_lever_1': ('Lever #1 · 9% de la población global en GLP-1', 'Euromonitor: 14% en Norteamérica toma GLP-1 formal. Kate Farms acaba de lanzar una línea exclusiva para usuarios Ozempic · el mercado reconoce el gap de soporte muscular en esta población · oportunidad para clínicas pioneras.'),
        'euromonitor_lever_2': ('Lever #2 · Retatrutide · la nueva generación', 'Triple agonista GLP-1/GIP/Glucagón · fase 3 clínica muestra -24% pérdida peso en 48 semanas vs -15% Ozempic. Las clínicas que lo integren first como "research alternative" capturan el segmento premium del GLP-1 market.'),
        'euromonitor_lever_3': ('Lever #3 · Muscle preservation · el gap', 'Usuarios GLP-1 pierden 20-30g proteína muscular/día (Euromonitor). 90-120g proteína diaria recomendada para mujeres en Ozempic vs 70-90g normal. BPC-157 + Tesamorelin cierran el gap de preservación muscular.'),
        'products': [
            {'name':'Retatrutide', 'dose':'30mg', 'price':12999, 'subtitle':'Triple GLP-1/GIP/Glucagon · next-gen', 'image':'products-v2/retatrutide-studio.png', 'category':'Triple Agonist · 30mg',
             'desc':'Retatrutide es el agonista triple GLP-1/GIP/Glucagón más avanzado en desarrollo clínico (fase 3 · Eli Lilly). Superioridad documentada vs Ozempic: -24% peso en 48 semanas vs -15%. Un vial de 30mg dura 2-3 meses de protocolo completo.',
             'mech':'GLP-1: retarda vaciamiento gástrico + saciedad · GIP: sensibilidad insulínica + metabolismo lipídico · Glucagón: lipolisis + termogénesis · triple efecto sinérgico produce pérdida peso 60% superior a GLP-1 solo.',
             'applications':'• Obesidad grado 2-3 (BMI 35+)<br>• Pacientes que meseta-ron con Ozempic/Wegovy<br>• Diabetes tipo 2 con obesidad<br>• Protocolo SHRED PRO alternativa research a Ozempic<br>• Body recomposition severa (-20% peso corporal)',
             'dose_research':'2-12mg SC semanal', 'route':'Subcutánea semanal', 'duration':'15 semanas por vial', 'purity':'99%+ verificada'},
            {'name':'Tirzepatide', 'dose':'30mg', 'price':11999, 'subtitle':'Dual GLP-1/GIP · Mounjaro alternative', 'image':'products-v2/tirzepatide-studio.png', 'category':'Dual Agonist · 30mg',
             'desc':'Agonista dual GLP-1/GIP · versión research-grade del Mounjaro/Zepbound de Eli Lilly (aprobado FDA). Alternativa cuando pacientes no pueden acceder al producto farmacéutico · ticket ~60% menor.',
             'mech':'GLP-1 + GIP en un solo péptido · efecto más potente que semaglutida · efecto sobre sensibilidad insulínica superior · pérdida peso -21% en 72 semanas en fase 3 · menos efectos GI vs Ozempic.',
             'applications':'• Pacientes con resistencia a semaglutida<br>• Alternativa research cuando Mounjaro no accesible<br>• Protocolo obesidad + diabetes tipo 2<br>• Puente para transición a Retatrutide<br>• Estudio de respuesta GLP-1 individual',
             'dose_research':'2.5-15mg SC semanal', 'route':'Subcutánea semanal', 'duration':'12-15 semanas por vial', 'purity':'99%+ verificada'},
            {'name':'Tesamorelin', 'dose':'10mg', 'price':7499, 'subtitle':'Visceral fat specialist · muscle preservation', 'image':'products-v2/tesamorelin-studio.png', 'category':'GHRH-analog · 10mg',
             'desc':'Tesamorelin es el stack obligatorio con Retatrutide o Tirzepatide · su efecto sobre grasa visceral complementa la pérdida de peso general · y crucialmente · preserva masa magra que los GLP-1 tienden a consumir.',
             'mech':'Activa GHRH → pulso fisiológico GH → lipólisis selectiva sobre grasa visceral · preserva proteína muscular · mejora perfil lipídico · mantiene IGF-1 en rango normal · efecto complementario al GLP-1.',
             'applications':'• Stack obligatorio con Retatrutide/Tirzepatide<br>• Pacientes con grasa visceral resistente<br>• Protocolo SHRED PRO · preservación muscular<br>• Post-bariátrica con pérdida magra<br>• Andropausia con obesidad central',
             'dose_research':'1-2mg SC/día', 'route':'Subcutánea diaria', 'duration':'8-12 semanas', 'purity':'99%+ verificada'},
            {'name':'BPC-157', 'dose':'10mg', 'price':2999, 'subtitle':'GI protection · muscle preservation', 'image':'products-v2/bpc-157-studio.png', 'category':'Pentadecapeptide · 10mg',
             'desc':'En protocolos SHRED, BPC-157 es el complemento anti-catabólico por excelencia · previene pérdida muscular inducida por GLP-1 · repara mucosa gastrointestinal dañada por náuseas · estabiliza eje gut-brain durante pérdida de peso rápida.',
             'mech':'Protege mucosa GI contra efectos GLP-1 (náuseas · gastroparesis) · acelera regeneración muscular · modula inflamación sistémica · efecto directo sobre preservación de proteína muscular · upregula IGF-1 local.',
             'applications':'• Stack obligatorio con Retatrutide para preservar músculo<br>• Náuseas y gastroparesis inducida por GLP-1<br>• Pacientes con pérdida peso rápida (-10% en 2 meses)<br>• Complemento post-bariátrica<br>• Recuperación muscular en sesiones deportivas durante déficit',
             'dose_research':'500mcg 2×/día', 'route':'SC · oral (GI)', 'duration':'8-12 semanas', 'purity':'99.654% verificada'},
            {'name':'Ipamorelin', 'dose':'10mg', 'price':2899, 'subtitle':'GH optimization · hunger modulation', 'image':'products-v2/ipamorelin-studio.png', 'category':'Growth Hormone Releasing Peptide · 10mg',
             'desc':'En protocolos SHRED, Ipamorelin preserva masa muscular durante déficit calórico · mejora calidad del sueño (afectado por pérdida peso rápida) · sin efecto sobre cortisol o hambre (no antagoniza GLP-1).',
             'mech':'GHRP selectivo · induce pulso GH sin cortisol · preserva masa magra durante déficit · mejora sueño profundo · no estimula hambre (clave durante GLP-1) · apoyo mitocondrial.',
             'applications':'• Preservación muscular durante protocolo Retatrutide<br>• Insomnio secundario a pérdida peso<br>• Protocolo post-meseta GLP-1<br>• Mujeres 45+ con GLP-1 + pérdida colágeno<br>• Stack con Tesamorelin para efecto GH doble',
             'dose_research':'200-300mcg 2-3×/día', 'route':'Subcutánea', 'duration':'6-8 semanas', 'purity':'99%+ verificada'},
        ],
        'stack_1_name':'🔥 SHRED Stack', 'stack_1_tag':'SHRED · 12 semanas', 'stack_1_price':12999,
        'stack_1_title':'GLP-1 next','stack_1_title_em':'generation.',
        'stack_1_desc':'Protocolo GLP-1 de siguiente generación · 12 semanas · Retatrutide + soporte GI · alternativa research a Ozempic.',
        'stack_1_comp_1_name':'Retatrutide 30mg','stack_1_comp_1_desc':'Triple GLP-1/GIP/Glucagón',
        'stack_1_comp_2_name':'+ 2× Agua Bact.','stack_1_comp_2_desc':'Reconstitución fases largas',
        'stack_1_comp_3_name':'+ Protocolo','stack_1_comp_3_desc':'Titración Fase 1-4 · follow-up',
        'stack_1_subtitle':'12 semanas · Retatrutide vial completo (dura 3 meses) + agua + protocolo titración',
        'stack_1_save':'MXN · 1 vial = 15 semanas de protocolo',
        'stack_2_name':'🔥 SHRED PRO', 'stack_2_tag':'SHRED PRO · 16 semanas · muscle preservation', 'stack_2_price':14999,
        'stack_2_title':'Pérdida grasa +','stack_2_title_em':'preservación muscular.',
        'stack_2_desc':'Protocolo premium 16 semanas · cierra gap muscle loss de GLP-1 · Retatrutide + Ipamorelin + BPC · resultados superiores a Ozempic solo.',
        'stack_2_comp_1_name':'Retatrutide 30mg','stack_2_comp_1_desc':'Pérdida peso -24% en 1 año',
        'stack_2_comp_2_name':'Ipamorelin 10mg','stack_2_comp_2_desc':'Preservación masa magra',
        'stack_2_comp_3_name':'BPC-157 + 3× Agua','stack_2_comp_3_desc':'Reparación GI + sistémica',
        'stack_2_subtitle':'16 semanas · stack completo body recomp · ideal pacientes que busquen perder >10% peso con preservación muscular',
        'stack_2_save':'MXN · ahorras $2,669 vs individual',
    },
    'SPA': {
        'title': 'La ciencia del',
        'title_em': 'spa moderno.',
        'cover_lede': 'Para tu ritual nocturno, tu rutina post-viaje, tu fin de semana de reset. Péptidos de uso continuo para sueño profundo, recuperación y bienestar diario. Lo que tu cuerpo necesita cuando ya tienes todo lo demás resuelto.',
        'line_intro_title': 'Protocolos integrales',
        'line_intro_title_em': 'multi-servicio.',
        'line_intro_lede': 'Selección curada de péptidos top para spa médico integral · TRINITY · GHK-Cu · BPC-157 · NAD+ · Epithalon. Diseñada para elevar ticket promedio y diferenciar tu oferta wellness.',
        'line_eyebrow': 'Línea SPA · Multi-protocolo',
        'category_name': 'Spa Médico',
        'target': 'personas con ritual wellness establecido · 30+ · viajeros frecuentes · ejecutivos con jet-lag crónico',
        'euromonitor_lever_1': ('Lever #1 · Experiential luxury +9% CAGR', 'El luxury experiential wellness es el segmento con mayor CAGR del wellness según Euromonitor · supera a beauty, supplements y food. Clínicas que integran protocolos 12 semanas (no sesiones únicas) capturan el ticket premium.'),
        'euromonitor_lever_2': ('Lever #2 · 25% paga +20% por personalización', 'El consumidor wellness premium paga premium por "productos personalizados basados en diagnóstico". Péptidos permiten este nivel de personalización imposible con cremas o suplementos · cada paciente su protocolo.'),
        'euromonitor_lever_3': ('Lever #3 · Convergencia spa + medical', 'Euromonitor identifica "service-led models and adjacencies" como tercer lever principal. Spas que integran péptidos research-grade · IV drips · diagnósticos · protocolos multi-semana · se posicionan como referente medical-grade.'),
        'products': [
            {'name':'TRINITY', 'dose':'70mg', 'price':7499, 'subtitle':'Triple peptide blend · signature spa', 'image':'products-v2/trinity-studio.png', 'category':'Peptide Blend · 70mg',
             'desc':'El producto signature del spa médico PEPTIQ · blend BPC-157 + GHK-Cu + TB-500 en un solo vial. Una sola reconstitución · aplicación simple · cascada regenerativa completa. Ideal para protocolos post-procedimiento de alto flujo de pacientes.',
             'mech':'BPC-157 (angiogénesis) + GHK-Cu (colágeno I/III) + TB-500 (migración celular) · efecto sinérgico documentado en regeneración tisular · perfil de seguridad combinado superior a monoterapia.',
             'applications':'• Protocolo post-láser · post-microneedling<br>• Mesoterapia facial integral<br>• Signature treatment facial 6-8 semanas<br>• Post-hilos tensores · post-peeling profundo<br>• Home-care premium para pacientes VIP',
             'dose_research':'2-4mg SC 2×/sem', 'route':'SC + mesoterapia', 'duration':'6-8 semanas', 'purity':'99.4%+ verificada'},
            {'name':'GHK-Cu', 'dose':'100mg', 'price':3799, 'subtitle':'Copper peptide · dermo longevity', 'image':'products-v2/ghk-cu-studio.png', 'category':'Copper Tripeptide · 100mg',
             'desc':'GHK-Cu es el copper peptide más estudiado en dermatología regenerativa desde 1973. Pilar de protocolos spa signature · complemento obligatorio post-procedimientos láser · mesoterapia capilar · protocolos anti-aging facial.',
             'mech':'Activa síntesis colágeno I/III · inhibe MMPs · antioxidante nivel farmacéutico · estimula angiogénesis cutánea · modula 4,192 genes de reparación tisular · efecto sistémico sobre senescencia celular.',
             'applications':'• Post-láser CO₂ fraccionado · picoláser · IPL<br>• Mesoterapia facial 35+ con pérdida elasticidad<br>• Protocolo capilar · PRP combinado<br>• Home-care post-peeling profundo<br>• Stack con TRINITY para regeneración integrada',
             'dose_research':'1-2mg SC local', 'route':'SC · mesoterapia', 'duration':'90 días refrig.', 'purity':'99%+ verificada'},
            {'name':'BPC-157', 'dose':'10mg', 'price':2999, 'subtitle':'Systemic repair · GI + tissue', 'image':'products-v2/bpc-157-studio.png', 'category':'Pentadecapeptide · 10mg',
             'desc':'En spa médico, BPC-157 es el complemento versátil · protocolo post-cirugía estética · recuperación muscular en spa-fitness · reparación gastrointestinal en programas de detox · mesoterapia localizada.',
             'mech':'Angiogénesis vía VEGFR2 · fibroblastos · reparación GI · neuroprotección · modulación inflamación · documentado en 1,200+ estudios · el péptido más versátil del portfolio.',
             'applications':'• Recuperación post-cirugía estética mayor<br>• Mesoterapia corporal reafirmante<br>• Programa detox + restauración GI<br>• Complemento a programas spa-fitness 40+<br>• Cicatrización de tatuajes · piercings corporales',
             'dose_research':'250-500mcg 2×/día', 'route':'SC local + sistémica', 'duration':'4-6 semanas', 'purity':'99.654% verificada'},
            {'name':'NAD+', 'dose':'1000mg', 'price':5499, 'subtitle':'IV drip longevity · premium service', 'image':'products-v2/nad-plus-studio.png', 'category':'Nicotinamide Adenine Dinucleotide · 1000mg',
             'desc':'NAD+ es el servicio signature de spa médico en 2026 · IV drip 60-90 min con ticket $4-8k MXN · experiencia premium · pacientes recurrentes mensuales. Clínicas que lo ofrecen facturan +$120k USD/año solo con IV drip.',
             'mech':'Activa sirtuinas · reparación DNA · cofactor mitocondrial · efecto energético inmediato + longevidad celular · experiencia cliente premium (60-90 min · ambiente spa · output medible).',
             'applications':'• IV drip longevity premium (servicio signature)<br>• Pre/post eventos sociales (bodas · galas)<br>• Jet-lag recovery para C-suite<br>• Complemento a retiros wellness 1-3 días<br>• Programa biological age quarterly',
             'dose_research':'500-1000mg IV · 60-90min', 'route':'IV drip', 'duration':'14 días refrig. reconstituido', 'purity':'99.500% verificada'},
            {'name':'Epithalon', 'dose':'50mg', 'price':6799, 'subtitle':'Telomerase · premium longevity', 'image':'products-v2/epithalon-studio.png', 'category':'Tetrapeptide AEDG · 50mg',
             'desc':'Epithalon eleva el posicionamiento del spa a "longevity center". Protocolo Khavinson 10-ON/20-OFF ideal para pacientes VIP que buscan biological age reversal con seguimiento anual · ticket $12-20k trimestre.',
             'mech':'Reactivación telomerasa · elongación telomérica · restauración melatonina pineal · ritmo circadiano · expresión génica longevidad.',
             'applications':'• Programa longevity premium VIP<br>• Protocolo Khavinson 4 ciclos/año<br>• Complemento IV drip NAD+<br>• Pacientes con trastornos sueño 50+<br>• Programa biological age measurable',
             'dose_research':'5-10mg SC nocturno', 'route':'Subcutánea', 'duration':'10 días on · 20 off', 'purity':'99%+ verificada'},
        ],
        'stack_1_name':'✨ SPA Signature', 'stack_1_tag':'Signature · 8 semanas', 'stack_1_price':7499,
        'stack_1_title':'Tu tratamiento','stack_1_title_em':'bandera.',
        'stack_1_desc':'Protocolo estético signature 8 semanas · TRINITY + protocolo personalizado · ideal primer acercamiento al paciente spa.',
        'stack_1_comp_1_name':'TRINITY 70mg','stack_1_comp_1_desc':'Cascada regenerativa completa',
        'stack_1_comp_2_name':'+ Agua Bact.','stack_1_comp_2_desc':'Reconstitución USP estéril',
        'stack_1_comp_3_name':'+ Starter Kit','stack_1_comp_3_desc':'Jeringas + guía + protocolo 1-on-1',
        'stack_1_subtitle':'8 semanas · TRINITY (1 vial dura 8-10 aplicaciones) + starter kit + protocolo personalizado',
        'stack_1_save':'MXN · ahorras $2,090 vs individual',
        'stack_2_name':'🕰️ SPA Longevity', 'stack_2_tag':'Longevity · 12 semanas · VIP', 'stack_2_price':14999,
        'stack_2_title':'Premium','stack_2_title_em':'longevity suite.',
        'stack_2_desc':'Protocolo VIP 12 semanas · NAD+ IV + Epithalon + GHK-Cu sistémico · ideal pacientes alto ticket · longevity quarterly retainer.',
        'stack_2_comp_1_name':'NAD+ 1000mg','stack_2_comp_1_desc':'IV drip + SC mantenimiento',
        'stack_2_comp_2_name':'Epithalon 50mg','stack_2_comp_2_desc':'Protocolo Khavinson nocturno',
        'stack_2_comp_3_name':'GHK-Cu 100mg','stack_2_comp_3_desc':'Sistémico + dérmico',
        'stack_2_subtitle':'12 semanas · stack completo longevity · 3 viales + 3× agua + protocolo Khavinson + follow-up mensual',
        'stack_2_save':'MXN · ahorras $2,768 vs individual',
    },
}

# Read template
template_html = TEMPLATE.read_text(encoding='utf-8')

def build_product_page(p, index, total, page_num):
    return f'''
<div class="page product-page">
  <div class="std-header">
    <div class="std-header-left">
      <div class="eyebrow">Producto {index:02d}/{total}</div>
    </div>
    <div class="std-header-right">
      <div class="page-num">{page_num:02d}</div>
      <div class="page-total">Páginas 16</div>
    </div>
  </div>

  <div class="product-hero">
    <div class="product-img"><img src="../img/{p['image']}" alt="{p['name']}"></div>
    <div class="product-header">
      <div class="eyebrow" style="color:var(--gold)">{p['category']}</div>
      <h2>{p['name']} <em>{p['dose']}</em></h2>
      <div class="subtitle">{p['subtitle']}</div>
      <div class="product-price-box">
        <div class="pp-price" style="font-size:32px;color:#111;font-weight:600">${p['price']:,} MXN</div>
        <div class="pp-unit">Por vial · {p['dose']} liofilizado · COA Janoshik incluido</div>
        <div class="pp-b2b" style="font-size:11px;color:#666">Envío 24-72h · Cadena de frío · Factura CFDI · Soporte WhatsApp</div>
      </div>
    </div>
  </div>

  <div class="product-body">
    <p>{p['desc']}</p>

    <div class="mech-box">
      <b>Mecanismo de acción</b>
      <p>{p['mech']}</p>
    </div>

    <h3 style="margin-top:20px">Aplicaciones clínicas</h3>
    <p>{p['applications']}</p>

    <div class="product-specs">
      <div class="spec-item"><div class="spec-lbl">Dosis research</div><div class="spec-val">{p['dose_research']}</div></div>
      <div class="spec-item"><div class="spec-lbl">Vía</div><div class="spec-val">{p['route']}</div></div>
      <div class="spec-item"><div class="spec-lbl">Duración</div><div class="spec-val">{p['duration']}</div></div>
      <div class="spec-item"><div class="spec-lbl">Pureza HPLC</div><div class="spec-val">{p['purity']}</div></div>
    </div>
  </div>

  <div class="page-footer">
    <span class="pf-left">PEPTIQ MX · Catálogo {{CATEGORY_NAME}} 2026</span>
    <span class="pf-right">peptiqmx.com</span>
  </div>
</div>
'''

for cat_key, cfg in CATEGORIES.items():
    print(f'Building {cat_key} catalog...')
    html = template_html

    # Cover hero image (lifestyle + branded vial, category-specific) — NEW LABEL ONLY
    COVER_BY_LINE = {
        'WOLVERINE': '../img/products-v2/bpc-157-lifestyle.png',
        'HIGHLANDER': '../img/products-v2/nad-plus-lifestyle.png',
        'PRIME': '../img/products-v2/tesamorelin-lifestyle.png',
        'SHRED': '../img/products-v2/retatrutide-lifestyle.png',
        'GLOW': '../img/products-v2/trinity-lifestyle.png',
        'SPA': '../img/products-v2/dsip-lifestyle.png',
    }
    new_cover = COVER_BY_LINE.get(cat_key.upper(), '../img/products-v2/ghk-cu-lifestyle.png')
    html = html.replace('../img/products-v2/ghk-cu-lifestyle.png', new_cover)
    html = html.replace('PEPTIQ MX · Línea GLOW', f'PEPTIQ MX · Línea {cfg["category_name"].upper()}')

    # Cover hero overlay (eyebrow + slogan at top of cover image)
    html = html.replace('Línea GLOW · Para tu piel y cabello', cfg['line_eyebrow'])
    html = html.replace('La ciencia de la<br><em>piel radiante.</em>', f'{cfg["title"]}<br><em>{cfg["title_em"]}</em>')
    html = html.replace('La piel recuerda cómo sanaba a los 25. Péptidos dérmicos que reparan matriz extracelular, reactivan folículo y devuelven luminosidad. Sin filtros, sin promesas. Solo bioseñal directa.', cfg['cover_lede'])
    html = html.replace('Catálogo Profesional · Línea GLOW', cfg['line_eyebrow'])

    # Title bar
    html = html.replace('PEPTIQ · GLOW Catálogo Profesional 2026', f'PEPTIQ · {cfg["category_name"]} Catálogo Profesional 2026')

    # Category name in footer (multiple places)
    html = html.replace('Catálogo GLOW 2026', f'Catálogo {cfg["category_name"].upper()} 2026')
    html = html.replace('Catálogo profesional GLOW · Edición abril 2026', f'Catálogo profesional {cfg["category_name"].upper()} · Edición abril 2026')

    # Line intro page (page 5)
    html = re.sub(
        r'<div style="font-size:9\.5px;letter-spacing:2\.8px;text-transform:uppercase;color:var\(--gold\);margin-bottom:12px">Línea GLOW · Dermo-longevity</div>',
        f'<div style="font-size:9.5px;letter-spacing:2.8px;text-transform:uppercase;color:var(--gold);margin-bottom:12px">{cfg["line_eyebrow"]}</div>',
        html
    )
    html = html.replace(
        'Regeneración<br><em style="font-style:italic;color:var(--gold-light)">dérmica profunda.</em>',
        f'{cfg["line_intro_title"]}<br><em style="font-style:italic;color:var(--gold-light)">{cfg["line_intro_title_em"]}</em>'
    )
    html = html.replace(
        'Línea de péptidos de Copper, Trinity Blends y regeneradores celulares. Formulados para protocolos estéticos avanzados, post-procedimiento y longevidad cutánea.',
        cfg['line_intro_lede']
    )

    # Euromonitor levers (page 3)
    # Lever 1
    html = re.sub(
        r'<b class="title">Lever #1 · De "anti-aging" a "biological age reversal"</b>\s*<p>[^<]+</p>',
        f'<b class="title">{cfg["euromonitor_lever_1"][0]}</b>\n      <p>{cfg["euromonitor_lever_1"][1]}</p>',
        html
    )
    html = re.sub(
        r'<b class="title">Lever #2 · Neuropéptidos · nueva categoría oficial</b>\s*<p>[^<]+</p>',
        f'<b class="title">{cfg["euromonitor_lever_2"][0]}</b>\n      <p>{cfg["euromonitor_lever_2"][1]}</p>',
        html
    )
    html = re.sub(
        r'<b class="title">Lever #3 · Medical-grade credibility</b>\s*<p>[^<]+</p>',
        f'<b class="title">{cfg["euromonitor_lever_3"][0]}</b>\n      <p>{cfg["euromonitor_lever_3"][1]}</p>',
        html
    )

    # About intro target categories
    html = html.replace(
        'Este catálogo contiene la selección de productos <b>PEPTIQ GLOW</b> · diseñados específicamente para integrarse a protocolos de medicina estética, dermatología funcional y longevidad dérmica.',
        f'Este catálogo contiene la selección de productos <b>PEPTIQ {cfg["category_name"].upper()}</b> · diseñados específicamente para integrarse a protocolos de {cfg["target"]}.'
    )

    # Replace 5 product pages (find "Línea GLOW · Producto 01/05" pattern and swap the whole section)
    # Build new products HTML
    product_pages_html = ''
    for i, p in enumerate(cfg['products']):
        product_pages_html += build_product_page(p, i+1, 5, 6+i).replace('{{CATEGORY_NAME}}', cfg['category_name'].upper())

    # Find and replace product pages block (pages 6-10)
    # Use regex to find from "Línea GLOW · Producto 01/05" to end of page 10 Epithalon
    pattern = re.compile(
        r'<!-- ═══════════════ PAGE 6 · GHK-Cu ═══════════════ -->.*?<!-- ═══════════════ PAGE 11 · GLOW ESSENTIAL STACK ═══════════════ -->',
        re.DOTALL
    )
    html = pattern.sub(
        f'<!-- ═══════════════ PAGES 6-10 · PRODUCTS ═══════════════ -->\n{product_pages_html}\n<!-- ═══════════════ PAGE 11 · STACK 1 ═══════════════ -->',
        html
    )

    # Stack 1 (page 11)
    html = html.replace('✨ GLOW Essential · 6 semanas', cfg['stack_1_tag'])
    html = html.replace('La ritual <em class="italic">regenerativa.</em>', f'{cfg["stack_1_title"]} <em class="italic">{cfg["stack_1_title_em"]}</em>')
    html = html.replace('Protocolo dérmico 6 semanas · enfoque en síntesis colágeno, firmeza y luminosidad · integración post-procedimiento.', cfg['stack_1_desc'])
    html = html.replace('TRINITY 70mg', cfg['stack_1_comp_1_name'], 1)  # only first
    html = html.replace('BPC + GHK-Cu + TB-500 · cascada completa', cfg['stack_1_comp_1_desc'])
    html = html.replace('+ Agua Bact. 3ml', cfg['stack_1_comp_2_name'], 1)
    html = html.replace('Reconstitución USP estéril incluida', cfg['stack_1_comp_2_desc'])
    html = html.replace('+ Starter Kit', cfg['stack_1_comp_3_name'], 1)
    html = html.replace('Jeringas · guía reconstitución · protocolo 1-on-1', cfg['stack_1_comp_3_desc'])
    html = html.replace('GLOW Essential Stack', cfg['stack_1_name'])
    html = html.replace('Protocolo 6-8 semanas · incluye agua bacteriostática, jeringas y guía · 1 vial TRINITY por paciente', cfg['stack_1_subtitle'])
    html = html.replace('$7,499</div>\n      <div class="spr-save">MXN · consumer final</div>', f'${cfg["stack_1_price"]:,}</div>\n      <div class="spr-save">{cfg["stack_1_save"]}</div>')

    # Stack 2 (page 12)
    html = html.replace('🕰️ Highlander · Longevity · 12 semanas', cfg['stack_2_tag'])
    html = html.replace('Biological age <em class="italic">reversal.</em>', f'{cfg["stack_2_title"]} <em class="italic">{cfg["stack_2_title_em"]}</em>')
    html = html.replace('Protocolo sistémico 12 semanas · activa sirtuinas · restaura mitocondria · elonga telómeros · resultado medible con biomarcadores.', cfg['stack_2_desc'])
    html = html.replace('NAD+ 1000mg', cfg['stack_2_comp_1_name'], 1)
    html = html.replace('Combustible mitocondrial · IV o SC', cfg['stack_2_comp_1_desc'])
    html = html.replace('Epithalon 50mg', cfg['stack_2_comp_2_name'], 1)
    html = html.replace('Telomerase reactivation · circadian', cfg['stack_2_comp_2_desc'])
    html = html.replace('GHK-Cu 100mg', cfg['stack_2_comp_3_name'], 1)
    html = html.replace('Dérmico · colágeno · antioxidante', cfg['stack_2_comp_3_desc'])
    html = html.replace('Highlander Longevity Stack', cfg['stack_2_name'])
    html = html.replace('12 semanas · 3 viales + 3× agua bacteriostática · guía protocolo Khavinson · seguimiento mensual', cfg['stack_2_subtitle'])
    html = html.replace('$14,999</div>\n      <div class="spr-save">MXN · ahorras $2,768 vs individual</div>', f'${cfg["stack_2_price"]:,}</div>\n      <div class="spr-save">{cfg["stack_2_save"]}</div>')

    # ─── Deep category-specific replacements (page 3 MI, 5 intro, 5b use cases, 5c personas, 5d family) ───
    deep = DEEP.get(cat_key)
    if deep:
        # Page 3 · Market Intelligence eyebrow + h2 + lede
        html = re.sub(
            r'<div class="eyebrow">Market Intelligence · Medicina estética MX 2026</div>',
            f'<div class="eyebrow">{deep["mi_eyebrow"]}</div>',
            html, count=1
        )
        html = re.sub(
            r'<h2>El paciente premium <em class="italic">cambió de ingredientes\.</em></h2>',
            f'<h2>{deep["mi_h2"]}</h2>',
            html, count=1
        )
        # Replace MI lede (the "El mercado de medicina estética..." paragraph)
        html = re.sub(
            r'<p class="lead">El mercado de medicina estética en México facturó.*?capturan el ticket premium del segmento\.</p>',
            f'<p class="lead">{deep["mi_lede"]}</p>',
            html, count=1, flags=re.DOTALL
        )
        # Replace 3 stat cards
        new_stats = ''
        for val, lbl, sub in deep['mi_stats']:
            # If val contains digits + symbol, split italic
            new_stats += f'      <div class="stat-card">\n        <div class="s-val">{val}</div>\n        <div class="s-lbl">{lbl}</div>\n        <div class="s-sub">{sub}</div>\n      </div>\n'
        html = re.sub(
            r'(<div class="stat-grid" style="margin-top:24px">\s*)(?:<div class="stat-card">.*?</div>\s*){3}(\s*</div>)',
            lambda m: m.group(1) + new_stats + m.group(2),
            html, count=1, flags=re.DOTALL
        )
        # Replace 3 levers (callouts page 3)
        for i, (lever_title, lever_body) in enumerate(deep['levers'], 1):
            # Match the i-th lever in page 3 area (between mi_lede end and "Fuentes:")
            old_pattern = {
                1: r'<b class="title">Lever #1 · Post-procedimiento es donde se gana o se pierde el paciente</b>\s*<p>[^<]+</p>',
                2: r'<b class="title">Lever #2 · El término "anti-aging" perdió tracción · ahora es "regenerativa dérmica"</b>\s*<p>[^<]+</p>',
                3: r'<b class="title">Lever #3 · COA público es el nuevo botox-quality assurance</b>\s*<p>[^<]+</p>',
            }[i]
            html = re.sub(
                old_pattern,
                f'<b class="title">{lever_title}</b>\n      <p>{lever_body}</p>',
                html, count=1, flags=re.DOTALL
            )
        # Update sources line
        html = html.replace(
            'Fuentes: Euromonitor Passport H&amp;W Sept 2025 · Statista MX Aesthetic Medicine · MSDV Annual Report 2024',
            'Fuentes: Euromonitor Passport H&amp;W Sept 2025 · datos sectoriales MX 2024 · estudios peer-reviewed'
        )

        # Page 5 intro · slogan em + lede
        # Already handled by base 'title_em' but reinforce intro lede
        html = re.sub(
            r'<p style="font-size:14\.5px;color:rgba\(255,255,255,0\.78\);max-width:600px;line-height:1\.6;font-weight:300">Cinco moléculas que tu paciente premium reconoce.*?cutánea\.</p>',
            f'<p style="font-size:14.5px;color:rgba(255,255,255,0.78);max-width:600px;line-height:1.6;font-weight:300">{deep["intro_lede"]}</p>',
            html, count=1, flags=re.DOTALL
        )

        # Page 5b · Replace 6 use cases (callouts in grid)
        # Find the use cases block (after "Línea GLOW · Casos de uso clínico" eyebrow)
        new_uc = ''
        for title, body in deep['use_cases']:
            new_uc += f'      <div class="callout" style="margin:0">\n        <b class="title">{title}</b>\n        <p>{body}</p>\n      </div>\n'
        html = re.sub(
            r'(<div style="display:grid;grid-template-columns:repeat\(2,1fr\);gap:14px;margin-top:18px">\s*)(?:<div class="callout" style="margin:0">.*?</div>\s*){6}(\s*</div>\s*</div>\s*<div class="page-footer">\s*<span class="pf-left">PEPTIQ MX · Línea GLOW · Casos de uso</span>)',
            lambda m: m.group(1) + new_uc + m.group(2),
            html, count=1, flags=re.DOTALL
        )
        # Update use cases page eyebrow + h2 + footer
        html = html.replace(
            '<div class="eyebrow">Línea GLOW · Casos de uso clínico</div>',
            f'<div class="eyebrow">Línea {cfg["category_name"].upper()} · Casos de uso clínico</div>'
        )
        html = html.replace(
            'PEPTIQ MX · Línea GLOW · Casos de uso',
            f'PEPTIQ MX · Línea {cfg["category_name"].upper()} · Casos de uso'
        )

        # Page 5c · 3 personas
        new_personas = ''
        labels = ['Perfil 1', 'Perfil 2', 'Perfil 3']
        for i, (label, who, dolor, win) in enumerate(deep['personas']):
            new_personas += f'''      <div style="background:#fff;padding:20px;border-top:3px solid var(--gold)">
        <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--beige-deep);margin-bottom:6px">{labels[i]}</div>
        <h3 style="font-size:17px;color:var(--ink);margin-bottom:10px;line-height:1.2">{label}</h3>
        <p style="font-size:11px;color:#3a3a3a;line-height:1.65;margin-bottom:8px"><b>Quién:</b> {who}</p>
        <p style="font-size:11px;color:#3a3a3a;line-height:1.65;margin-bottom:8px"><b>Dolor:</b> {dolor}</p>
        <p style="font-size:11px;color:#3a3a3a;line-height:1.65"><b>Win con {cfg["category_name"].upper()}:</b> {win}</p>
      </div>
'''
        html = re.sub(
            r'(<div style="display:grid;grid-template-columns:repeat\(3,1fr\);gap:14px;margin-top:18px">\s*)(?:<div style="background:#fff;padding:20px;border-top:3px solid var\(--gold\)">.*?</div>\s*){3}',
            lambda m: m.group(1) + new_personas,
            html, count=1, flags=re.DOTALL
        )

        # Page 5c · 3 objections cards (replacing the GLOW ones)
        new_obj = ''
        for title, body in deep['objections']:
            new_obj += f'''      <div style="background:var(--ink);color:#f0e6cc;padding:16px 18px;border-left:3px solid var(--gold)">
        <div style="font-family:'Playfair Display',serif;font-style:italic;color:var(--gold-light);font-size:14px;margin-bottom:8px">{title}</div>
        <p style="font-size:11px;color:rgba(255,255,255,0.85);line-height:1.6;margin:0">{body}</p>
      </div>
'''
        html = re.sub(
            r'(<div style="display:grid;grid-template-columns:repeat\(3,1fr\);gap:12px">\s*)(?:<div style="background:var\(--ink\);color:#f0e6cc;padding:16px 18px;border-left:3px solid var\(--gold\)">.*?</div>\s*){3}',
            lambda m: m.group(1) + new_obj,
            html, count=1, flags=re.DOTALL
        )

        # Update personas page eyebrow + footer
        html = html.replace(
            'PEPTIQ MX · Línea GLOW · Personas + Journey',
            f'PEPTIQ MX · Línea {cfg["category_name"].upper()} · Personas + Journey'
        )

        # Page 5d · Family marker · Move "ESTÁS AQUÍ" badge to correct category
        # Remove from GLOW
        html = re.sub(
            r'<span style="position:absolute;top:14px;right:18px;font-size:10px;letter-spacing:1\.5px;color:var\(--gold\);background:var\(--ink\);padding:3px 9px;border-radius:2px;font-weight:500">ESTÁS AQUÍ</span>',
            '', html, count=1
        )
        # Add to correct category card
        cat_emoji_map = {
            'WOLVERINE': '🐺 WOLVERINE', 'HIGHLANDER': '🕰️ HIGHLANDER',
            'PRIME': '⚡ PRIME', 'SHRED': '🔥 SHRED', 'SPA': '💎 SPA',
        }
        target_card_pattern = f'<div style="font-family:\'Playfair Display\',serif;font-size:18px;color:var(--ink);font-weight:500;margin-bottom:4px">{cat_emoji_map[cat_key]}</div>'
        html = html.replace(
            f'<div style="background:var(--stone);padding:18px 20px;border-left:3px solid var(--gold)">\n        {target_card_pattern}',
            f'<div style="background:var(--stone);padding:18px 20px;border-left:3px solid var(--gold);position:relative">\n        <span style="position:absolute;top:14px;right:18px;font-size:10px;letter-spacing:1.5px;color:var(--gold);background:var(--ink);padding:3px 9px;border-radius:2px;font-weight:500">ESTÁS AQUÍ</span>\n        {target_card_pattern}',
            1
        )
        # Update intro_lede em (GLOW had "piel radiante" — replace per category)
        # The intro_h2_em from deep
        html = html.replace(
            f'{cfg["title"]}<br><em>{cfg["title_em"]}</em>',
            f'La ciencia de<br><em>{deep["intro_h2_em"]}</em>',
            10  # might appear multiple times
        )

    # Save HTML
    out_html = ROOT / f'PEPTIQ-{cat_key}-B2C-2026.html'
    out_html.write_text(html, encoding='utf-8')

    # Generate PDF
    out_pdf = ROOT / f'PEPTIQ-{cat_key}-B2C-2026.pdf'
    result = subprocess.run([
        CHROME,
        '--headless=new', '--disable-gpu', '--no-pdf-header-footer',
        f'--print-to-pdf={out_pdf}',
        '--print-to-pdf-no-header',
        '--virtual-time-budget=15000',
        f'file://{out_html}'
    ], capture_output=True, timeout=45)

    size = out_pdf.stat().st_size if out_pdf.exists() else 0
    print(f'  ✅ {out_pdf.name} · {size/1024/1024:.1f} MB')

print('\n🎉 5 catálogos generados · abriendo preview...')
for cat_key in CATEGORIES.keys():
    pdf = ROOT / f'PEPTIQ-{cat_key}-B2C-2026.pdf'
    if pdf.exists():
        subprocess.Popen(['open', str(pdf)])
