/**
 * ============================================================
 * TU TESIS RD — Optimización Semana 1
 * ============================================================
 * Generado: 2026-04-08
 * Cuenta: 6869393137 | Tu Tesis RD
 * Campaña: Search | Leads | RD + Higüey | Tesis
 *
 * CAMBIOS QUE APLICA ESTE SCRIPT:
 * ─────────────────────────────────────────────────────────────
 * 1. Reactiva [ayuda con tesis] Exact Match (pausada → activa)
 * 2. Pausa keywords Broad Match de bajo rendimiento
 * 3. Agrega keyword nueva: [hacemos tu tesis] (search term que convirtió)
 * 4. Agrega 50+ negativos a nivel de campaña (5 categorías)
 *
 * CÓMO USAR:
 * ─────────────────────────────────────────────────────────────
 * PASO 1: Ve a Google Ads → Herramientas → Scripts
 * PASO 2: Crea un nuevo script y pega este código
 * PASO 3: Haz clic en "Vista previa" para ver los cambios SIN aplicarlos
 *         (DRY_RUN = true por defecto — modo seguro)
 * PASO 4: Si los logs se ven correctos, cambia DRY_RUN a false
 * PASO 5: Haz clic en "Ejecutar"
 * ============================================================
 */

// ─── CONFIGURACIÓN ────────────────────────────────────────────
var CONFIG = {
  DRY_RUN: true,  // ← CAMBIAR A false PARA APLICAR CAMBIOS REALES
  CAMPAIGN_NAME: 'Search | Leads | RD + Higüey | Tesis',
  AD_GROUP_NAME: 'Grupo de anuncios 1',
  NEW_KEYWORD_CPC: 0.55  // CPC para nuevas keywords (en USD)
};

// ─── KEYWORDS BROAD MATCH A PAUSAR ────────────────────────────
// Criterio: > $1.50 gastado con 0 conversiones O Broad que genera
// principalmente tráfico informacional
var BROAD_TO_PAUSE = [
  'asesor de tesis',       // $3.75, 7 clicks, 0 conv
  'ayuda con tesis',       // $2.04, 5 clicks, 1 conv (conv viene de exact)
  'corrección apa 7'       // $0, 0 clicks, 0 conv (genera impressions ruido)
];

// ─── KEYWORDS A CREAR ──────────────────────────────────────────
// [ayuda con tesis] EXACT: fue ELIMINADA de la cuenta (status REMOVED).
//   Tenía 2 conversiones a $1.50/conv — es la keyword más rentable.
//   Debe recrearse (no se puede reactivar una keyword eliminada).
//
// [hacemos tu tesis] EXACT: apareció en search terms y convirtió a $2.00.
//   No estaba en keyword list — la capturaba el broad por accidente.
var NEW_KEYWORDS = [
  { text: '[ayuda con tesis]',  cpc: CONFIG.NEW_KEYWORD_CPC, reason: 'Keyword ELIMINADA con mejor ROI ($1.50/conv, 2 conv). Recrear como EXACT.' },
  { text: '[hacemos tu tesis]', cpc: CONFIG.NEW_KEYWORD_CPC, reason: 'Search term convertidor ($2.00, 1 conv) que no estaba en keyword list.' }
];

