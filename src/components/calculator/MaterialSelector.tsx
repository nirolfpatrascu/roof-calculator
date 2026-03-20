"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Manufacturer, MaterialType, Model, Finish, Product } from "@/lib/types";

interface MaterialSelectorProps {
  manufacturerId: string | null;
  materialTypeId: string | null;
  modelId: string | null;
  finishId: string | null;
  productId: string | null;
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
    "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-base bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition disabled:bg-gray-100 disabled:text-gray-400";

  return (
    <div>
      <div className="space-y-4">
        {/* Manufacturer */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Producător</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Tip material</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Finisaj</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Grosime</label>
            <div className="space-y-2">
              {products.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onProductChange(p.id)}
                  className={`w-full text-left rounded-lg border-2 p-4 transition-all ${
                    productId === p.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
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
                    <span className="text-lg font-bold text-blue-600">
                      {p.price_per_sqm.toFixed(2)} €/m²
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Foaie: {p.sheet_height_m} × {p.sheet_width_m} m
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
