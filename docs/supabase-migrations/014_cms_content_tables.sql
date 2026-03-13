-- =============================================
-- Migration 014: CMS Content Tables
-- glossary_terms + translations for full CMS
-- =============================================

-- 1. glossary_terms table
CREATE TABLE IF NOT EXISTS glossary_terms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  term_tr TEXT NOT NULL,
  term_en TEXT NOT NULL DEFAULT '',
  definition_tr TEXT NOT NULL,
  definition_en TEXT NOT NULL DEFAULT '',
  letter TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_glossary_letter ON glossary_terms(letter);
ALTER TABLE glossary_terms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active glossary" ON glossary_terms FOR SELECT USING (is_active = true);
CREATE POLICY "Service role write glossary" ON glossary_terms FOR ALL USING (auth.role() = 'service_role');

-- 2. translations table (auto-translation for 9 locales)
CREATE TABLE IF NOT EXISTS translations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_table TEXT NOT NULL,
  source_id UUID NOT NULL,
  field_name TEXT NOT NULL,
  locale TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  is_manual BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(source_table, source_id, field_name, locale)
);
CREATE INDEX IF NOT EXISTS idx_translations_lookup ON translations(source_table, source_id, locale);
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read translations" ON translations FOR SELECT USING (true);
CREATE POLICY "Service role write translations" ON translations FOR ALL USING (auth.role() = 'service_role');
