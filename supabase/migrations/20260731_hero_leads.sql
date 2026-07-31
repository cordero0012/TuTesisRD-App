-- =============================================
-- TuTesis RD - Leads del formulario "Diagnóstico Rápido"
-- Migration: 2026-07-31
--
-- El formulario del hero enviaba al usuario a WhatsApp y descartaba lo que
-- había respondido. Esta tabla persiste esas respuestas para que la etapa y el
-- nivel académico dejen de perderse aunque la conversación nunca ocurra.
-- =============================================

CREATE TABLE IF NOT EXISTS public.hero_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- Respuestas del formulario
  etapa TEXT NOT NULL,
  nivel TEXT NOT NULL,

  -- Atribución: de dónde venía el usuario cuando envió
  page_path TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,

  -- Seguimiento comercial
  status TEXT NOT NULL DEFAULT 'nuevo', -- 'nuevo', 'contactado', 'calificado', 'descartado', 'cliente'
  notes TEXT
);

COMMENT ON TABLE public.hero_leads IS
  'Respuestas del formulario Diagnóstico Rápido de la landing. Sin PII: el contacto ocurre por WhatsApp.';

-- Índices para el panel de administración
CREATE INDEX IF NOT EXISTS hero_leads_created_at_idx ON public.hero_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS hero_leads_status_idx ON public.hero_leads(status);
CREATE INDEX IF NOT EXISTS hero_leads_utm_source_idx ON public.hero_leads(utm_source);

-- =============================================
-- RLS
--
-- El formulario es público y anónimo, así que la clave anon debe poder
-- INSERTAR — pero nunca leer. Sin la política de SELECT restrictiva,
-- cualquiera con la anon key (que va en el bundle del navegador) podría
-- descargarse la tabla entera de leads.
-- =============================================

ALTER TABLE public.hero_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit a hero lead" ON public.hero_leads;
CREATE POLICY "Anyone can submit a hero lead"
  ON public.hero_leads
  FOR INSERT
  WITH CHECK (true);

-- Lectura: solo usuarios autenticados del equipo. Deliberadamente NO existe
-- ninguna política de SELECT para el rol anon.
DROP POLICY IF EXISTS "Team can read hero leads" ON public.hero_leads;
CREATE POLICY "Team can read hero leads"
  ON public.hero_leads
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.team_members tm
      WHERE tm.email = auth.jwt() ->> 'email'
        AND tm.is_active = true
    )
  );

DROP POLICY IF EXISTS "Team can update hero leads" ON public.hero_leads;
CREATE POLICY "Team can update hero leads"
  ON public.hero_leads
  FOR UPDATE
  USING (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.team_members tm
      WHERE tm.email = auth.jwt() ->> 'email'
        AND tm.is_active = true
    )
  );
