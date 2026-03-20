"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Manufacturer, MaterialType, Model, Finish, Product } from "@/lib/types";
import { calculateSheets, calculateTotalPrice } from "@/lib/calculations";

const VAT_RATE = 19;

interface MaterialSelectorProps {
  manufacturerId: string | null;
  materialTypeId: string | null;
  modelId: string | null;
  finishId: string | null;
  productId: string | null;
  totalArea: number;
  wastePercentage: number;
  onManufacturerChange: (id: string | null) => void;
  onMaterialTypeChange: (id: string | null) => void;
  onModelChange: (id: string | null) => void;
  onFinishChange: (id: string | null) => void;
  onProductChange: (id: string | null) => void;
}

export default function MaterialSelector({
  manufacturerId,
  materialTypeId,
  modelId,
  finishId,
  productId,
  totalArea,
  wastePercentage,
  onManufacturerChange,
  onMaterialTypeChange,
  onModelChange,
  onFinishChange,
  onProductChange,
}: MaterialSelectorProps) {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [materialTypes, setMaterialTypes] = useState<MaterialType[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [finishes, setFinishes] = useState<Finish[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // Fetch manufacturers on mount
  useEffect(() => {
    supabase
      .from("manufacturers")
      .select("*")
      .order("name")
      .then(({ data }) => setManufacturers(data ?? []));
  }, []);

  // Fetch material types when manufacturer changes
  useEffect(() => {
    if (!manufacturerId) {
      setMaterialTypes([]);
      return;
    }
    supabase
      .from("material_types")
      .select("*")
      .eq("manufacturer_id", manufacturerId)
      .order("name")
      .then(({ data }) => setMaterialTypes(data ?? []));
  }, [manufacturerId]);

  // Fetch models when material type changes
  useEffect(() => {
    if (!materialTypeId) {
      setModels([]);
      return;
    }
    supabase
      .from("models")
      .select("*")
      .eq("material_type_id", materialTypeId)
      .order("name")
      .then(({ data }) => setModels(data ?? []));
  }, [materialTypeId]);

  // Fetch finishes when model changes
  useEffect(() => {
    if (!modelId) {
      setFinishes([]);
      return;
    }
    supabase
      .from("finishes")
      .select("*")
      .eq("model_id", modelId)
      .order("name")
      .then(({ data }) => setFinishes(data ?? []));
  }, [modelId]);

  // Fetch products when finish changes
  useEffect(() => {
    if (!finishId) {
      setProducts([]);
      return;
    }
    supabase
      .from("products")
      .select("*")
      .eq("finish_id", finishId)
      .eq("is_active", true)
      .order("thickness_mm", { ascending: false })
      .then(({ data }) => setProducts(data ?? []));
  }, [finishId]);

  const selectClass =
    "w-full rounded-lg border border-[#ebebed] px-4 py-2.5 text-base bg-white focus:border-brand focus:ring-2 focus:ring-brand/30 outline-none transition disabled:bg-[#f8f8f8] disabled:text-[#434343]";

  return (
    <div>
      <div className="space-y-4">
        {/* Manufacturer */}
        <div>
          <label className="block text-sm font-medium text-[#1e1e1e] mb-1">Producător</label>
          <select
            value={manufacturerId ?? ""}
            onChange={(e) => onManufacturerChange(e.target.value || null)}
            className={selectClass}
          >
            <option value="">— Selectează producătorul —</option>
            {manufacturers.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        {/* Material Type */}
        <div>
          <label className="block text-sm font-medium text-[#1e1e1e] mb-1">Tip material</label>
          <select
            value={materialTypeId ?? ""}
            onChange={(e) => onMaterialTypeChange(e.target.value || null)}
            disabled={!manufacturerId}
            className={selectClass}
          >
            <option value="">— Selectează tipul de material —</option>
            {materialTypes.map((mt) => (
              <option key={mt.id} value={mt.id}>{mt.name}</option>
            ))}
          </select>
        </div>

        {/* Model */}
        <div>
          <label className="block text-sm font-medium text-[#1e1e1e] mb-1">Model</label>
          <select
            value={modelId ?? ""}
            onChange={(e) => onModelChange(e.target.value || null)}
            disabled={!materialTypeId}
            className={selectClass}
          >
            <option value="">— Selectează modelul —</option>
            {models.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        {/* Finish */}
        <div>
          <label className="block text-sm font-medium text-[#1e1e1e] mb-1">Finisaj</label>
          <select
            value={finishId ?? ""}
            onChange={(e) => onFinishChange(e.target.value || null)}
            disabled={!modelId}
            className={selectClass}
          >
            <option value="">— Selectează finisajul —</option>
            {finishes.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>

        {/* Products (Thickness + Color) */}
        {finishId && products.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-[#1e1e1e] mb-2">Grosime</label>
            <div className="space-y-2">
              {products.map((p) => {
                const sheets = calculateSheets(totalArea, p.sheet_height_m, p.sheet_width_m, wastePercentage);
                const valueExVat = calculateTotalPrice(totalArea, p.price_per_sqm, wastePercentage);
                const totalWithVat = Number((valueExVat * (1 + VAT_RATE / 100)).toFixed(2));
                return (
                  <button
                    key={p.id}
                    onClick={() => onProductChange(p.id)}
                    className={`w-full text-left rounded-lg border-2 p-4 transition-all cursor-pointer ${
                      productId === p.id
                        ? "border-brand bg-brand/10"
                        : "border-[#ebebed] bg-white hover:border-teal"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold">{p.thickness_mm} mm</span>
                        {p.color && (
                          <span className="ml-2 text-sm px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                            {p.color}
                          </span>
                        )}
                      </div>
                      <span className="text-lg font-bold text-[#1e1e1e]">
                        {p.price_per_sqm.toFixed(2)} €/m²
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#ebebed]">
                      <p className="text-sm text-[#434343]">
                        {sheets} buc ({p.sheet_height_m}×{p.sheet_width_m} m/foaie)
                      </p>
                      <p className="text-sm font-semibold text-[#1e1e1e]">
                        ~{totalWithVat.toFixed(2)} € cu TVA
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
