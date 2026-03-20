-- =============================================
-- ROOF CALCULATOR — Migration 001
-- Database schema + seed data
-- =============================================

-- 1. TABLES

CREATE TABLE manufacturers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  logo_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE material_types (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  manufacturer_id uuid NOT NULL REFERENCES manufacturers(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(manufacturer_id, name)
);

CREATE TABLE models (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  material_type_id uuid NOT NULL REFERENCES material_types(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(material_type_id, name)
);

CREATE TABLE finishes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  model_id uuid NOT NULL REFERENCES models(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(model_id, name)
);

CREATE TABLE products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  finish_id uuid NOT NULL REFERENCES finishes(id) ON DELETE CASCADE,
  name text NOT NULL,
  thickness_mm numeric NOT NULL,
  color text,
  price_per_sqm numeric NOT NULL,
  sheet_height_m numeric NOT NULL,
  sheet_width_m numeric NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE calculations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  roof_type text NOT NULL CHECK (roof_type IN ('1_slope', '2_slopes')),
  dimension_a numeric NOT NULL,
  dimension_b numeric NOT NULL,
  dimension_c numeric NOT NULL,
  dimension_d numeric,
  total_area_sqm numeric NOT NULL,
  product_id uuid REFERENCES products(id),
  total_sheets integer,
  total_price_eur numeric,
  waste_percentage numeric DEFAULT 10,
  customer_name text,
  customer_phone text,
  customer_email text,
  created_at timestamptz DEFAULT now()
);

-- 2. ROW-LEVEL SECURITY

ALTER TABLE manufacturers ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE models ENABLE ROW LEVEL SECURITY;
ALTER TABLE finishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculations ENABLE ROW LEVEL SECURITY;

-- Public read on product catalog tables
CREATE POLICY "Public read manufacturers" ON manufacturers FOR SELECT USING (true);
CREATE POLICY "Public read material_types" ON material_types FOR SELECT USING (true);
CREATE POLICY "Public read models" ON models FOR SELECT USING (true);
CREATE POLICY "Public read finishes" ON finishes FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);

-- Calculations: public insert + read by id
CREATE POLICY "Public insert calculations" ON calculations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read calculations" ON calculations FOR SELECT USING (true);

-- 3. SEED DATA — BILKA

DO $$
DECLARE
  v_manufacturer_id uuid;
  v_material_type_id uuid;
  v_model_id uuid;
  v_finish_id uuid;
BEGIN
  -- Manufacturer: BILKA
  INSERT INTO manufacturers (name) VALUES ('BILKA')
  RETURNING id INTO v_manufacturer_id;

  -- Material Type: Otel Prevopsit
  INSERT INTO material_types (manufacturer_id, name) VALUES (v_manufacturer_id, 'Otel Prevopsit')
  RETURNING id INTO v_material_type_id;

  -- Model: TABLA PLANA
  INSERT INTO models (material_type_id, name) VALUES (v_material_type_id, 'TABLA PLANA')
  RETURNING id INTO v_model_id;

  -- Finish: LUCIOS
  INSERT INTO finishes (model_id, name) VALUES (v_model_id, 'LUCIOS')
  RETURNING id INTO v_finish_id;

  -- Products
  INSERT INTO products (finish_id, name, thickness_mm, color, price_per_sqm, sheet_height_m, sheet_width_m) VALUES
    (v_finish_id, 'Tabla plana cu folie protectoare (1,25×2,00 m) - lucios - 0,70 mm', 0.70, NULL, 8.84, 1.25, 2.00),
    (v_finish_id, 'Tabla plana cu folie protectoare (1,25×2,00 m) - lucios - 0,60 mm', 0.60, NULL, 6.96, 1.25, 2.00),
    (v_finish_id, 'Tabla plana cu folie protectoare (1,25×2,00 m) - lucios - 0,50 mm', 0.50, NULL, 6.14, 1.25, 2.00),
    (v_finish_id, 'Tabla plana cu folie protectoare (1,25×2,00 m) - lucios - 0,45 mm', 0.45, NULL, 5.73, 1.25, 2.00),
    (v_finish_id, 'Tabla plana cu folie protectoare (1,25×2,00 m) - lucios - RAL 8003 - 0,45 mm', 0.45, 'RAL 8003', 8.27, 1.25, 2.00),
    (v_finish_id, 'Tabla plana cu folie protectoare (1,25×2,00 m) - lucios - 0,40 mm', 0.40, NULL, 4.91, 1.25, 2.00);
END $$;
