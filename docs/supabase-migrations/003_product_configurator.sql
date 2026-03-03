-- Migration 003: Product Configurator Tables
-- Aksesuar tipleri, ürün-aksesuar uyumluluk, renk seçenekleri, 3D modeller

-- Aksesuar tipleri (kapak, pompa, sprey vs.)
CREATE TABLE IF NOT EXISTS accessory_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_tr TEXT NOT NULL,
  name_en TEXT,
  name_ar TEXT,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('cap', 'pump', 'spray', 'dropper', 'valve')),
  neck_finish TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ürün-aksesuar uyumluluk tablosu
CREATE TABLE IF NOT EXISTS product_accessories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  accessory_type_id UUID NOT NULL REFERENCES accessory_types(id) ON DELETE CASCADE,
  is_default BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(product_id, accessory_type_id)
);

-- Renk seçenekleri (şişe gövdesi + her aksesuar için ayrı)
CREATE TABLE IF NOT EXISTS color_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  target_type TEXT NOT NULL CHECK (target_type IN ('product', 'accessory')),
  target_id UUID NOT NULL,
  color_name_tr TEXT NOT NULL,
  color_name_en TEXT,
  color_name_ar TEXT,
  color_hex TEXT NOT NULL,
  opacity FLOAT DEFAULT 1.0,
  metallic FLOAT DEFAULT 0.0,
  is_default BOOLEAN DEFAULT false,
  preview_image_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3D model dosyaları (ileride kullanılacak)
CREATE TABLE IF NOT EXISTS model_3d (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  target_type TEXT NOT NULL CHECK (target_type IN ('product', 'accessory')),
  target_id UUID NOT NULL,
  model_url TEXT NOT NULL,
  model_format TEXT DEFAULT 'glb',
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexler
CREATE INDEX idx_product_accessories_product ON product_accessories(product_id);
CREATE INDEX idx_product_accessories_accessory ON product_accessories(accessory_type_id);
CREATE INDEX idx_color_options_target ON color_options(target_type, target_id);
CREATE INDEX idx_model_3d_target ON model_3d(target_type, target_id);

-- RLS
ALTER TABLE accessory_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_accessories ENABLE ROW LEVEL SECURITY;
ALTER TABLE color_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_3d ENABLE ROW LEVEL SECURITY;

-- Anon: sadece okuma
CREATE POLICY "anon_read_accessory_types" ON accessory_types FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_product_accessories" ON product_accessories FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_color_options" ON color_options FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_model_3d" ON model_3d FOR SELECT TO anon USING (true);

-- Auth: admin full access
CREATE POLICY "admin_all_accessory_types" ON accessory_types FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM b2b_profiles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "admin_all_product_accessories" ON product_accessories FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM b2b_profiles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "admin_all_color_options" ON color_options FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM b2b_profiles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "admin_all_model_3d" ON model_3d FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM b2b_profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- Örnek veri: Yaygın aksesuar tipleri
INSERT INTO accessory_types (name_tr, name_en, slug, category, neck_finish) VALUES
  ('Flip-Top Kapak', 'Flip-Top Cap', 'flip-top-kapak', 'cap', '28/410'),
  ('Vidalı Kapak', 'Screw Cap', 'vidali-kapak', 'cap', '28/410'),
  ('Disk-Top Kapak', 'Disc-Top Cap', 'disk-top-kapak', 'cap', '24/410'),
  ('Losyon Pompası', 'Lotion Pump', 'losyon-pompasi', 'pump', '28/410'),
  ('Krem Pompası', 'Cream Pump', 'krem-pompasi', 'pump', '24/410'),
  ('Fine Mist Sprey', 'Fine Mist Spray', 'fine-mist-sprey', 'spray', '24/410'),
  ('Trigger Sprey', 'Trigger Spray', 'trigger-sprey', 'spray', '28/410'),
  ('Damlatık', 'Dropper', 'damlalik', 'dropper', '18/410'),
  ('Asansör Kapak', 'Elevator Cap', 'asansor-kapak', 'cap', '24/410'),
  ('Sıvı Sabun Pompası', 'Liquid Soap Pump', 'sivi-sabun-pompasi', 'pump', '28/410')
ON CONFLICT (slug) DO NOTHING;

-- Updated_at trigger
CREATE TRIGGER set_accessory_types_updated_at
  BEFORE UPDATE ON accessory_types
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
