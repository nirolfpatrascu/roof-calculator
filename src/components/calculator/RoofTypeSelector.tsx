"use client";

import { RoofType } from "@/lib/types";

interface RoofTypeSelectorProps {
  selected: RoofType | null;
  onSelect: (type: RoofType) => void;
}

export default function RoofTypeSelector({ selected, onSelect }: RoofTypeSelectorProps) {
  return (
    <select
      value={selected ?? ""}
      onChange={(e) => onSelect(e.target.value as RoofType)}
      className="w-full rounded-lg border border-[#ebebed] px-4 py-2.5 text-base bg-white focus:border-brand focus:ring-2 focus:ring-brand/30 outline-none transition"
    >
      <option value="">— Selectează tipul de acoperiș —</option>
      <option value="1_slope">1 Apă — Acoperiș cu o singură pantă</option>
      <option value="2_slopes">2 Ape — Acoperiș cu două pante</option>
    </select>
  );
}