// ─── NEGATIVOS POR CATEGORÍA ────────────────────────────────────
// Formato: texto sin símbolos = broad match negativo
// (excluye cualquier query que contenga esas palabras exactas)
var NEGATIVE_KEYWORDS = {

  // CATEGORÍA A: Consultas "Cómo hacer..." (DIY intent — quieren aprender, no contratar)
  // Fuente: 60+ search terms reales capturados en la cuenta
  informational: [
    'como hacer',
    'cómo hacer',
    'como elaborar',
    'cómo elaborar',
    'como redactar',
    'cómo redactar',
    'como realizar',
    'como presentar',
    'cómo presentar',
    'como defender',
    'cómo defender',
    'pasos para',
    'paso a paso',
    'que es una',
    'qué es una',
    'que es un',
    'qué es un',
    'ejemplos de',
    'como se hace',
    'cómo se hace',
    'como se realiza',
    'como iniciar',
    'como construir',
    'como encontrar'
  ],

  // CATEGORÍA B: Secciones de tesis (buscan plantillas/tutoriales, no un servicio)
  thesis_sections: [
    'marco teorico',
    'marco teórico',
    'planteamiento del problema',
    'formulacion del problema',
    'formulación del problema',
    'antecedentes de',
    'introduccion de',
    'introducción de',
    'justificacion de',
    'justificación de',
    'hipotesis',
    'hipótesis',
    'metodologia de',
    'metodología de',
    'operacionalizacion',
    'operacionalización',
    'bibliografia en apa',
    'bibliografía en apa',
    'citas bibliograficas',
    'citas bibliográficas',
    'referencias bibliograficas',
    'referencias bibliográficas'
  ],

  // CATEGORÍA C: Herramientas y plataformas de citas/recursos (van a usar software gratuito)
  tools_and_platforms: [
    'scribbr',
    'bibguru',
    'redalyc',
    'prepit',
    'scielo',
    'cite this for me',
    'portadas apa',
    'norma apa',
    'formato apa'
  ],

  // CATEGORÍA D: IA gratuita (no tienen presupuesto para contratar un servicio)
  ai_free: [
    'ia para tesis',
    'ia gratis',
    'tesis con ia',
    'inteligencia artificial tesis',
    'gratis',
    'gratuito',
    'creador de tesis ia',
    'hacer marco teorico con ia',
    'hacer tesis con ia'
  ],

  // CATEGORÍA E: Universidades, herramientas externas, búsquedas sin relación
  noise: [
    'uapa',
    'uasd',
    'unibe',
    'tareas universitarias',
    'oym',
    'research',
    'bibguru',
    'doctorado en un año',
    'maestria en un año',
    'universidad uapa',
    'defensa de tesis',
    'presentacion de tesis',
    'presentación de tesis',
    'how to do apa',
    'according to previous'
  ]
};

// ─── FUNCIONES PRINCIPALES ────────────────────────────────────

function main() {
  Logger.log('╔══════════════════════════════════════════════════════╗');
  Logger.log('║  TU TESIS RD — Optimización Semana 1                ║');
  Logger.log('╚══════════════════════════════════════════════════════╝');
  Logger.log('Modo      : ' + (CONFIG.DRY_RUN ? '🔍 SIMULACIÓN (sin cambios reales)' : '✅ PRODUCCIÓN'));
  Logger.log('Campaña   : ' + CONFIG.CAMPAIGN_NAME);
  Logger.log('Ad Group  : ' + CONFIG.AD_GROUP_NAME);
  Logger.log('Fecha/Hora: ' + new Date());
  Logger.log('');

  var campaign = getCampaign(CONFIG.CAMPAIGN_NAME);
  if (!campaign) return;

  var adGroup = getAdGroup(campaign, CONFIG.AD_GROUP_NAME);
  if (!adGroup) return;

  step1_ReactivateExactKeyword(adGroup);
  step2_PauseBroadKeywords(adGroup);
  step3_AddNewKeywords(adGroup);
  step4_AddNegativeKeywords(campaign);

  Logger.log('');
  Logger.log('══════════════════════════════════════════════════════');
  Logger.log('RESUMEN COMPLETADO');
  if (CONFIG.DRY_RUN) {
    Logger.log('⚠️  Estos son cambios SIMULADOS. Cambia DRY_RUN a false');
    Logger.log('   y vuelve a ejecutar para aplicarlos realmente.');
  } else {
    Logger.log('✅ Todos los cambios fueron aplicados exitosamente.');
    Logger.log('   Revisa la cuenta en Google Ads para confirmar.');
  }
  Logger.log('══════════════════════════════════════════════════════');
}

