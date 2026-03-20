export type RoofType = "1_slope" | "2_slopes";

export interface RoofDimensions {
  a: number; // wall height (m)
  b: number; // roof width (m)
  c: number; // slope 1 length (m)
  d?: number; // slope 2 length (m) — only for 2_slopes
}

export interface Manufacturer {
  id: string;
  name: string;
  logo_url: string | null;
}

export interface MaterialType {
  id: string;
  manufacturer_id: string;
  name: string;
}

export interface Model {
  id: string;
  material_type_id: string;
  name: string;
}

export interface Finish {
  id: string;
  model_id: string;
  name: string;
}

export interface Product {
  id: string;
  finish_id: string;
  name: string;
  thickness_mm: number;
  color: string | null;
  price_per_sqm: number;
  sheet_height_m: number;
  sheet_width_m: number;
  is_active: boolean;
}

export interface CalculatorState {
  step: number;
  roofType: RoofType | null;
  dimensions: RoofDimensions;
  totalArea: number;
  manufacturerId: string | null;
  materialTypeId: string | null;
  modelId: string | null;
  finishId: string | null;
  productId: string | null;
  wastePercentage: number;
}

export interface Calculation {
  id: string;
  roof_type: RoofType;
  dimension_a: number;
  dimension_b: number;
  dimension_c: number;
  dimension_d: number | null;
  total_area_sqm: number;
  product_id: string | null;
  total_sheets: number | null;
  total_price_eur: number | null;
  waste_percentage: number;
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  created_at: string;
}
