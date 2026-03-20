"use client";

import Image from "next/image";
import { RoofType, RoofDimensions } from "@/lib/types";

interface DimensionInputProps {
  roofType: RoofType;
  dimensions: RoofDimensions;
  totalArea: number;
  onChange: (dims: Partial<RoofDimensions>) => void;
}

export default function DimensionInput({ roofType, dimensions, totalArea, onChange }: DimensionInputProps) {
  const imageSrc =
    roofType === "1_slope"
      ? "/images/acoperis-1-apa.svg"
      : "/images/acoperis-2-ape.svg";

  const fields: { key: keyof RoofDimensions; label: string; description: string }[] =
    roofType === "1_slope"
      ? [
          { key: "a", label: "A", description: "Înălțimea de la sol la baza acoperișului" },
          { key: "b", label: "B", description: "Lățimea acoperișului" },
          { key: "c", label: "C", description: "Înălțimea acoperișului" },
        ]
      : [
          { key: "a", label: "A", description: "Înălțimea de la sol la baza acoperișului" },
          { key: "b", label: "B", description: "Lățimea acoperișului" },
          { key: "c", label: "C", description: "Înălțimea pantei stângi" },
          { key: "d", label: "D", description: "Înălțimea pantei drepte" },
        ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Diagram */}
      <div className="flex items-center justify-center bg-gray-50 rounded-xl p-4">
        <Image
          src={imageSrc}
          alt={roofType === "1_slope" ? "Acoperiș 1 apă" : "Acoperiș 2 ape"}
          width={320}
          height={320}
        />
      </div>

      {/* Input fields */}
      <div className="space-y-3">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold mr-2">
                {field.label}
              </span>
              {field.description}
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                value={dimensions[field.key] || ""}
                onChange={(e) =>
                  onChange({ [field.key]: parseFloat(e.target.value) || 0 })
                }
                placeholder="0.00"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-12 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">m</span>
            </div>
          </div>
        ))}

        {/* Live area calculation */}
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-sm text-blue-600 mb-1">Suprafață totală acoperiș</p>
          <p className="text-3xl font-bold text-blue-700">{totalArea.toFixed(2)} m²</p>
        </div>
      </div>
    </div>
  );
}