// ─── PASO 1: Diagnóstico de [ayuda con tesis] Exact Match ─────
// HALLAZGO: La keyword [ayuda con tesis] EXACT tiene status REMOVED
// en la API (status=4 = eliminada, no pausada). Las keywords eliminadas
// NO aparecen en adGroup.keywords(). Se recreará en el Paso 3.
function step1_ReactivateExactKeyword(adGroup) {
  Logger.log('── PASO 1: Verificar estado de keywords exactas ──────');

  var keywords = adGroup.keywords().get();
  var exactFound = false;
  var count = 0;

  while (keywords.hasNext()) {
    var kw = keywords.next();
    count++;
    if (kw.getText().toLowerCase() === 'ayuda con tesis') {
      var matchType = kw.getMatchType();
      var status = kw.isEnabled() ? 'ACTIVA' : 'PAUSADA';
      Logger.log('  → "ayuda con tesis" [' + matchType + '] — ' + status);
      if (matchType === 'EXACT') exactFound = true;
    }
  }

  Logger.log('Total keywords activas/pausadas en ad group: ' + count);

  if (!exactFound) {
    Logger.log('ℹ️  [ayuda con tesis] EXACT no está en la cuenta (fue ELIMINADA).');
    Logger.log('   Se RECREARÁ en el Paso 3 con CPC $' + CONFIG.NEW_KEYWORD_CPC);
    Logger.log('   Historial: 2 conversiones a $1.50/conv — mejor ROI de la cuenta');
  }
  Logger.log('');
}

// ─── PASO 2: Pausar Broad Match de bajo rendimiento ───────────
function step2_PauseBroadKeywords(adGroup) {
  Logger.log('── PASO 2: Pausar Broad Match ineficientes ───────────');
  Logger.log('Criterio: Broad match con alto gasto informacional');
  Logger.log('');

  var paused = 0;
  var notFound = [];

  // Iterar todas las keywords una sola vez (más eficiente)
  var allKeywords = adGroup.keywords().get();
  var kwMap = {};
  while (allKeywords.hasNext()) {
    var kw = allKeywords.next();
    if (kw.getMatchType() === 'BROAD') {
      kwMap[kw.getText().toLowerCase()] = kw;
    }
  }

  for (var i = 0; i < BROAD_TO_PAUSE.length; i++) {
    var targetText = BROAD_TO_PAUSE[i].toLowerCase();
    var kw = kwMap[targetText];

    if (kw) {
      if (kw.isEnabled()) {
        Logger.log('✓ ' + BROAD_TO_PAUSE[i] + ' [BROAD] — Estado: ACTIVA');
        if (!CONFIG.DRY_RUN) {
          kw.pause();
          Logger.log('  → PAUSADA ✅');
        } else {
          Logger.log('  → [SIMULACIÓN] Se pausaría');
        }
        paused++;
      } else if (kw.isPaused()) {
        Logger.log('⏭  ' + BROAD_TO_PAUSE[i] + ' [BROAD] — Ya está pausada, se omite');
      }
    } else {
      notFound.push(BROAD_TO_PAUSE[i]);
    }
  }

  if (notFound.length > 0) {
    Logger.log('⚠️  No encontradas (puede que ya estén pausadas): ' + notFound.join(', '));
  }

  Logger.log('Total a pausar: ' + paused + ' / ' + BROAD_TO_PAUSE.length);
  Logger.log('');
}

// ─── PASO 3: Agregar keywords nuevas convertidoras ────────────
function step3_AddNewKeywords(adGroup) {
  Logger.log('── PASO 3: Agregar keywords de search terms convertidos ─');
  Logger.log('Fuente: Search terms reales de la cuenta con conversiones');
  Logger.log('');

  for (var i = 0; i < NEW_KEYWORDS.length; i++) {
    var kwData = NEW_KEYWORDS[i];
    var text = kwData.text;
    var cpc = kwData.cpc;

    // Verificar si ya existe
    var exists = false;
    var existingKeywords = adGroup.keywords().get();
    while (existingKeywords.hasNext()) {
      var existing = existingKeywords.next();
      var fullText = formatKeyword(existing.getText(), existing.getMatchType());
      if (fullText.toLowerCase() === text.toLowerCase()) {
        exists = true;
        break;
      }
    }

    if (exists) {
      Logger.log('⏭  ' + text + ' — Ya existe en la cuenta, se omite');
    } else {
      Logger.log('+ ' + text + ' — CPC máx: $' + cpc);
      Logger.log('  Razón: ' + (kwData.reason || 'Search term convertidor'));
      if (!CONFIG.DRY_RUN) {
        var result = adGroup.newKeywordBuilder()
          .withText(text)
          .withCpc(cpc)
          .build();
        if (result.isSuccessful()) {
          Logger.log('  → CREADA exitosamente ✅');
        } else {
          Logger.log('  → ERROR al crear: ' + result.getErrors().join(', '));
        }
      } else {
        Logger.log('  → [SIMULACIÓN] Se crearía esta keyword');
      }
    }
  }
  Logger.log('');
}

