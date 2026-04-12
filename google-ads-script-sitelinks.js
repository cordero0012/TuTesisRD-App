/**
 * ============================================================
 * TU TESIS RD — Agregar 2 Sitelinks faltantes
 * ============================================================
 * Generado: 2026-04-08
 * Cuenta   : 6869393137 | Tu Tesis RD
 * Campaña  : Search | Leads | RD + Higüey | Tesis
 *
 * CONTEXTO:
 * La cuenta tiene 4 sitelinks activos. Google requiere mínimo 6
 * para activar los formatos de anuncio más destacados (2 filas
 * de sitelinks en desktop y pantalla completa en móvil).
 * Agregar 2 más activa ese formato sin costo adicional.
 *
 * SITELINKS EXISTENTES (no se tocan):
 *   1. Diagnóstico Gratis
 *   2. Corrección APA 7
 *   3. Asesoría por Capítulos
 *   4. Atención por WhatsApp
 *
 * SITELINKS A AGREGAR:
 *   5. Ver Precios y Planes
 *   6. ¿Cómo Funciona?
 *
 * CÓMO USAR:
 * 1. Cambia BASE_URL por la URL real de tu sitio web
 * 2. Ajusta los slugs /precios y /como-funciona si son diferentes
 * 3. Ejecuta en modo Vista Previa (DRY_RUN: true)
 * 4. Si se ve bien, cambia DRY_RUN: false y Ejecutar
 * ============================================================
 */

var CONFIG = {
  DRY_RUN: true,  // ← CAMBIAR A false PARA APLICAR CAMBIOS REALES

  CAMPAIGN_NAME: 'Search | Leads | RD + Higüey | Tesis',

  // ─── AJUSTA ESTO ─────────────────────────────────────────────
  // Pon la URL base de tu sitio web (sin / al final)
  // Ejemplo: 'https://www.tutesisrd.com'
  //          'https://tutesisrd.com.do'
  //          'https://tutesisrd.wixsite.com/tutesis'
  BASE_URL: 'https://www.tutesisrd.online'
};

// ─── SITELINKS A CREAR ────────────────────────────────────────
// URLs verificadas como existentes en tutesisrd.online:
// /precios · /servicios · /contacto · /nosotros
var NEW_SITELINKS = [
  {
    linkText:     'Ver Precios y Planes',
    finalUrl:     CONFIG.BASE_URL + '/precios',
    description1: 'Tarifas claras sin sorpresas',
    description2: 'Elige el plan que necesitas'
    // Razón: Alta intención de compra — quien busca precios está listo para contratar
  },
  {
    linkText:     'Nuestros Servicios',
    finalUrl:     CONFIG.BASE_URL + '/servicios',
    description1: 'Asesoría, corrección y más',
    description2: 'Todo para aprobar tu tesis'
    // Razón: Muestra el alcance completo del negocio al usuario indeciso
  }
];


// ─── SCRIPT PRINCIPAL ─────────────────────────────────────────

function main() {
  Logger.log('╔══════════════════════════════════════════════════════╗');
  Logger.log('║  TU TESIS RD — Agregar Sitelinks (5 y 6)            ║');
  Logger.log('╚══════════════════════════════════════════════════════╝');
  Logger.log('Modo    : ' + (CONFIG.DRY_RUN ? '🔍 SIMULACIÓN' : '✅ PRODUCCIÓN'));
  Logger.log('Campaña : ' + CONFIG.CAMPAIGN_NAME);
  Logger.log('Base URL: ' + CONFIG.BASE_URL);
  Logger.log('');

  // Obtener campaña
  var campaignIterator = AdsApp.campaigns()
    .withCondition('Name = "' + CONFIG.CAMPAIGN_NAME + '"')
    .withCondition('Status = ENABLED')
    .get();

  if (!campaignIterator.hasNext()) {
    Logger.log('❌ Campaña no encontrada: ' + CONFIG.CAMPAIGN_NAME);
    return;
  }
  var campaign = campaignIterator.next();
  Logger.log('✓ Campaña encontrada: ' + campaign.getName());

  // Auditar sitelinks existentes
  auditExistingSitelinks(campaign);

  // Agregar los 2 nuevos sitelinks
  addSitelinks(campaign);
}

// ─── AUDITAR SITELINKS EXISTENTES ─────────────────────────────
function auditExistingSitelinks(campaign) {
  Logger.log('── Sitelinks actuales en la campaña ─────────────────');

  var sitelinks = campaign.extensions().sitelinks().get();
  var count = 0;

  while (sitelinks.hasNext()) {
    var sl = sitelinks.next();
    count++;
    Logger.log('  ' + count + '. "' + sl.getLinkText() + '"');
    Logger.log('     URL: ' + sl.urls().getFinalUrl());
  }

  Logger.log('Total actual: ' + count + ' sitelinks');
  Logger.log('Faltan para el mínimo de 6: ' + Math.max(0, 6 - count));
  Logger.log('');
}

// ─── AGREGAR NUEVOS SITELINKS ─────────────────────────────────
function addSitelinks(campaign) {
  Logger.log('── Agregando sitelinks nuevos ────────────────────────');

  for (var i = 0; i < NEW_SITELINKS.length; i++) {
    var data = NEW_SITELINKS[i];

    Logger.log('');
    Logger.log((i + 1) + '. "' + data.linkText + '"');
    Logger.log('   URL : ' + data.finalUrl);
    Logger.log('   Desc1: ' + data.description1);
    Logger.log('   Desc2: ' + data.description2);

    // Verificar que la URL esté configurada
    if (data.finalUrl.indexOf('tutesisrd.com') === -1 &&
        data.finalUrl.indexOf('wix') === -1 &&
        data.finalUrl.indexOf('http') === 0) {
      Logger.log('   ⚠️  Verifica que la URL sea correcta antes de ejecutar');
    }

    if (!CONFIG.DRY_RUN) {
      try {
        var result = campaign.extensions().newSitelinkBuilder()
          .withLinkText(data.linkText)
          .withFinalUrl(data.finalUrl)
          .withDescription1(data.description1)
          .withDescription2(data.description2)
          .build();

        if (result.isSuccessful()) {
          Logger.log('   → CREADO Y VINCULADO ✅');
        } else {
          Logger.log('   → ERROR: ' + result.getErrors().join(', '));
        }
      } catch (e) {
        Logger.log('   → ERROR al crear: ' + e.message);
        Logger.log('   → Intenta agregar manualmente en Google Ads UI');
      }
    } else {
      Logger.log('   → [SIMULACIÓN] Se crearía y vincularía este sitelink');
    }
  }

  Logger.log('');
  Logger.log('══════════════════════════════════════════════════════');

  if (CONFIG.DRY_RUN) {
    Logger.log('⚠️  SIMULACIÓN completada. Para aplicar:');
    Logger.log('   1. Confirma que BASE_URL sea correcta: ' + CONFIG.BASE_URL);
    Logger.log('   2. Cambia DRY_RUN a false');
    Logger.log('   3. Haz clic en Ejecutar');
  } else {
    Logger.log('✅ Sitelinks agregados. Verifica en:');
    Logger.log('   Google Ads → Campañas → Activos → Vínculos a sitio');
    Logger.log('   (Pueden tardar hasta 1 hora en aparecer en anuncios)');
  }
  Logger.log('══════════════════════════════════════════════════════');
}