// ─── PASO 4: Agregar negativos a nivel de campaña ─────────────
function step4_AddNegativeKeywords(campaign) {
  Logger.log('── PASO 4: Agregar palabras negativas ────────────────');

  // Obtener negativos existentes para no duplicar
  var existingNegatives = getExistingNegatives(campaign);
  Logger.log('Negativos existentes en campaña: ' + existingNegatives.length);
  Logger.log('');

  var totalAdded = 0;
  var totalSkipped = 0;

  var categories = Object.keys(NEGATIVE_KEYWORDS);

  for (var c = 0; c < categories.length; c++) {
    var category = categories[c];
    var keywords = NEGATIVE_KEYWORDS[category];

    Logger.log('  Categoría: ' + category.toUpperCase() + ' (' + keywords.length + ' términos)');

    for (var i = 0; i < keywords.length; i++) {
      var kwText = keywords[i].toLowerCase();

      // Verificar si ya existe
      if (existingNegatives.indexOf(kwText) !== -1) {
        totalSkipped++;
        continue;
      }

      if (!CONFIG.DRY_RUN) {
        // Broad match negativo (sin símbolos)
        campaign.createNegativeKeyword(kwText);
      }

      Logger.log('    + ' + kwText);
      totalAdded++;
    }
    Logger.log('');
  }

  Logger.log('Resumen negativos:');
  Logger.log('  Agregados  : ' + totalAdded);
  Logger.log('  Omitidos   : ' + totalSkipped + ' (ya existían)');
  Logger.log('  Total final: ' + (existingNegatives.length + totalAdded));
  Logger.log('');
}

// ─── FUNCIONES AUXILIARES ─────────────────────────────────────

function getCampaign(name) {
  var campaigns = AdsApp.campaigns()
    .withCondition('Name = "' + name + '"')
    .withCondition('Status = ENABLED')
    .get();

  if (!campaigns.hasNext()) {
    Logger.log('❌ ERROR: No se encontró la campaña "' + name + '"');
    Logger.log('   Verifica que el nombre esté escrito exactamente igual');
    Logger.log('   (incluyendo mayúsculas, tildes y caracteres especiales)');
    return null;
  }

  var campaign = campaigns.next();
  Logger.log('✓ Campaña encontrada: ' + campaign.getName());
  Logger.log('  Estado : ' + campaign.isEnabled());
  Logger.log('  Budget : $' + (campaign.getBudget().getAmount()).toFixed(2) + '/día');
  Logger.log('');
  return campaign;
}

function getAdGroup(campaign, name) {
  var adGroups = campaign.adGroups()
    .withCondition('Name = "' + name + '"')
    .get();

  if (!adGroups.hasNext()) {
    Logger.log('❌ ERROR: No se encontró el ad group "' + name + '"');
    Logger.log('   Verifica el nombre exacto del grupo de anuncios');
    return null;
  }

  var adGroup = adGroups.next();
  Logger.log('✓ Ad Group encontrado: ' + adGroup.getName());
  Logger.log('');
  return adGroup;
}

function getExistingNegatives(campaign) {
  var negatives = [];
  var negIter = campaign.negativeKeywords().get();
  while (negIter.hasNext()) {
    var neg = negIter.next();
    negatives.push(neg.getText().toLowerCase());
  }
  return negatives;
}

function formatKeyword(text, matchType) {
  if (matchType === 'EXACT') return '[' + text + ']';
  if (matchType === 'PHRASE') return '"' + text + '"';
  return text;
}
